import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/go/go';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/rust/rust';
import 'codemirror/theme/dracula.css';
import Button from './common/Button';
import CircularProgress from './common/CircularProgress';
import CodeMirrorIDE from './common/CodeMirrorIDE';
import Dropdown from './common/Dropdown';
import Loader from './common/Loader';
import Modal from './common/Modal';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setCheckedQuestions } from '../feature/exam/examSlice';
import { asyncHandler } from '../helper/helper';
import { ConsoleIcon, PlayIcon, TipsIcon } from '../helper/icons';
import { Toast } from '../helper/toast';

// language modes
// import { Toast } from '../helper/toast';
import {
    CheckedQuestionSetType,
    LeetCodeQuestion,
    Question,
    SubmissionResponse,
} from '../types/question';
import {
    handleQuestonSubmission,
    handleSingleQuestionFetch,
    pollSubmissionDetails,
} from '../services/examService';

const languages = [
    'JavaScript',
    'Python',
    'Rust',
    'C++',
    'Java',
    'PHP',
    'Go',
    'C',
    'C#',
];

interface CodeMirrorViewType {
    activeQuestionIndex?: number | null;
    question: Question | null;
    questions: Question[] | null;
}

function CodeMirrorView(props: CodeMirrorViewType) {
    const { activeQuestionIndex, question, questions } = props;
    const dispatch = useAppDispatch();
    const checkedQuestions = useAppSelector(
        (state) => state.exam.checkedQuestions
    );
    const [code, setCode] = useState(
        questions?.reduce((acc: any, question: any) => {
            acc[question && question.id] = '';
            return acc;
        }, {})
    );
    const [currentLanguage, setCurrentLanguage] =
        useState<string>('JavaScript');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [algorithmQuestion, setAlgorithmQuestion] =
        useState<LeetCodeQuestion | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionDetails, setSubmissionDetails] =
        useState<SubmissionResponse>();

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleRunCodeBtnClick = asyncHandler(
        async (
            slug: string,
            code: string,
            difficulty?: string,
            lang: string,
            quesId: number,
            category: string
        ) => {
            setIsSubmitting(true);
            const response = await handleQuestonSubmission(
                slug,
                code,
                lang.toLowerCase()
            );

            const submissionDetails = await pollSubmissionDetails(
                response?.data?.id
            );
            const codeTestData = {
                id: quesId,
                category,

                isSolved:
                    submissionDetails.totalCorrect ===
                    submissionDetails.totalTestcases
                        ? true
                        : false,
                slug,
                difficulty,
            };
            let checkedQuestionSet: CheckedQuestionSetType[] = [];
            if (checkedQuestions) {
                if (checkedQuestions.length > 0) {
                    checkedQuestionSet = [...checkedQuestions, codeTestData];
                } else {
                    checkedQuestionSet = [codeTestData];
                }
            }
            dispatch(setCheckedQuestions(checkedQuestionSet));
            console.log(submissionDetails, 'submsisson details');
            setSubmissionDetails(submissionDetails);
            setShowSubmissionModal(true);
        },
        () => setIsSubmitting(false),
        (error) => {
            Toast.Error(error.response.data.message);
        }
    );

    useEffect(() => {
        setIsLoading(true);
        const fetchProblem = asyncHandler(
            async () => {
                const response = await handleSingleQuestionFetch(
                    question!.question
                );
                const data = await response.data;
                setAlgorithmQuestion(data);
            },
            () => setIsLoading(false),
            (error) => Toast.Error(error.response.data.message)
        );
        if (question?.question) {
            fetchProblem();
        }
    }, [question?.question]);
    const formatOutput = (output: string) => {
        return output.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };
    return (
        <div className="h-full w-full flex flex-col gap-2 md:flex-row">
            <div className="flex-1">
                <p className="text-[20px] font-semibold">
                    Q.
                    {activeQuestionIndex && activeQuestionIndex + 1}{' '}
                    {question?.question}
                </p>
                {isLoading ? (
                    <div className="mt-3 h-[70vh] overflow-y-scroll overflow-x-hidden grid place-items-center">
                        <Loader />
                    </div>
                ) : (
                    <div
                        className="custom-scrollbar mt-3 h-full overflow-y-scroll overflow-x-hidden"
                        dangerouslySetInnerHTML={{
                            __html: algorithmQuestion
                                ? algorithmQuestion.content.replace('\n', '')
                                : '',
                        }}
                    />
                )}
            </div>
            <div className="flex-[2_2_0%] h-max">
                <div className="flex justify-between items-center my-2 mr-4">
                    <p className="font-semibold">
                        <span className="inline-block font-bold mr-1 text-[#1935CA]">
                            &lt;/&gt;
                        </span>
                        Code
                    </p>
                    <Dropdown
                        isOpen={isDropdownOpen}
                        onToggle={handleDropdownToggle}
                        options={languages}
                        selectedOption={currentLanguage}
                        setSelectedOption={setCurrentLanguage}
                    />
                </div>
                <CodeMirrorIDE
                    question={question}
                    code={code}
                    currentLanguage={currentLanguage}
                    algorithmQuestion={algorithmQuestion}
                    setCode={setCode}
                />
                <div className="flex flex-row justify-end my-2">
                    <Button
                        variant="primary"
                        handleBtnClick={() =>
                            handleRunCodeBtnClick(
                                question!.question,
                                code[question!.id],
                                question!.difficulty,
                                currentLanguage,
                                question!.id,
                                question!.category
                            )
                        }
                        outline
                    >
                        {isSubmitting ? (
                            <Loader />
                        ) : (
                            <p className="flex items-center gap-2">
                                <span>
                                    <PlayIcon />
                                </span>
                                Run Code
                            </p>
                        )}
                    </Button>
                </div>
                <div>
                    <div className="flex justify-start">
                        <h3 className="flex items-center">
                            <ConsoleIcon
                                style={{
                                    color: '#1935CA',
                                    marginRight: '5px',
                                    fontSize: '22px',
                                    fontWeight: '700',
                                }}
                            />{' '}
                            Console
                        </h3>
                    </div>
                    <div className="h-[22vh] flex flex-col p-2  overflow-y-scroll overflow-x-hidden bg-[#282a36] mb-2 text-white">
                        {submissionDetails?.stdOutput && (
                            <p>{formatOutput(submissionDetails?.stdOutput)}</p>
                        )}
                        {submissionDetails?.compileError && (
                            <p>
                                {formatOutput(submissionDetails?.compileError)}
                            </p>
                        )}
                        {submissionDetails?.runtimeError && (
                            <p>{formatOutput(submissionDetails?.stdOutput)}</p>
                        )}
                    </div>
                </div>
                {showSubmissionModal && (
                    <Modal
                        isOpen={showSubmissionModal}
                        title="Code Output"
                        onClose={() => setShowSubmissionModal(false)}
                    >
                        <div className="mb-3 text-center text-[18px]">
                            {submissionDetails!.totalCorrect ===
                            submissionDetails!.totalTestcases ? (
                                <p className="text-[#47a992]">
                                    Congrats! You have passed all test cases.
                                </p>
                            ) : (
                                <p className="text-red-500">
                                    Sorry! You haven't passed all test cases.
                                </p>
                            )}
                        </div>

                        <div className="h-max flex flex-col flex-wrap justify-between md:flex-row">
                            <div className="flex-[1_1_0%] md:max-h-[10rem]">
                                <CircularProgress
                                    value={+submissionDetails!.totalCorrect}
                                    max={+submissionDetails!.totalTestcases}
                                />
                            </div>
                            <div className="flex-[1_1_0%] flex flex-col ml-auto justify-center font-bold text-[20px]">
                                <p>
                                    <span className="inline-block w-[160px] whitespace-nowrap mr-4">
                                        Correct Cases:
                                    </span>
                                    {submissionDetails!.totalCorrect ?? 0}
                                </p>
                                <p>
                                    <span className="inline-block w-[160px] whitespace-nowrap mr-4">
                                        Remaining Cases:
                                    </span>
                                    {+submissionDetails!.totalTestcases -
                                        +submissionDetails!.totalCorrect ?? 0}
                                </p>
                                <p>
                                    <span className="inline-block w-[160px] whitespace-nowrap mr-4">
                                        Total Cases:
                                    </span>
                                    {submissionDetails!.totalTestcases}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between mt-3">
                            {submissionDetails?.lastTestcase && (
                                <p className="text-[18px]">
                                    Last Test Case:{' '}
                                    {submissionDetails?.lastTestcase}
                                </p>
                            )}
                            {submissionDetails?.expectedOutput && (
                                <p className="text-[18px]">
                                    Expected Output:{' '}
                                    {submissionDetails?.expectedOutput}
                                </p>
                            )}
                        </div>
                        {+submissionDetails!.totalTestcases !==
                            +submissionDetails!.totalCorrect && (
                            <p className="mt-5 text-[17px] flex items-center justify-center">
                                <span className="text-[#47a992] font-bold inline-flex">
                                    <TipsIcon
                                        style={{
                                            fontSize: '34px',
                                            marginTop: '-5px',
                                            marginRight: '2px',
                                        }}
                                    />{' '}
                                    <span
                                        style={{
                                            marginTop: '3px',
                                            marginRight: '10px',
                                        }}
                                    >
                                        Tips:{' '}
                                    </span>
                                </span>
                                <span className="inline-block mt-[3px]">
                                    Check the last test case to solve the
                                    problem.
                                </span>
                            </p>
                        )}
                    </Modal>
                )}
            </div>
        </div>
    );
}

export default CodeMirrorView;
