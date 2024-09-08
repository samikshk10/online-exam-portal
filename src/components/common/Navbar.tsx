import Button from './Button';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CookieStorage } from '../../helper/CookieStorage';
import { SessionStorage } from '../../helper/sessionStorage';
import { Toast } from '../../helper/toast';

const Navbar: React.FC = () => {
    const [user, setUserData] = useState<any>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const getUserDetails = SessionStorage.getSessionItem('user');
        setUserData(getUserDetails);
    }, []);

    const name = user?.fullName || 'User';
    const initials = name.split(' ').map((word) => word[0].toUpperCase());

    const displayInitials =
        initials.length >= 2
            ? initials.slice(0, 2).join('')
            : initials[0] + initials[0];

    const handleSignOut = () => {
        CookieStorage.removeAllCookies();

        navigate('/login');
        Toast.Success('Logged out successfully');
    };

    return (
        <div className="bg-blue-900 text-white flex items-center justify-between p-4 md:p-6">
            <div className="font-bold text-sm md:text-base">
                Welcome to We-Share App
            </div>
            <div className="flex items-center space-x-4">
                <Button
                    variant="primary"
                    handleBtnClick={handleSignOut}
                    className="border-[0.1px] border-white hover:bg-blue-600 "
                >
                    Log out
                </Button>
                <div className="bg-white text-black p-2 rounded-full text-xs md:text-sm">
                    {displayInitials}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
