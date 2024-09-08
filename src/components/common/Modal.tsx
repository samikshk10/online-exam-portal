import React, { FormEvent } from 'react';
import Button from './Button';

interface ModalType {
    isOpen: boolean;
    title: string;
    isSubmissionModal?: boolean;
    isConfirmationModal?: boolean;
    onClose: () => void;
    onConfirmationSubmit?: (e: FormEvent<Element>) => void;
    handleSubmit?: () => void;
    children: React.ReactNode;
}

const Modal = ({
    isOpen,
    isSubmissionModal,
    isConfirmationModal,
    onClose,
    handleSubmit,
    onConfirmationSubmit,
    title,
    children,
}: ModalType) => {
    // const handleSubmitBtnClick = () => {
    //     sessionStorage.removeItem('countdownTimer');
    //     sessionStorage.removeItem('questionsState');
    //     onClose();
    //     handleSubmit();
    // };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg h-max w-max shadow-lg py-4 px-2">
                <div className="flex justify-between items-center px-4">
                    <h2>{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-[2rem] text-gray-500 hover:text-gray-700 mr-2"
                    >
                        &times;
                    </button>
                </div>
                <div className="p-4">{children}</div>
                <div className="flex justify-end gap-4 px-4 py-2">
                    <Button variant="danger" handleBtnClick={onClose} outline>
                        {isSubmissionModal ? 'Cancel' : 'Close'}
                    </Button>

                    {isConfirmationModal && (
                        <Button
                            variant="primary"
                            handleBtnClick={onConfirmationSubmit}
                            outline
                        >
                            Yes
                        </Button>
                    )}
                    {isSubmissionModal && handleSubmit && (
                        <Button variant="primary" handleBtnClick={handleSubmit}>
                            submit
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
