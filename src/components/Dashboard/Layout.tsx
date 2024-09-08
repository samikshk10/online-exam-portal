import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/SideBar';
import Navbar from '../common/Navbar';

const Layout: React.FC = () => {
    return (
        <div className="flex">
            <div className="fixed left-0 top-0 bottom-0">
                <Sidebar />
            </div>

            <div className="flex-1">
                <div className="fixed top-0 right-0 left-0 z-50 md:ml-64">
                    <Navbar />
                </div>
                <main className="p-4 mt-20 md:ml-64">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
