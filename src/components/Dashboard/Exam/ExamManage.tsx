import { useState } from 'react';
import AddMCQModal from './AddMCQModal';
import Button from '../../common/Button';

const ExamManage = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <div className="p-4">
            <Button handleBtnClick={openModal} variant="primary">
                Add Quiz
            </Button>
            <AddMCQModal
                isOpen={isModalOpen}
                setModalOpen={setIsModalOpen}
                onClose={closeModal}
            />
        </div>
    );
};
export default ExamManage;
