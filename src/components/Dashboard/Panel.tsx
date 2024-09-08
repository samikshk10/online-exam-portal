import React from 'react';

interface PanelProps {
    title: string;
    content: string;
}

const Panel: React.FC<PanelProps> = ({ title, content }) => {
    return (
        <div className="bg-white shadow rounded p-4 text-sm md:text-base">
            <h2 className="font-bold">{title}</h2>
            <p>{content}</p>
        </div>
    );
};

export default Panel;
