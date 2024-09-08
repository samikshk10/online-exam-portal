import LeetCodeProblemsTable from './LeetCodeProblemsTable';
import MCQQuestionsAdd from './QuizQuestionAdd';
import Modal from '../../common/Modal';
import QuizInfo from './QuizInfo';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { clearAllQuestions } from '../../../feature/questions/questionsSlice';

interface AddMCQModalProps {
    isOpen: boolean;
    onClose: () => void;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const AddMCQModal: React.FC<AddMCQModalProps> = ({
    isOpen,
    onClose,
    setModalOpen,
}) => {
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [quizMarks, setQuizMarks] = useState('');
    const [closeModalOpen, setCloseModalOpen] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const handleClose = () => {
        setModalOpen(false);
        setCloseModalOpen(false);
        dispatch(clearAllQuestions());
    };
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(step + 1);

    const handlePrevStep = () => {
        if (step !== 1) {
            setStep(step - 1);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-[99]">
            {closeModalOpen && (
                <Modal
                    isOpen={isOpen}
                    onConfirmationSubmit={handleClose}
                    isConfirmationModal
                    isSubmissionModal
                    title="Exit"
                    onClose={() => setCloseModalOpen(false)}
                >
                    <div>
                        Are you sure you want to exit? All entered datas will be
                        lost
                    </div>
                </Modal>
            )}
            <div className="relative bg-white p-6 w-full max-w-2xl h-full max-h-full overflow-y-auto">
                <button
                    onClick={() => setCloseModalOpen(true)}
                    className="text-[1.5rem] absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                >
                    &times;
                </button>
                <div>
                    {step === 1 && (
                        <MCQQuestionsAdd
                            nextStep={nextStep}
                            prevStep={handlePrevStep}
                        />
                    )}

                    {step === 2 && (
                        <LeetCodeProblemsTable
                            prevStep={handlePrevStep}
                            onClose={onClose}
                            limit={10}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddMCQModal;
