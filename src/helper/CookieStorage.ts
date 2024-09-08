import Cookies from 'js-cookie';

export class CookieStorage {
    public static setCookieItem(
        key: string,
        value: any,
        options?: Cookies.CookieAttributes
    ) {
        Cookies.set(key, JSON.stringify(value), options);
    }

    public static getCookieItem(key: string) {
        const value = Cookies.get(key);
        return value ? JSON.parse(value) : null;
    }

    public static removeCookieItem(key: string) {
        Cookies.remove(key);
    }

    public static removeAllCookies() {
        const allCookies = Cookies.get();
        for (const key in allCookies) {
            if (Object.prototype.hasOwnProperty.call(allCookies, key)) {
                Cookies.remove(key);
            }
        }
    }
}
