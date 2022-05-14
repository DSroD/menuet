import { useCallback, useRef, useState } from "preact/hooks";
import { useOnClickOutside } from "../../utils";

interface AddItemModalProps {
    onSubmit: (name: string, price: number) => void;
    onClose: () => void;
}

export default function AddItemModal({ onSubmit, onClose }: AddItemModalProps) {
    const modalRef = useRef(null);
    useOnClickOutside(modalRef, onClose);

    const [name, _setName] = useState('');
    const [price, _setPrice] = useState(0);

    const onChangeName = useCallback((e: Event) => {
        const target = e.target as HTMLInputElement;
        _setName(target.value);
    }, [_setName]);

    const onChangePrice = useCallback((e: Event) => {
        const target = e.target as HTMLInputElement;
        let price = parseFloat(target.value);
        if (isNaN(price)) 
        {
            e.preventDefault();
            return;
        }
        _setPrice(price);
    }, [_setPrice]);

    const onClickSubmit = useCallback(() => {
        onSubmit(name, price);
        onClose();
    }, [onSubmit, onClose, name, price]);

    return (
        <div class="flex justify-center items-center bg-slate-500/75 w-screen h-screen fixed top-0 left-0">
            <div class="bg-violet-600 p-4 border border-violet-500 rounded-lg flex flex-col space-y-4" ref={modalRef}>
                <h2>Add item</h2>
                <div class="flex flex-col sm:flex-row flex-wrap sm:space-x-4 justify-center p-4">
                    <div class="flex flex-col">
                        <label for="name">Item Name</label>
                        <input id="name" type="text" placeholder="Item" value={name} onChange={onChangeName} />
                    </div>
                    <div class="flex flex-col">
                        <label for="price">Price</label>
                        <input id="price" type="number" value={price} onChange={onChangePrice} />
                    </div>
                </div>
                <button onClick={onClickSubmit}>+</button>
            </div>
        </div>
    )
}