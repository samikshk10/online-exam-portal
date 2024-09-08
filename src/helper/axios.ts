import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
});

// todo
// use secure-ls package to set and get the local storage data

api.interceptors.request.use(
    function (req) {
        // Do something before request is sent
        const token = localStorage.getItem('token');

        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }

        // check if its a multipart-form-data
        if (req.data instanceof FormData) {
            req.headers['Content-Type'] = 'multipart/form-data';
        } else {
            req.headers['Content-Type'] = 'application/json';
        }
        return req;
    },
    function (error) {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        return Promise.reject(error);
    }
);
