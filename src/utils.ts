import { MutableRef, useEffect } from "preact/hooks";
import { MenuItemInfo } from "./app";

// source: https://usehooks.com/useOnClickOutside/
export function useOnClickOutside<T extends HTMLElement | null>(ref: MutableRef<T>, handler: (event: MouseEvent | TouchEvent) => void) {
    useEffect(
      () => {
            const listener = (event: MouseEvent | TouchEvent) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!ref.current || (event.target instanceof Node && ref.current.contains(event.target))) {
                return;
            }
            if (event.target instanceof HTMLElement && (event.target as HTMLElement).getAttribute("data-ignore-click-outside") === "true") {
                return;
            }
                handler(event);
            };
            document.addEventListener("click", listener);
            return () => {
                document.removeEventListener("click", listener);
            };
        }, [ref, handler]);
}

export function encodeRestaurantData(menuItems: MenuItemInfo[] | null | undefined) {
    if (!menuItems) return '';
    return menuItems.map(e => `${e.name}|${e.price}`).join('\n');
}

export function decodeRestaurantData(data: string) {
    return data.split('\n').map(item => {
        let parts = item.split('|')
        if (parts.length != 2) return;
        let price = parseFloat(parts[1]);
        if (isNaN(price)) return;
        return { name: parts[0], price } as MenuItemInfo;
    }).filter(notEmpty)
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    if (value === null || value === undefined) return false;
    const testDummy: TValue = value;
    return true;
}
  
export function useQuery() {
    return new URLSearchParams(location.search)
}