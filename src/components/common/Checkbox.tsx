// components/common/Checkbox.tsx
import React, { ChangeEvent } from 'react';

interface CheckboxProps {
    isChecked: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ isChecked, onChange }) => {
    return (
        <input
            type="checkbox"
            checked={isChecked}
            onChange={onChange}
            className="form-checkbox h-5 w-5 text-blue-600"
        />
    );
};

export default Checkbox;
