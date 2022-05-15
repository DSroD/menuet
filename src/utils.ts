import { MutableRef, useEffect } from "preact/hooks";
import { urlToHttpOptions } from "url";
import { BASE_URL, ConsumedMenuItemInfo, MenuItemInfo } from "./app";

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
    return menuItems.map(e => `${e.name}|${e.price}`).join('~');
}

export function decodeRestaurantData(data: string) {
    return data.split('~').map(item => {
        let parts = item.split('|')
        if (parts.length != 2) return;
        let price = parseFloat(parts[1]);
        if (isNaN(price)) return;
        if (parts[0].length === 0) return;
        return { name: parts[0], price } as MenuItemInfo;
    }).filter(notEmpty)
}

export function encodeOrders(menuItems: ConsumedMenuItemInfo[] | null | undefined) {
    if (!menuItems) return '';
    return menuItems.map(e => `${e.name}|${e.price}|${e.amount}`).join(`~`);
}

export function decodeOrders(data: string) {
    return data.split('~').map(item => {
        let parts = item.split('|')
        if (parts.length != 3) return;
        let price = parseFloat(parts[1]);
        let amount = parseInt(parts[2]);
        if (isNaN(price) || isNaN(amount)) return;
        if (parts[0].length === 0) return;
        return { name: parts[0], price, amount } as ConsumedMenuItemInfo;
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

export function updateQuery(newQuery: string) {
    const url = new URL(window.location.href)
    var newSearchParams = new URLSearchParams(newQuery)
    url.search = newSearchParams.toString();
    const url_string = url.toString()
    window.history.pushState({path: url_string}, "", url_string);
}