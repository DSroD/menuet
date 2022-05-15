import { createContext } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { decodeOrders, decodeRestaurantData, decodeTipData, encodeOrders, encodeRestaurantData, encodeTipData, updateQuery, useQuery } from "./utils";
import MenuSelector from "./views/menu_selector";

export interface MenuItemInfo {
  name: string;
  price: number;
}

export interface ConsumedMenuItemInfo {
  name: string;
  price: number;
  amount: number;
}

export type TipType = 'percent' | 'fixed';

type AppState = {
  available: MenuItemInfo[] | undefined | null;
  toBePaidFor: ConsumedMenuItemInfo[] | undefined | null;
  addAvailableMenuItem: (name: string, price: number) => void;
  setAvailable: (available: MenuItemInfo[]) => void;
  removeAvailableMenuItem: (name: string) => void;
  addToBePaidForMenuItem: (name: string, price: number) => void;
  addOneToToBePaidForMenuItemAmount: (name: string, price: number) => void;
  removeOneFromToBePayForMenuItemAmount: (name: string) => void;
  removeToBePaidForMenuItem: (name: string) => void;
  clearToBePaidForMenuItems: () => void;
  tipType: TipType;
  tip: number;
  tipNearestRound: number;
  setTip: (tip: number) => void;
  setTipType: (tipType: TipType) => void;
  setTipNearestRound: (tipRound: number) => void;
}

export const AppContext = createContext({ } as AppState);

export const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://localhost:3000';

export const RESERVED_CHARACTERS = ['|', '~'];

export function App() {

  const [tip, _setTip] = useState(10);
  const [tipType, _setTipType] = useState<TipType>('percent');
  const [tipNearestRound, _setTipNearestRound] = useState(1);

  const [available, _setAvailable] = useState<MenuItemInfo[] | undefined | null>(undefined);
  const [toBePaidFor, _setToBePaidFor] = useState<ConsumedMenuItemInfo[] | undefined | null>(undefined);

  const setTip = useCallback((tip: number) => {
    localStorage.setItem('~tips', encodeTipData(tip, tipNearestRound, tipType))
    _setTip(tip);
  }, [_setTip, tipNearestRound, tipType]);

  const setTipType = useCallback((tipType: TipType) => {
    localStorage.setItem('~tips', encodeTipData(tip, tipNearestRound, tipType))
    _setTipType(tipType);
  }, [_setTipType, tip, tipNearestRound]);

  const setTipNearestRound = useCallback((tipRound: number) => {
    localStorage.setItem('~tips', encodeTipData(tip, tipRound, tipType))
    _setTipNearestRound(tipRound)
  }, [_setTipNearestRound, tip, tipType])

  const setAvailable = useCallback((available: MenuItemInfo[]) => {
    localStorage.setItem("~available", encodeRestaurantData(available));
    _setAvailable(available);
  }, [_setAvailable]);

  const setToBePaidFor = useCallback((order: ConsumedMenuItemInfo[] | null | undefined) => {
    localStorage.setItem("~orders", encodeOrders(order));
    _setToBePaidFor(order);
  }, [_setToBePaidFor])

  const addAvailableMenuItem = useCallback((name: string, price: number) => {
    if (name === '') return;
    if (name.includes('|')) return;
    if (name.includes('\n')) return;
    if (isNaN(price)) return;

    if (!available) {
      setAvailable([{ name, price }]);
      return;
    }
    if (available.find(x => x.name === name)) {
      return;
    }
    setAvailable([...available, { name, price }]);
  }, [available, setAvailable]);

  const removeAvailableMenuItem = useCallback((name: string) => {
    if (!available) return;
    setAvailable(available.filter(x => x.name !== name));
    setToBePaidFor(toBePaidFor?.filter(x => x.name !== name))
  }, [available, setAvailable]);

  const addToBePaidForMenuItem = useCallback((name: string, price: number) => {
    if (!toBePaidFor) {
      setToBePaidFor([{ name, price, amount: 1 }]);
    } else {
      setToBePaidFor([...toBePaidFor, { name, price, amount: 1 }]);
    }
  }, [toBePaidFor, setToBePaidFor]);

  const addOneToToBePaidForMenuItemAmount = useCallback((name: string, price: number) => {

    if (name === '') return;
    if (isNaN(price)) return;

    let toBePaidForCopy = [...toBePaidFor ?? []];
    let indexOf = toBePaidForCopy.findIndex(x => x.name === name);
    if (indexOf === -1) toBePaidForCopy.push({ name, price, amount: 1 });
    else toBePaidForCopy[indexOf].amount++;
    setToBePaidFor(toBePaidForCopy);
  }, [toBePaidFor, setToBePaidFor]);

  const removeOneFromToBePayForMenuItemAmount = useCallback((name: string) => {
    let toBePaidForCopy = [...toBePaidFor ?? []];
    let indexOf = toBePaidForCopy.findIndex(x => x.name === name);
    if (indexOf === -1) return;

    if (toBePaidForCopy[indexOf].amount === 1) toBePaidForCopy.splice(indexOf, 1);
    else toBePaidForCopy[indexOf].amount--;
    setToBePaidFor(toBePaidForCopy);
  }, [toBePaidFor, setToBePaidFor]);

  const removeToBePaidForMenuItem = useCallback((name: string) => {
    let toBePaidForCopy = [...toBePaidFor ?? []];
    let indexOf = toBePaidForCopy.findIndex(x => x.name === name);
    if (indexOf === -1) return;
    toBePaidForCopy.splice(indexOf, 1);
    setToBePaidFor(toBePaidForCopy);
  }, [toBePaidFor, setToBePaidFor]);

  const clearToBePaidForMenuItems = useCallback(() => {
    setToBePaidFor([]);
  }, [setToBePaidFor]);

  const query = useQuery();

  useEffect(() => {
    const tipData = localStorage.getItem("~tips");
    if (!!tipData) {
      const parsedTipData = decodeTipData(tipData);
      if (!!parsedTipData) {
        _setTip(parsedTipData.tip);
        _setTipNearestRound(parsedTipData.round);
        _setTipType(parsedTipData.tipType);
      }
    }
    if (query.has("menu")) {
      const hasItems = !!localStorage.getItem("~available") || !!localStorage.getItem("~orders")
      if (!hasItems || (hasItems && confirm("Delete last session orders?"))) {
        setAvailable(decodeRestaurantData(query.get("menu") ?? ""))
        updateQuery("");
        return;
      }
    }
    // Query is empty or session is to be kept - load from storage
    updateQuery("");
    const available = localStorage.getItem("~available")
    if (!available) return;
    const parsed_available = decodeRestaurantData(available)
    _setAvailable(parsed_available);
    const orders = localStorage.getItem("~orders");
    if (!orders) return;
    const parsed_orders = decodeOrders(orders);
    _setToBePaidFor(parsed_orders);
  }, [])

  return (
    <AppContext.Provider value={{
      available,
      toBePaidFor,
      addAvailableMenuItem,
      setAvailable,
      removeAvailableMenuItem,
      addToBePaidForMenuItem,
      addOneToToBePaidForMenuItemAmount,
      removeOneFromToBePayForMenuItemAmount,
      removeToBePaidForMenuItem,
      clearToBePaidForMenuItems,
      tipType,
      tip,
      tipNearestRound,
      setTip,
      setTipType,
      setTipNearestRound,
    } as AppState}>
      <div class="p-2">
        <h1>Menuet</h1>
        <MenuSelector />
      </div>
    </AppContext.Provider>
  )
}
