export class LocalStorage {
    public static setLocalItem(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public static getLocalItem(key: string) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    public static removeLocalItem(key: string) {
        localStorage.removeItem(key);
    }

    public static removeAllLocal() {
        localStorage.clear();
    }
}
