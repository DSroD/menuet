import { useContext, useEffect, useRef } from "preact/hooks";
import QRCode from "react-qr-code";
import { AppContext, BASE_URL } from "../app";
import { encodeRestaurantData, useOnClickOutside } from "../utils";

interface QrPopupProps {
    onClose: () => void;
}

export default function QrPopup({ onClose }: QrPopupProps) {
    
    const { available } = useContext(AppContext);

    const modalRef = useRef(null);
    useOnClickOutside(modalRef, onClose);

    const paramStringMenu = encodeURI(encodeRestaurantData(available));

    return (
        <div class="flex justify-center items-center bg-slate-500/75 w-screen h-screen fixed top-0 left-0">
            <div class="min-w-[240px] bg-violet-600 p-4 border border-violet-500 rounded-lg flex flex-col space-y-4" ref={modalRef}>
                <div class="bg-white p-4">
                    <QRCode value={ `${BASE_URL ?? "localhost:3000/"}?menu=${paramStringMenu}` }/>
                </div>
            </div>
        </div>
    )

    
}