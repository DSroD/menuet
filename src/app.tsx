import { createContext } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { decodeRestaurantData, useQuery } from "./utils";
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
  setTip: (tip: number) => void;
  setTipType: (tipType: TipType) => void;
}

export const AppContext = createContext({ } as AppState);

export const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://localhost:3000';

export const RESERVED_CHARACTERS = ['|', '~'];

export function App() {

  const [tip, _setTip] = useState(10);
  const [tipType, _setTipType] = useState('percent');

  const [available, _setAvailable] = useState<MenuItemInfo[] | undefined | null>(undefined);
  const [toBePaidFor, _setToBePaidFor] = useState<ConsumedMenuItemInfo[] | undefined | null>(undefined);

  const setTip = useCallback((tip: number) => {
    _setTip(tip);
  }, [_setTip]);

  const setTipType = useCallback((tipType: TipType) => {
    _setTipType(tipType);
  }, [_setTipType]);

  const addAvailableMenuItem = useCallback((name: string, price: number) => {
    if (name === '') return;
    if (name.includes('|')) return;
    if (name.includes('\n')) return;
    if (isNaN(price)) return;

    if (!available) {
      _setAvailable([{ name, price }]);
      return;
    }
    if (available.find(x => x.name === name)) {
      return;
    }
    _setAvailable([...available, { name, price }]);
  }, [available, _setAvailable]);

  const setAvailable = useCallback((available: MenuItemInfo[]) => {
    _setAvailable(available);
  }, [_setAvailable]);

  const removeAvailableMenuItem = useCallback((name: string) => {
    if (!available) return;
    _setAvailable(available.filter(x => x.name !== name));
    _setToBePaidFor(toBePaidFor?.filter(x => x.name !== name))
  }, [available, _setAvailable]);

  const addToBePaidForMenuItem = useCallback((name: string, price: number) => {
    if (!toBePaidFor) {
      _setToBePaidFor([{ name, price, amount: 1 }]);
    } else {
      _setToBePaidFor([...toBePaidFor, { name, price, amount: 1 }]);
    }
  }, [toBePaidFor, _setToBePaidFor]);

  const addOneToToBePaidForMenuItemAmount = useCallback((name: string, price: number) => {

    if (name === '') return;
    if (isNaN(price)) return;

    let toBePaidForCopy = [...toBePaidFor ?? []];
    let indexOf = toBePaidForCopy.findIndex(x => x.name === name);
    if (indexOf === -1) toBePaidForCopy.push({ name, price, amount: 1 });
    else toBePaidForCopy[indexOf].amount++;
    _setToBePaidFor(toBePaidForCopy);
  }, [toBePaidFor, _setToBePaidFor]);

  const removeOneFromToBePayForMenuItemAmount = useCallback((name: string) => {
    let toBePaidForCopy = [...toBePaidFor ?? []];
    let indexOf = toBePaidForCopy.findIndex(x => x.name === name);
    if (indexOf === -1) return;

    if (toBePaidForCopy[indexOf].amount === 1) toBePaidForCopy.splice(indexOf, 1);
    else toBePaidForCopy[indexOf].amount--;
    _setToBePaidFor(toBePaidForCopy);
  }, [toBePaidFor, _setToBePaidFor]);

  const removeToBePaidForMenuItem = useCallback((name: string) => {
    let toBePaidForCopy = [...toBePaidFor ?? []];
    let indexOf = toBePaidForCopy.findIndex(x => x.name === name);
    if (indexOf === -1) return;
    toBePaidForCopy.splice(indexOf, 1);
    _setToBePaidFor(toBePaidForCopy);
  }, [toBePaidFor, _setToBePaidFor]);

  const clearToBePaidForMenuItems = useCallback(() => {
    _setToBePaidFor([]);
  }, [_setToBePaidFor]);

  const query = useQuery()

  useEffect(() => {
    if (!query.has("menu")) return;
    _setAvailable(decodeRestaurantData(query.get("menu") ?? ""))
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
      setTip,
      setTipType
    } as AppState}>
      <div class="p-2">
        <h1>Menuet</h1>
        <MenuSelector />
      </div>
    </AppContext.Provider>
  )
}
