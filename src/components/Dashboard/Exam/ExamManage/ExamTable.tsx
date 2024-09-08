import Button from '../../../common/Button';
import Modal from '../../../common/Modal';
import ReactPaginate from 'react-paginate';
import { useState } from 'react';
import { FaAngleLeft, FaAngleRight, FaChevronRight } from 'react-icons/fa';
import { Toast } from '../../../../helper/toast';
import { ExamInterface } from '../../../../interfaces/UserInterface';
import { UnscheduleExam, scheduleExam } from '../../../../services/examService';

interface ExamTableProps {
    exams: ExamInterface[];
    onUpdated: () => void;
}

const ExamTable = ({ exams, onUpdated }: ExamTableProps) => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [closeModalOpen, setCloseModalOpen] = useState<boolean>(false);
    const [currentExamId, setCurrentExamId] = useState<number | null>(null);

    const usersPerPage = 10;
    const pageCount = Math.ceil(exams.length / usersPerPage);
    const offset = currentPage * usersPerPage;
    const currentExams = exams?.slice(offset, offset + usersPerPage);

    const handlePageClick = ({ selected }: { selected: number }) => {
        setCurrentPage(selected);
    };

    const handleSchedule = async (examId: number) => {
        const scheduleExams = await scheduleExam(examId);
        if (scheduleExams) {
            Toast.Success('Exam Scheduled Successfully');
            onUpdated();
            return;
        }
        Toast.Error('Error Scheduling Exam');
    };

    const handleUnschedule = (examId: number) => {
        setCurrentExamId(examId);
        setCloseModalOpen(true);
    };

    const confirmUnschedule = async () => {
        if (currentExamId !== null) {
            const unscheduleExams = await UnscheduleExam(currentExamId);
            if (unscheduleExams.success === true) {
                Toast.Success(unscheduleExams.message);
                onUpdated();
            } else {
                Toast.Error('Error Unscheduling Exam');
            }
            setCloseModalOpen(false);
            setCurrentExamId(null); // Clear the current exam ID
        }
    };

    return (
        <div className="border-[1px] border-solid border-gray-200 mt-2 rounded-[8px]">
            {closeModalOpen && (
                <Modal
                    isOpen={closeModalOpen}
                    onConfirmationSubmit={confirmUnschedule}
                    isConfirmationModal
                    title="Cancel Exam"
                    onClose={() => setCloseModalOpen(false)}
                >
                    <div>Are you sure you want to cancel the exam?</div>
                </Modal>
            )}
            <div className="flex items-center flex-row gap-1 p-4">
                <h2>Exam Table</h2>
                <FaChevronRight fontSize={20} />
            </div>
            <div className="max-h-[40rem] overflow-x-auto overflow-y-auto">
                <table className="bg-white min-w-full">
                    <thead className="bg-gray-200 sticky top-0 z-10 h-16">
                        <tr>
                            <th className="py-2">SN</th>
                            <th className="py-2">Exam Title</th>
                            <th className="py-2">Exam Description</th>
                            <th className="py-2">MCQ Marks</th>
                            <th className="py-2">Code Question Easy</th>
                            <th className="py-2">Code Question Medium</th>
                            <th className="py-2">Total Marks</th>
                            <th className="py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center">
                                    No Exams found
                                </td>
                            </tr>
                        ) : (
                            currentExams &&
                            currentExams?.map((exam, index) => (
                                <tr
                                    key={exam.id}
                                    className="text-center border-b-2"
                                >
                                    <td className="py-2">
                                        {offset + index + 1}
                                    </td>
                                    <td className="py-2">{exam.examTitle}</td>
                                    <td className="py-2">
                                        {exam.examDescription}
                                    </td>
                                    <td className="py-2">
                                        {exam.mcqQuestionMarks}
                                    </td>
                                    <td className="py-2">
                                        {exam.codeQuestionEasyMarks}
                                    </td>
                                    <td className="py-2">
                                        {exam.codeQuestionMediumHardMarks}
                                    </td>
                                    <td className="py-2">{exam.totalMarks}</td>
                                    <td className="py-2 px-1" align="center">
                                        <div className="flex flex-wrap gap-2 flex-col max-w-fit">
                                            {exam.existScheduleExam ? (
                                                <Button
                                                    variant="primary"
                                                    handleBtnClick={() =>
                                                        handleUnschedule(
                                                            exam.id
                                                        )
                                                    }
                                                >
                                                    Cancel Exam
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="primary"
                                                    handleBtnClick={() =>
                                                        handleSchedule(exam.id)
                                                    }
                                                >
                                                    Schedule
                                                </Button>
                                            )}
                                            <Button variant="primary">
                                                View Participant
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center mt-4">
                <ReactPaginate
                    previousLabel={<FaAngleLeft />}
                    nextLabel={<FaAngleRight />}
                    breakLabel="..."
                    breakClassName="break-me"
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName="pagination"
                    activeClassName="active"
                    forcePage={currentPage}
                />
            </div>
        </div>
    );
};

export default ExamTable;
