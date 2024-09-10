import Button from '../../common/Button';
import Dropdown from '../../common/Dropdown';
import Modal from '../../common/Modal';
import ReactPaginate from 'react-paginate';
import SelectDropdown from '../../common/SelectDropdown';
import { useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight, FaChevronRight } from 'react-icons/fa';
import { Toast } from '../../../helper/toast';
import { getExam, getResult } from '../../../services/examService';
import { getUsers } from '../../../services/userServices';

import {
    ExamInterface,
    ResultInterface,
    UserInterface,
} from '../../../interfaces/UserInterface';

const ViewResult = () => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [closeModalOpen, setCloseModalOpen] = useState<boolean>(false);
    const [resultData, setResultData] = useState<ResultInterface[]>([]);
    const [examTitle, setExamTitle] = useState<string>('');
    const [examOptions, setExamOptions] = useState<
        { id: string; title: string }[]
    >([]);
    const [examId, setExamId] = useState<string>();
    const [user, setUsers] = useState<UserInterface[]>();
    const [userId, setUserId] = useState<number>();
    const [userTitle, setUserTitle] = useState<string>('');
    const usersPerPage = 10;
    const pageCount = Math.ceil(resultData.length / usersPerPage);
    const offset = currentPage * usersPerPage;
    const currentResult =
        resultData.length > 0
            ? resultData?.slice(offset, offset + usersPerPage)
            : [];

    const handlePageClick = ({ selected }: { selected: number }) => {
        setCurrentPage(selected);
    };

    const getResults = async (examId: any, userId: any) => {
        console.log('here');
        const response = await getResult({ examId, userId });
        setResultData(response);
    };

    const getUserData = async () => {
        const response = await getUsers();
        if (response) {
            setUsers(response);
        }
    };

    const getExamData = async () => {
        const response = await getExam();
        setExamOptions(
            response.map((exam: any) => ({
                id: exam.id,
                title: exam.examTitle,
            }))
        );
    };

    useEffect(() => {
        getExamData();
        getUserData();
        getResults(examId, userId);
    }, [examId, userId]);

    return (
        <>
            <div className="grid grid-cols-12 flex gap-4">
                <div className="z-[99] col-span-3 flex gap-4">
                    <select
                        className="w-full p-2 rounded-[8px] border-[1px] border-solid border-gray-200"
                        value={examTitle}
                        onChange={(e) => {
                            setExamId(e.target.value);
                            setExamTitle(e.target.about);
                        }}
                    >
                        <option value="" disabled>
                            Select an exam
                        </option>
                        {examOptions.map((exam) => (
                            <option
                                key={exam.id}
                                value={exam.id}
                                about={exam.title}
                            >
                                {exam.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="z-[99] col-span-3 flex gap-4">
                    <select
                        className="w-full p-2 rounded-[8px] border-[1px] border-solid border-gray-200"
                        value={userTitle}
                        onChange={(e) => {
                            setUserId(e.target.value);
                            setUserTitle(e.target.about);
                        }}
                    >
                        <option value="" disabled>
                            Select User
                        </option>
                        {user?.map((exam) => (
                            <option
                                key={exam.id}
                                value={exam.id}
                                about={exam.fullName}
                            >
                                {exam.fullName}
                            </option>
                        ))}
                    </select>
                </div>
                <Button
                    variant="secondary"
                    handleBtnClick={() => {
                        setExamId(undefined);
                        setExamTitle('');
                        setUserTitle('');
                        setUserId(undefined);
                    }}
                >
                    Reset
                </Button>
            </div>
            <div className="border-[1px] border-solid border-gray-200 mt-2 rounded-[8px]">
                <div className="flex items-center flex-row gap-1 p-4">
                    <h2>Result Table</h2>
                    <FaChevronRight fontSize={20} />
                </div>
                <div className="max-h-[40rem] overflow-x-auto overflow-y-auto">
                    <table className="bg-white min-w-full">
                        <thead className="bg-gray-200 sticky top-0 z-10 h-16">
                            <tr>
                                <th className="py-2">SN</th>
                                <th className="py-2">Exam Title</th>
                                <th className="py-2">FullName</th>
                                <th className="py-2">MCQ Marks</th>
                                <th className="py-2">Code Question Easy</th>
                                <th className="py-2">Code Question Medium</th>
                                <th className="py-2">Obtained Marks</th>
                                <th className="py-2">Total Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultData.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center">
                                        No Results found
                                    </td>
                                </tr>
                            ) : (
                                currentResult.length !== 0 &&
                                currentResult
                                    ?.reverse()
                                    .map((Result, index) => (
                                        <tr
                                            key={Result.id}
                                            className="text-center border-b-2"
                                        >
                                            <td className="py-2">
                                                {offset + index + 1}
                                            </td>
                                            <td className="py-2">
                                                {Result.exam.examTitle}
                                            </td>
                                            <td className="py-2">
                                                {Result.user.fullName}
                                            </td>
                                            <td className="py-2">
                                                {Result.exam.mcqQuestionMarks}
                                            </td>
                                            <td className="py-2">
                                                {
                                                    Result.exam
                                                        .codeQuestionEasyMarks
                                                }
                                            </td>
                                            <td className="py-2">
                                                {
                                                    Result.exam
                                                        .codeQuestionMediumHardMarks
                                                }
                                            </td>
                                            <td className="py-2">
                                                {Result.obtainedMarks}
                                            </td>
                                            <td className="py-2">
                                                {Result.totalMarks}
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
        </>
    );
};

export default ViewResult;
