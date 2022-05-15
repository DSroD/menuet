import { useCallback, useRef, useState, useContext, useEffect } from "preact/hooks";
import { AppContext, MenuItemInfo } from "../../app";
import { decodeRestaurantData, useOnClickOutside } from "../../utils";
import SavedMenu from "../saved_menu";

interface LoadMenuModal {
    onClose: () => void;
}

export default function LoadMenuModal({ onClose }: LoadMenuModal) {
    const modalRef = useRef(null);
    useOnClickOutside(modalRef, onClose);

    const { setAvailable, clearToBePaidForMenuItems } = useContext(AppContext);

    const [selected, setSelected] = useState("");
    const [savedMenus, setSavedMenus] = useState([] as string[]);

    useEffect(() => {
        const newSavedMenus = localStorage.getItem("saved_menus")?.split("|") ?? [];
        setSavedMenus(newSavedMenus);
    }, [setSavedMenus])

    const onClickSubmit = useCallback(() => {
        const menu = localStorage.getItem(selected);
        if (menu) {
            const parsed = decodeRestaurantData(menu);
            setAvailable(parsed);
            clearToBePaidForMenuItems();
        }
        onClose();
    }, [onClose, setAvailable, selected]);

    const onClickDelete = useCallback((name: string) => {
        if (!confirm(`Delete ${name}?`)) return;
        const newSavedMenus = savedMenus.filter((menu) => menu !== name);
        localStorage.setItem("saved_menus", newSavedMenus.join("|"));
        localStorage.removeItem(name);
        setTimeout(() => {
            setSavedMenus(newSavedMenus);
        }, 20);
    }, [savedMenus, setSavedMenus]);


    return (
        <div class="flex justify-center items-center bg-slate-500/75 w-screen h-screen fixed top-0 left-0">
            <div class="min-w-[240px] bg-violet-600 p-4 border border-violet-500 rounded-lg flex flex-col space-y-4" ref={modalRef}>
                <h2>Load Menu</h2>
                <div class="flex flex-col space-y-1 mx-6">
                    {
                        savedMenus.map(e => <SavedMenu name={e} onClick={setSelected} selected={e === selected} onClickDelete={onClickDelete} />)
                    }
                </div>
                <button onClick={onClickSubmit}>Load</button>
            </div>
        </div>
    )
}