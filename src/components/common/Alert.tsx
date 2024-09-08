import React from 'react';
import { enterFullscreen } from '../../helper/helper';

interface AlertType {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

function Alert({ isOpen, onClose, children }: AlertType) {
    if (!isOpen) return null;

    function handleOkBtnClick() {
        enterFullscreen();
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg h-max w-max shadow-lg py-4 px-2">
                <div className="flex justify-between items-center px-4">
                    <h2>Alert</h2>
                </div>
                <div className="p-4 max-w-[400px] ">{children}</div>
                <div className="flex justify-end gap-4 px-4 py-2">
                    <button
                        className="w-[35px] h-[35px] rounded-[50%] hover:bg-[#ccc]"
                        onClick={handleOkBtnClick}
                    >
                        Ok
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Alert;
