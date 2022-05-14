import { useCallback, useContext, useRef } from "preact/hooks";
import { QrReader } from "react-qr-reader";
import { AppContext } from "../app";
import { decodeRestaurantData, useOnClickOutside } from "../utils";
import { BrowserQRCodeReader } from '@zxing/browser';
import { Result } from '@zxing/library';

interface QrReaderPopupProps {
    onClose: () => void;
}

export default function QrReaderPopup({ onClose }: QrReaderPopupProps) {
    const { setAvailable, clearToBePaidForMenuItems } = useContext(AppContext);

    const modalRef = useRef(null);
    useOnClickOutside(modalRef, onClose);

    return (
        <div class="flex justify-center items-center bg-slate-500/75 w-screen h-screen fixed top-0 left-0">
            <div class="min-w-[240px] bg-violet-600 p-4 border border-violet-500 rounded-lg flex flex-col space-y-4" ref={modalRef}>
                <h2>Scan QR Code</h2>
                <QrReader
                    constraints={{
                        facingMode: 'environment'
                    }}

                    onResult={(result?: Result | undefined | null, error?: Error | undefined | null, reader?: BrowserQRCodeReader) => {
                    if (!!result)
                    {
                        let items = decodeRestaurantData(result.getText());
                        setAvailable(items);
                        clearToBePaidForMenuItems();
                        onClose();
                    }
                }} />
            </div>
        </div>
    )
}