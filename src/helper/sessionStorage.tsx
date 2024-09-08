export class SessionStorage {
    public static setSessionItem(key: string, value: any) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    public static getSessionItem(key: string) {
        const value = sessionStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    public static removeSessionItem(key: string) {
        sessionStorage.removeItem(key);
    }
    public static removeAllSession() {
        sessionStorage.clear();
    }
}
