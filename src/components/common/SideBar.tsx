import React, { useState } from 'react';
import { AiOutlineSetting } from 'react-icons/ai';
import { HiUserAdd } from 'react-icons/hi';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Link } from 'react-router-dom';

import {
    FaHome,
    FaPaperclip as ExamScheduleIcon,
    FaUserPlus,
} from 'react-icons/fa';

const Sidebar: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: <FaHome /> },
        { path: '/manage-user', label: 'Manage User', icon: <FaUserPlus /> },
        // { path: '/quiz-manage', label: 'Quiz Manage', icon: <AiOutlineSetting /> },
        { path: '/add-exam', label: 'Exam Manage', icon: <AiOutlineSetting /> },
        {
            path: '/add-exam',
            label: 'Exam Schedule',
            icon: <ExamScheduleIcon />,
        },
        {
            label: 'Manage Settings',
            icon: <AiOutlineSetting />,
            isDropdown: true,
            subItems: [{ path: '/reset-password', label: 'Reset Password' }],
        },
    ];

    const handleClick = (index: number) => {
        if (menuItems[index].isDropdown) {
            setIsDropdownOpen(!isDropdownOpen);
            setActiveIndex(index);
        } else {
            setActiveIndex(index);
            setIsDropdownOpen(false);
        }
    };

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen hidden md:block">
            <div className="p-4 font-bold">Exam Portal</div>
            <ul>
                {menuItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <li
                            className={`hover:bg-gray-700 ${activeIndex === index ? 'bg-gray-600' : ''}`}
                        >
                            <Link
                                to={item.path || '#'}
                                className="p-4 w-full h-full flex items-center"
                                onClick={() => handleClick(index)}
                            >
                                <span className="mr-3 flex-shrink-0 flex items-center">
                                    {item.icon}
                                </span>
                                <span className="flex-1">{item.label}</span>
                                {item.isDropdown && (
                                    <span className="ml-2">
                                        {isDropdownOpen ? (
                                            <IoIosArrowUp />
                                        ) : (
                                            <IoIosArrowDown />
                                        )}
                                    </span>
                                )}
                            </Link>
                        </li>
                        {item.isDropdown && isDropdownOpen && (
                            <ul className="bg-gray-700">
                                {item.subItems?.map((subitem, subindex) => (
                                    <li
                                        key={subindex}
                                        className={`hover:bg-gray-600 ${activeIndex === index ? '' : ''}`}
                                    >
                                        <Link
                                            to={subitem.path}
                                            className="p-4 w-full h-full flex items-center pl-8"
                                            onClick={() => handleClick(index)}
                                        >
                                            {subitem.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </React.Fragment>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
