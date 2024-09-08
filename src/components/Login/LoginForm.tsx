import * as Yup from 'yup';
import CryptoJS from 'crypto-js';
import React from 'react';
import { useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CookieStorage } from '../../helper/CookieStorage';
import { LocalStorage } from '../../helper/localStorage';
import { SessionStorage } from '../../helper/sessionStorage';
import { Toast } from '../../helper/toast';
import { loginExam } from '../../services/examService';
import { loginAdmin } from '../../services/userServices';

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Password is required'),
        }),
        validateOnBlur: false,
        onSubmit: async (values) => {
            console.log(values.email, values.password, token);
            if (token) {
                const login = await loginExam({
                    email: values.email,
                    password: values.password,
                    token,
                });
                if (login?.success === true) {
                    Toast.Success(login.message);
                    SessionStorage.setSessionItem('token', token);
                    console.log('login.data.userId', login.data.userId);
                    LocalStorage.setLocalItem('examId', login.data.examId);
                    LocalStorage.setLocalItem('userId', login.data?.userId);
                    navigate('/exam-playground?examId=' + login.data.examId);
                } else {
                    Toast.Error(login?.message);
                }
            } else {
                const encryptedPassword = CryptoJS.AES.encrypt(
                    values.password,
                    import.meta.env.VITE_SECRET_KEY
                ).toString();

                const response = await loginAdmin({
                    email: values.email,
                    password: encryptedPassword,
                });

                if (response?.status === 404) {
                    return Toast.Error(
                        'Token not found',
                        undefined,
                        undefined,
                        'Please check your mail and try again'
                    );
                } else if (response?.success === true) {
                    CookieStorage.setCookieItem('authToken', response.token);
                    Toast.Success(response.message);
                    navigate('/');
                    return;
                }

                Toast.Error(response?.message);
            }
        },
    });

    return (
        <div className="flex-1 p-10 md:p-16 ">
            <div className="max-w-md w-full space-y-6">
                <div className="flex justify-center">
                    <svg
                        fill="#000000"
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="50px"
                        height="50px"
                        viewBox="796 796 200 200"
                        enableBackground="new 796 796 200 200"
                    >
                        <path
                            d="M896,796c-55.14,0-99.999,44.86-99.999,100c0,55.141,44.859,100,99.999,100c55.141,0,99.999-44.859,99.999-100
    C995.999,840.86,951.141,796,896,796z M896.639,827.425c20.538,0,37.189,19.66,37.189,43.921c0,24.257-16.651,43.924-37.189,43.924
    s-37.187-19.667-37.187-43.924C859.452,847.085,876.101,827.425,896.639,827.425z M896,983.86
    c-24.692,0-47.038-10.239-63.016-26.695c-2.266-2.335-2.984-5.775-1.84-8.82c5.47-14.556,15.718-26.762,28.817-34.761
    c2.828-1.728,6.449-1.393,8.91,0.828c7.706,6.958,17.316,11.114,27.767,11.114c10.249,0,19.69-4.001,27.318-10.719
    c2.488-2.191,6.128-2.479,8.932-0.711c12.697,8.004,22.618,20.005,27.967,34.253c1.144,3.047,0.425,6.482-1.842,8.817
    C943.037,973.621,920.691,983.86,896,983.86z"
                        />
                    </svg>
                </div>
                <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                    LOGIN
                </h2>
                <p className="text-center text-gray-600 text-lg">
                    Welcome to Online Exam Portal
                </p>
                <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
                    <div className="relative mt-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formik.values.email}
                            autoComplete="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-600 text-sm">
                                {formik.errors.email}
                            </div>
                        ) : null}
                    </div>
                    <div className="relative mt-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formik.values.password}
                            autoComplete="current-password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-600 text-sm">
                                {formik.errors.password}
                            </div>
                        ) : null}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Sign in
                        </button>
                    </div>
                    <div className="text-center text-sm text-gray-600">
                        Not registered yet?{' '}
                        <a
                            href="#"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Create an Account
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
