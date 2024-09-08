import React from 'react';

interface CardProps {
    title: string;
    count: number;
}

const Card: React.FC<CardProps> = ({ title, count }) => {
    return (
        <div className=" bg-white shadow-sm  rounded p-4 text-center h-48 border-gray-200 border-[1px] border-solid flex flex-col justify-center align-center flex-1">
            <div className="text-lg md:text-2xl">{count}</div>
            <div className="text-gray-500 text-sm md:text-base">{title}</div>
        </div>
    );
};

export default Card;
