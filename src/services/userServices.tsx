import { api } from '../helper/axios';
import { userEndPoints } from '../helper/endpoint';
import { SessionStorage } from '../helper/sessionStorage';
import { UserInterface } from '../interfaces/UserInterface';

export const getUsers = async () => {
    const response = await api.get(userEndPoints.getUsers);
    console.log('ths is too much resonse', response);
    if (response.data) return response.data;
};

export const addUsers = async (users: UserInterface) => {
    console.log(userEndPoints.addUsers, users, '>>>>>');
    const response = await api.post(userEndPoints.addUsers, users);
    if (response.status === 200) return response.data;
};

export const loginAdmin = async (credential: {
    email: string;
    password: string;
}) => {
    try {
        const url = userEndPoints.loginAdmin;
        const response = await api.post(url, credential);
        console.log('response', response);
        if (response)
            return {
                success: true,
                message: response.message,
                token: response.data.token,
            };
    } catch (error: any) {
        if (error.response.status === 404) {
            return {
                success: false,
                status: 404,
                message:
                    error.response.data.message ||
                    'An error occurred during login',
            };
        } else
            return {
                success: false,
                message:
                    error.response.data.message ||
                    'An error occurred during login',
            };
    }
};

export const verifyToken = async (token: string) => {
    try {
        const url = userEndPoints.verifyToken;
        const verifyResponse = await api.get(url, {
            headers: { Authorization: `${token}` },
        });
        if (verifyResponse) {
            console.log('reached here');
            SessionStorage.setSessionItem('user', verifyResponse.data);
            return { success: true, data: verifyResponse.data };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response.data.message || 'Internal Error Occured',
        };
    }
};
