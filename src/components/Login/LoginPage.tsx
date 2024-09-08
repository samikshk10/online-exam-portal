import React from 'react';
import LoginForm from './LoginForm';
import Image from '../../assets/Images/onlineexamimage.jpg';

const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="flex flex-col md:flex-row bg-white h-screen md:h-auto rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
                <div
                    className="flex-1 bg-contain bg-center hidden md:block bg-no-repeat"
                    style={{ backgroundImage: `url(${Image})` }}
                ></div>
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
