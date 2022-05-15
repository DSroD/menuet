import { useCallback, useContext, useEffect, useRef, useState } from "preact/hooks";
import { AppContext } from "../../app";
import { encodeRestaurantData, useOnClickOutside, useQuery } from "../../utils";
import SavedMenu from "../saved_menu";

interface SaveMenuModalProps {
    onClose: () => void;
}

export default function SaveMenuModal({ onClose }: SaveMenuModalProps) {
    const modalRef = useRef(null);
    useOnClickOutside(modalRef, onClose);

    const query = useQuery()

    const { available } = useContext(AppContext);

    const [name, _setName] = useState("");

    const onChangeName = useCallback((e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.value.includes("|")) return;
        _setName(target.value);
    }, [_setName]);

    const onClickSavedMenu = useCallback((e: string) => {
        _setName(e);
    }, [_setName]);

    const onClickSubmit = useCallback(() => {
        if (name.length === 0) return;
        if (!savedMenus.includes(name))
            localStorage.setItem('saved_menus', [...savedMenus, name].join("|"));
        localStorage.setItem(name, encodeRestaurantData(available));
        // TODO: Throw an exception on error
        onClose();
    }, [name]);

    const savedMenus = localStorage.getItem('saved_menus')?.split('|') ?? [];

    useEffect(() => {
        if (!query.has("name")) return;
        _setName(query.get("name") ?? "")
    }, [])

    return (
        <div class="flex justify-center items-center bg-slate-500/75 w-screen h-screen fixed top-0 left-0">
            <div class="min-w-[240px] bg-violet-600 p-4 border border-violet-500 rounded-lg flex flex-col space-y-4" ref={modalRef}>
                <h2>Save Menu</h2>
                <div class="flex flex-col space-y-1 mx-6">
                    {
                        savedMenus.map(e => <SavedMenu name={e} onClick={onClickSavedMenu} selected={e === name} />)
                    }
                </div>
                <input type="text" placeholder="Menu Name" value={name} onChange={onChangeName} />
                <button onClick={onClickSubmit}>Save</button>
            </div>
        </div>
    )

}