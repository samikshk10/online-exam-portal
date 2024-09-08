import ErrorImage from '../assets/Images/errorpage.jpg';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <img
                    src={ErrorImage}
                    alt="404 Not Found"
                    className="mx-auto mb-6"
                    height={'400px'}
                    width={'500px'}
                />
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops!</h1>
                <p className="text-lg text-gray-600 mb-6">
                    The page you are looking for does not exist.
                </p>
                <Link
                    to="/"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                >
                    Go Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
