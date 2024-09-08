import { SessionStorage } from './sessionStorage';

export const getTokenData = () => {
    const token = SessionStorage.getSessionItem('token');
    if (token) {
        return { token };
    }
    return null;
};
