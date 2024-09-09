import { useEffect, useState } from 'react';

import { FaUserPlus } from 'react-icons/fa';
import ExamTable from './ExamTable';
import ExamInfo from './ExamModal';
import { ExamInterface } from '../../../../interfaces/UserInterface';
import { getExam } from '../../../../services/examService';
import Button from '../../../common/Button';
import AddMCQModal from '../AddMCQModal';

const ManageExams = () => {
    const [exam, setExams] = useState<ExamInterface[] | []>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQuesModalOpen, setIsQuesModalOpen] = useState<boolean>(false);

    const openQuesModal = () => setIsQuesModalOpen(true);
    const closeQuesModal = () => setIsQuesModalOpen(false);

    const getExamData = async () => {
        const response = await getExam();
        setExams(response);
    };

    useEffect(() => {
        getExamData();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-end gap-3">
                <Button handleBtnClick={openQuesModal} variant="primary">
                    Add Quiz
                </Button>
                <Button
                    variant="primary"
                    handleBtnClick={() => setIsModalOpen(true)}
                >
                    <div className="flex justify-center items-center gap-2">
                        Add Exam <FaUserPlus />
                    </div>
                </Button>
            </div>
            <AddMCQModal
                isOpen={isQuesModalOpen}
                setModalOpen={setIsQuesModalOpen}
                onClose={closeQuesModal}
            />
            <ExamTable exams={exam} onUpdated={getExamData} />
            {isModalOpen && (
                <div>
                    <ExamInfo
                        onClose={() => setIsModalOpen(false)}
                        onExamAdded={getExamData}
                    />
                </div>
            )}
        </div>
    );
};

export default ManageExams;
