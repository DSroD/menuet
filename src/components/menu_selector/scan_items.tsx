import { useCallback, useState } from "preact/hooks";
import { ReadMenu } from "../../menu_reader/ocr_menu_read";

export default function MenuItemScanner()
{

    const [text, _setText] = useState('');
    const [file, _setFile] = useState<File | null>(null);

    const showPercentage = (obj: any) => {
        console.log(obj);
        if (obj.progress && obj.status) {
            if (obj.status !== "recognizing text") return;
            let perct = parseFloat(obj.progress);
            if (isNaN(perct)) return;
            _setText((perct * 100).toFixed(1) + '%');
        }
    }

    const onFileChanged = useCallback((e: Event) => {
        const target = e.target as HTMLInputElement;
        if (!target.files || !target.files.length) return;
        _setFile(target.files[0]);
        ReadMenu(target.files[0], showPercentage).then(menu => {
            _setText(menu);
        });

    }, [_setText]);

    return (
        <div>
        <h2>Scan</h2>
        <input type='file' id='menu-scan' onChange={onFileChanged} />
        {file && <img src={URL.createObjectURL(file)} />}
        {text}
        
        </div>
    )
}