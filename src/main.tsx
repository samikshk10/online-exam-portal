import './index.css';
import Dashboard from './components/Dashboard/Dashboard';
import ExamCompletion from './pages/ExamCompletion';
import ExamDeviceCheck from './pages/ExamDeviceCheck';
import ExamManage from './components/Dashboard/Exam/ExamManage';
import ExamPortal from './pages/ExamPortal';
import Layout from './components/Dashboard/Layout';
import LoginPage from './components/Login/LoginPage';
import ManageExams from './components/Dashboard/Exam/ExamManage/ManageExams';
import ManageUsers from './components/Users/ManageUsers';
import NotFoundPage from './pages/PageNotFoundPage';
import PrivateRoute from './components/Routes/PrivateRoutes';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ResetPassword from './components/Settings/ResetPassword';
import ViewResult from './components/Dashboard/Exam/ViewResult';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { store } from './app/store';

const App = () => {
    const [canAccessExamPortal, setCanAccessExamPortal] = useState(true);

    const router = createBrowserRouter([
        {
            path: '/exam-playground',
            element: (
                <ExamDeviceCheck
                    setCanAccessExamPortal={setCanAccessExamPortal}
                />
            ),
        },
        {
            path: '/exam-portal',
            element: canAccessExamPortal ? (
                <ExamPortal />
            ) : (
                <ExamDeviceCheck
                    setCanAccessExamPortal={setCanAccessExamPortal}
                />
            ),
        },
        {
            path: '/exam-completed',
            element: <ExamCompletion />,
        },
        {
            path: '/login',
            element: <LoginPage />,
        },
        {
            path: '/',

            element: (
                <PrivateRoute>
                    <Layout />{' '}
                </PrivateRoute>
            ),
            // element: <Layout />,
            children: [
                {
                    path: '/',
                    element: <Dashboard />,
                },
                {
                    path: '/quiz-manage',
                    element: <ExamManage />,
                },
                {
                    path: '/manage-user',
                    element: <ManageUsers />,
                },
                {
                    path: '/add-exam',
                    element: <ManageExams />,
                },
                // {
                //     path: "/manage-admin",
                //     element: <ManageAdmin />
                // },
                {
                    path: '/reset-password',
                    element: <ResetPassword />,
                },
                {
                    path: '/view-result',
                    element: <ViewResult />,
                },
            ],
        },

        {
            path: '*',
            element: <NotFoundPage />,
        },
    ]);

    return (
        <React.StrictMode>
            <Provider store={store}>
                <RouterProvider router={router} />
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </Provider>
        </React.StrictMode>
    );
};

export default App;

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
