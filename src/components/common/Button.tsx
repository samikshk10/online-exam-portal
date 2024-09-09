import React from 'react';

interface ButtonType {
    children: React.ReactNode;
    variant: 'primary' | 'danger' | 'secondary';
    disabled?: boolean;
    outline?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    handleBtnClick?: (e: React.FormEvent) => void;
}

function Button({
    children,
    variant,
    disabled,
    outline,
    type,
    className,
    handleBtnClick,
}: ButtonType) {
    const baseClasses =
        'border-2 border-solid h-fit rounded-[7px] py-[2px] px-[10px] text-[18px] font-normal flex items-center gap-2';
    const cursorClasses = disabled ? 'cursor-not-allowed' : 'cursor-pointer';
    const outlineClasses = outline ? 'bg-transparent' : 'text-white';

    const variantClasses = {
        danger: `border-red-500 ${outline ? 'text-red-500' : 'bg-red-500 text-white'}`,
        primary: `border-[#3b82f6] ${outline ? 'text-[#3b82f6]' : 'bg-[#3b82f6] text-white'}`,
        secondary: `border-[#47a992] ${outline ? 'text-[#47a992]' : 'bg-[#47a992] text-white'}`,
    };

    const disabledClasses = `disabled:border-gray-400 ${!outline && 'disabled:bg-gray-400'} disabled:text-gray-300`;

    return (
        <button
            type={type || 'button'}
            onClick={handleBtnClick}
            disabled={disabled}
            className={`${className && className} ${baseClasses} ${cursorClasses} ${outlineClasses} ${variantClasses[variant]} ${disabledClasses}`}
        >
            {children}
        </button>
    );
}

export default Button;
