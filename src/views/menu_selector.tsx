import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {useCallback, useContext, useState} from 'preact/hooks';
import { AppContext, TipType } from '../app';
import AddItemModal from '../components/menu_selector/add_item_modal';
import LoadMenuModal from '../components/menu_selector/load_menu_modal';
import SaveMenuModal from '../components/menu_selector/save_menu_modal';
import QrReaderPopup from '../components/qr_reader_popup';
import QrPopup from '../components/qr_popup';
import { useEffect } from 'react';

interface ConsumedMenuItemProps {
    name: string;
    price: number;
    amount: number;
    onClickPlus: (name: string, price: number) => void;
    onClickMinus: (name: string) => void;
}

function ConsumedMenuItem({ name, price, amount, onClickMinus, onClickPlus }: ConsumedMenuItemProps) {

    const _onClickPlus = () => {
        onClickPlus(name, price);
    };

    const _onClickMinus = () => {
        onClickMinus(name);
    };
    
    return (
    <div class="flex justify-between items-center m-2">
            <span>{name}</span>
            <div class="flex justify-between min-w-[130px] items-baseline space-x-6">
                <span class="space-x-1">
                    <button class="py-1 px-2" onClick={_onClickPlus}>+</button>
                    <span>{amount}</span>
                    <button class="py-1 px-2" onClick={_onClickMinus}>-</button>
                </span>
                <span>{price}</span>
            </div>
    </div>)
}

interface MenuItemProps {
    name: string;
    price: number;
    onClick: (name: string, price: number) => void;
    onClickDelete: (name: string, price: number) => void;
}

function MenuItem({ name, price, onClick, onClickDelete }: MenuItemProps) {
    
    const _onClick = () => {
        onClick(name, price);
    };

    const _onClickDelete = () => {
        //TODO: Use modal, not base confirm?
        if (!confirm(`Delete ${name}?`)) return;
        onClickDelete(name, price);
    }

    return (
    <div class="flex flex-row space-x-2 items-baseline">
        <button class="flex justify-between mr-2 mb-2 border-b border-violet-300 focus-border hover-border grow" onClick={_onClick}>
            <div class="text-md">{name}</div>
            <div class="text-md">{price}</div>
        </button>
            <button onClick={_onClickDelete} class="w-8">
                <FontAwesomeIcon icon={faTrash} />
            </button>
    </div>)
}

type Modals = 'addItem' | 'loadMenu' | 'saveMenu' | 'readQR' | 'showQR' | null;

export default function MenuSelector() {

    const { available, toBePaidFor, tipType, tip, tipNearestRound, addAvailableMenuItem, removeAvailableMenuItem, setTipType, setTip, setTipNearestRound, addOneToToBePaidForMenuItemAmount, removeOneFromToBePayForMenuItemAmount } = useContext(AppContext);
    
    const onClickMenuItem = (name: string, price: number) => {
        addOneToToBePaidForMenuItemAmount(name, price);
    }

    const onClickDeleteMenuItem = (name: string, price: number) => {
        removeAvailableMenuItem(name)
    }

    const onClickConsumedMenuItemPlus = (name: string, price: number) => {
        addOneToToBePaidForMenuItemAmount(name, price);
    }

    const onClickConsumedMenuItemMinus = (name: string) => {
        removeOneFromToBePayForMenuItemAmount(name);
    }

    const onChangeTip = useCallback((e: Event) => {
        const target = e.target as HTMLInputElement;
        let tipValue = parseFloat(target.value);
        if (isNaN(tipValue)) tipValue = 0;
        setTip(tipValue);
    }, [setTip]);

    const onChangeTipType = useCallback((e: Event) => {
        const target = e.target as HTMLInputElement;
        setTipType(target.value as TipType);
    }, [setTipType]);

    const [alwaysTipUp, setAlwaysTipUp] = useState(true);

    const toggleAlwaysTipUp = useCallback(() => {
        setAlwaysTipUp(!alwaysTipUp);
    }, [alwaysTipUp, setAlwaysTipUp]);

    const onChangeTipNearestRound = useCallback((e: Event) => {
        const target = e.target as HTMLInputElement;
        let tipNearestRound = parseFloat(target.value);
        if (isNaN(tipNearestRound)) tipNearestRound = 1;
        if (tipNearestRound <= 0) tipNearestRound = 1;
        setTipNearestRound(tipNearestRound);
    }, [setTipNearestRound]);

    const subtotal = toBePaidFor?.reduce((acc, item) => acc + item.price * item.amount, 0) ?? 0;
    const tip_amount = tipType === 'percent' ? subtotal * tip / 100 : tip;
    const total_nr = subtotal + tip_amount;
    const tip_round =
        (alwaysTipUp
            ? Math.ceil(total_nr / tipNearestRound)
            : Math.round(total_nr / tipNearestRound))
        * tipNearestRound - total_nr;
    const total = total_nr + tip_round;

    const [visibleModal, setVisibleModal] = useState<Modals>(null);    

    const showAddItemModal = useCallback(() => {
        setVisibleModal('addItem');
    }, [setVisibleModal]);

    const showSaveMenuModal = useCallback(() => {
        setVisibleModal('saveMenu');
    }, [setVisibleModal]);

    const showLoadMenuModal = useCallback(() => {
        setVisibleModal('loadMenu');
    }, [setVisibleModal]);

    const showQrReaderPopup = useCallback(() => {
        setVisibleModal('readQR');
    }, [setVisibleModal]);

    const showQrPopup = useCallback(() => {
        setVisibleModal('showQR');
    }, [setVisibleModal]);

    const hideModal = useCallback(() => {
        setVisibleModal(null);
    }, [setVisibleModal]);

    return (
        <div class="lg:max-w-lg">
            {/** Consumed */}
            <div class="border-b mb-2 pb-2">
                <h2>You are paying for</h2>
                {(toBePaidFor && toBePaidFor.length > 0) ?
                <div class="flex flex-col">
                    {toBePaidFor.map(item => <ConsumedMenuItem
                        name={item.name}
                        price={item.price}
                        amount={item.amount}
                        onClickPlus={onClickConsumedMenuItemPlus}
                        onClickMinus={onClickConsumedMenuItemMinus}
                    />)}
                    {/** Total */}
                    <div>
                        <h2>Total</h2>
                        <div class="flex flex-col">    
                            <span class="text-lg">{total.toFixed(2)} ({subtotal.toFixed(2)} + {tip_amount.toFixed(2)} {tip_round < 0 ? "-" : "+"} {Math.abs(tip_round).toFixed(2)})</span>
                            <div class="text-sm"><input id="tip-checkbox" type="checkbox" checked={alwaysTipUp} onChange={toggleAlwaysTipUp} /> <label for='tip-checkbox'>Always tip up</label></div>
                        </div>
                    </div>
                </div>
                : <span>No items</span>}
            </div>
            {/** Available */}
            <div class="border-b mb-2 pb-2">
            <h2>Menu</h2>
                {(available && available.length > 0) &&
                <div class="flex flex-col">
                    {available.map(item => <MenuItem name={item.name} price={item.price} onClick={onClickMenuItem} onClickDelete={onClickDeleteMenuItem} />)}
                    </div>}
                <div class="flex flex-row justify-center space-x-2 flex-wrap">
                    <button onClick={showLoadMenuModal}>Load</button>
                    <button onClick={showAddItemModal}>Add/Edit Item</button>
                    <button onClick={showSaveMenuModal}>Save</button>
                    <button onClick={showQrReaderPopup}>Scan QR</button>
                    <button onClick={showQrPopup}>QR Link</button>
                </div>
            </div>
            {/** Tip options */}
            <div>
                <label for="tip-amount"><h2>Tip</h2></label>
                <div class="flex flex-row space-x-4 items-center">
                    <div>
                        <input id="tip-amount" type="number" value={tip} onChange={onChangeTip} />
                    </div>
                    <div class="flex flex-col items-start">
                        <span><input id="tip-type-percent" type="radio" name="tip-type" value="percent" checked={tipType === 'percent'} onChange={onChangeTipType} /> <label for="tip-type-percent">%</label></span>
                        <span><input id="tip-type-fixed" type="radio" name="tip-type" value="fixed" checked={tipType === 'fixed'} onChange={onChangeTipType} /> <label for="tip-type-fixed">Fixed</label></span>
                    </div>
                </div>
                <div>
                    <div class="flex flex-col">
                        <label for="tip-nearest-round" class="text-base">Round to nearest:</label>
                        <input id="tip-nearest-round" type="number" value={tipNearestRound} onChange={onChangeTipNearestRound} />
                    </div>
                    </div>
            </div>
            {/** Add item modal */}
            { visibleModal === 'addItem' &&
                <AddItemModal onClose={hideModal} onSubmit={addAvailableMenuItem} />
            }
            {/** Load menu modal */}
            { visibleModal === 'loadMenu' &&
                <LoadMenuModal onClose={hideModal} />
            }
            {/** Save menu modal */}
            { visibleModal === 'saveMenu' &&
                <SaveMenuModal onClose={hideModal} />
            }
            {/** Read items from QR code */}
            { visibleModal === 'readQR' &&
                <QrReaderPopup onClose={hideModal} />
            }
            {visibleModal === 'showQR' &&
                <QrPopup onClose={hideModal} />
            }
        </div>
    )
}