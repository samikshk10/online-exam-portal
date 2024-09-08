import React, { useState, useEffect, ChangeEvent } from 'react';
import ReactPaginate from 'react-paginate';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import Button from '../../common/Button';
import Checkbox from '../../common/Checkbox';
import { handleMultipleQuestionFetch } from '../../../services/examService';
import useDebounce from '../../hooks/useDebounce';
import {
    submitCodeQuestions,
    submitMCQQuestions,
} from '../../../services/questionService';
import { useAppSelector, useAppDispatch } from '../../../app/hooks'; // Updated import
import {
    clearAllQuestions,
    setSelectedProblems,
} from '../../../feature/questions/questionsSlice';
import { Toast } from '../../../helper/toast';

interface TopicTag {
    name: string;
}

interface Problem {
    title: string;
    titleSlug: string;
    difficulty: string;
    topicTags: TopicTag[];
    uniqueId: string; // Use uniqueId for unique identification
}

interface LeetCodeProblemsTableProps {
    prevStep: () => void;
    onClose: () => void;
    limit: number;
}

const difficulties = ['Easy', 'Medium', 'Hard'];
const filterOptions = ['All', 'Selected', 'Unselected'];

const LeetCodeProblemsTable: React.FC<LeetCodeProblemsTableProps> = ({
    prevStep,
    onClose,
    limit,
}) => {
    const dispatch = useAppDispatch();
    const savedSelectedQuestions = useAppSelector(
        (state) => state.questions.selectedProblems
    );

    const [problems, setProblems] = useState<Problem[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        new Set(savedSelectedQuestions)
    );
    const [search, setSearch] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>(''); // Filter by difficulty
    const [selectionFilter, setSelectionFilter] = useState<string>('All'); // Filter by selection status
    const [error, setError] = useState<string>('');

    const debouncedSearch = useDebounce(search, 300); // Use the custom hook
    const debouncedDifficulty = useDebounce(selectedDifficulty, 300); // Use the custom hook

    useEffect(() => {
        fetchLeetCodeProblems(
            currentPage,
            debouncedSearch,
            debouncedDifficulty
        );
    }, [currentPage, debouncedSearch, debouncedDifficulty]);

    useEffect(() => {
        setSelectedIds(new Set(savedSelectedQuestions));
    }, [savedSelectedQuestions]);

    const mcqQuestionSaved = useAppSelector(
        (state) => state.questions.formValues
    );
    const handleSubmissionAll = async () => {
        const mcqQuestionsSubmit = await submitMCQQuestions(
            mcqQuestionSaved.questions
        );
        const codeQuestions = problems
            ?.filter((problem) => selectedIds.has(problem.uniqueId))
            .map(({ titleSlug, difficulty }) => ({
                question: titleSlug,
                category: 'code',
                difficulty: difficulty.toUpperCase(),
            }));
        const codeQuestionSubmit = await submitCodeQuestions(codeQuestions);
        if (mcqQuestionsSubmit && codeQuestionSubmit) {
            Toast.Success('All questions submitted successfully');
            dispatch(clearAllQuestions());
            onClose();
        } else {
            Toast.Error('Error submitting questions');
        }
    };

    const fetchLeetCodeProblems = async (
        page: number,
        search: string,
        difficulty: string
    ) => {
        setLoading(true);
        try {
            const skip = page * limit;
            const filters = {
                searchKeywords: search || undefined,
                difficulty: difficulty.toUpperCase() || undefined,
            };

            const data = await handleMultipleQuestionFetch(
                limit,
                skip,
                '',
                filters
            );
            const fetchedProblems =
                data.data.problemsetQuestionList.questions.map(
                    (q: any, index: number) => ({
                        ...q,
                        uniqueId: `${q.title}-${index}`, // Generate unique ID
                    })
                );
            setProblems(fetchedProblems);
            setTotalPages(
                Math.ceil(data.data.problemsetQuestionList.total / limit)
            );
        } catch (error) {
            setError('Error Fetching leetCode problems from server');
            console.error('Error fetching LeetCode problems:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setCurrentPage(0); // Reset to the first page when search changes
    };

    const handleCheckboxChange = (id: string) => {
        setSelectedIds((prevIds) => {
            const newIds = new Set(prevIds);
            if (newIds.has(id)) {
                newIds.delete(id); // Deselect if already selected
            } else {
                newIds.add(id); // Select if not already selected
            }
            dispatch(setSelectedProblems(Array.from(newIds))); // Dispatch action to save selected problems
            return newIds;
        });
    };

    const handleDifficultyChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedDifficulty(event.target.value);
        setCurrentPage(0); // Reset to the first page when difficulty changes
    };

    const handleSelectionFilterChange = (
        event: ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectionFilter(event.target.value);
    };

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const getAllFilteredProblems = () => {
        if (selectionFilter === 'Selected') {
            const selectedProblems = problems?.filter((problem) =>
                selectedIds.has(problem.uniqueId)
            );

            return selectedProblems;
        }
        if (selectionFilter === 'Unselected') {
            const unselectedProblems = problems.filter(
                (problem) => !selectedIds.has(problem.uniqueId)
            );

            return unselectedProblems;
        }
    };

    const getFilteredProblems = () => {
        let result: Problem[] = problems;

        if (selectionFilter === 'Selected') {
            result = problems.filter((problem) =>
                selectedIds.has(problem.uniqueId)
            );
        } else if (selectionFilter === 'Unselected') {
            result = problems.filter(
                (problem) => !selectedIds.has(problem.uniqueId)
            );
        }

        result = result.sort((a, b) => {
            if (selectedIds.has(a.uniqueId) && !selectedIds.has(b.uniqueId))
                return -1;
            if (!selectedIds.has(a.uniqueId) && selectedIds.has(b.uniqueId))
                return 1;
            return 0;
        });

        return result;
    };

    const filteredProblems = getFilteredProblems();

    const allFilteredProblems = getAllFilteredProblems();

    return (
        <div>
            <h2 className="text-2xl mb-4">LeetCode Problems</h2>
            <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search problems..."
                className="w-full p-2 border mb-4"
            />
            <div className="flex justify-between">
                <div className="mb-4">
                    <label htmlFor="difficulty" className="block mb-2">
                        Filter by Difficulty:
                    </label>
                    <select
                        id="difficulty"
                        value={selectedDifficulty}
                        onChange={handleDifficultyChange}
                        className="p-2 border"
                    >
                        <option value="">All</option>
                        {difficulties.map((difficulty) => (
                            <option key={difficulty} value={difficulty}>
                                {difficulty}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="selectionFilter" className="block mb-2">
                        Filter by Selection:
                    </label>
                    <select
                        id="selectionFilter"
                        value={selectionFilter}
                        onChange={handleSelectionFilterChange}
                        className="p-2 border"
                    >
                        {filterOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="overflow-auto h-[400px]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 bg-gray-50"></th>
                            <th className="px-6 py-3 bg-gray-50">Title</th>
                            <th className="px-6 py-3 bg-gray-50">Difficulty</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {selectionFilter === 'Selected' ||
                        selectionFilter === 'Unselected' ? (
                            allFilteredProblems?.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Checkbox
                                                    isChecked={selectedIds.has(
                                                        item.uniqueId
                                                    )}
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            item.uniqueId
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.difficulty}
                                            </td>
                                        </tr>
                                    </>
                                );
                            })
                        ) : !loading && error ? (
                            <tr>
                                <td colSpan={3}>{error}</td>
                            </tr>
                        ) : (
                            filteredProblems.map((problem) => (
                                <tr key={problem.uniqueId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Checkbox
                                            isChecked={selectedIds.has(
                                                problem.uniqueId
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(
                                                    problem.uniqueId
                                                )
                                            }
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {problem.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {problem.difficulty}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <ReactPaginate
                    previousLabel={<FaAngleLeft />}
                    nextLabel={<FaAngleRight />}
                    breakLabel="..."
                    breakClassName="break-me"
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName="pagination"
                    activeClassName="active"
                    forcePage={currentPage}
                />
                <Button
                    variant="primary"
                    className="px-4 py-2 bg-gray-500 text-white rounded absolute bottom-4 left-4"
                    handleBtnClick={prevStep}
                >
                    Previous
                </Button>
                <Button
                    variant="primary"
                    className="px-4 py-2 text-white rounded absolute bottom-4 right-4"
                    handleBtnClick={handleSubmissionAll}
                >
                    Submit All
                </Button>
            </div>
        </div>
    );
};

export default LeetCodeProblemsTable;
