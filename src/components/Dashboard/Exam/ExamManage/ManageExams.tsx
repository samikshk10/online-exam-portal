import { useEffect, useState } from 'react';

import { FaUserPlus } from 'react-icons/fa';
import ExamTable from './ExamTable';
import ExamInfo from './ExamModal';
import { ExamInterface } from '../../../../interfaces/UserInterface';
import { getExam } from '../../../../services/examService';

const ManageExams = () => {
    const [exam, setExams] = useState<ExamInterface[] | []>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getExamData = async () => {
        const response = await getExam();
        setExams(response);
    };

    useEffect(() => {
        getExamData();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-end">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                        setIsModalOpen(true);
                    }}
                >
                    <div className="flex justify-center items-center gap-2">
                        Add Exam <FaUserPlus />
                    </div>
                </button>
            </div>
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
