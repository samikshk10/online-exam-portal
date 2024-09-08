import 'react-toastify/dist/ReactToastify.css';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import CircularProgress from '../components/common/CircularProgress';
import CodeMirrorView from '../components/CodeMirrorView';
import DetectNoise from '../components/DetectNoise';
import MCQQuestionView from '../components/MCQQuestionView';
import Modal from '../components/common/Modal';
import QuestionNav from '../components/QuestionNav';
import WebCam from '../components/WebCam';
import { useCallback, useEffect, useState } from 'react';
import { AiTwotoneAlert } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setCheckedQuestions, setShowToast } from '../feature/exam/examSlice';
import { exitFullscreen, formatCountDownTimer } from '../helper/helper';
import { ClockIcon } from '../helper/icons';
import { getModel, loadModel } from '../helper/loadModelHelper';
import { LocalStorage } from '../helper/localStorage';
import { SessionStorage } from '../helper/sessionStorage';
import { Toast } from '../helper/toast';
import { handleExamSubmit } from '../services/examService';
import { CustomError } from '../types/question';

// import ErrorBoundary from '../components/ErrorBoundary';

const examDuration = import.meta.env.VITE_EXAM_DURATION;

const ExamPortal = function ExamPortal() {
    const navigate = useNavigate();
    const [coutdownTime, setCountDownTimer] = useState(() => {
        const savedCountdownTime =
            SessionStorage.getSessionItem('countdownTimer');
        return savedCountdownTime !== null
            ? JSON.parse(savedCountdownTime)
            : examDuration || 30;
    }); // 3600 sec for 1 hour
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const questionStore = useAppSelector((state) => state.exam);
    const dispatch = useAppDispatch();
    const [fullScreenExitedCount, setfullscreenExitedCount] = useState(0);
    const [highNoiseCount, setHighNoiseCount] = useState(0);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [soundLevel, setSoundLevel] = useState(0);

    const examId = LocalStorage.getLocalItem('examId');
    const userId = LocalStorage.getLocalItem('userId');

    useEffect(() => {
        dispatch(setShowToast(true));
    }, []);
    // console.log(questionStore?.checkedQuestions, 'ke ke do you love');

    const handleMCQSubmit = useCallback(async () => {
        const codeQuestions =
            questionStore?.checkedQuestions?.filter(
                (item) => item?.category === 'code' && item?.isSolved
            ) || [];

        const countMCQQuestions = questionStore?.checkedQuestions?.filter(
            (item) => item?.category === 'mcq'
        );
        const solvedMCQQuestions =
            countMCQQuestions?.filter((item) => item?.isSolved === true) || [];
        const totalMCQ =
            questionStore?.questions?.filter(
                (item) => item?.category === 'mcq'
            ) || [];
        const { easyDifficulty, hardDifficulty } = codeQuestions.reduce(
            (acc, question) => {
                if (question.difficulty === 'EASY') {
                    acc.easyDifficulty = true;
                } else if (
                    question.difficulty === 'MEDIUM' ||
                    question.difficulty === 'HARD'
                ) {
                    acc.hardDifficulty = true;
                }
                return acc;
            },
            { easyDifficulty: false, hardDifficulty: false }
        );
        const examData = {
            fullScreenCount: fullScreenExitedCount,
            highNoiseCount,
            outOfViewCount: questionStore?.outOfViewCount,
            attemptedQuestionCount: questionStore?.checkedQuestions?.length,
            totalQuestionCount: questionStore?.questions?.length,
            examId: examId,
            userId: userId,
            easyDifficulty: easyDifficulty,
            mediumHardDifficulty: hardDifficulty,
            mcqCount: totalMCQ.length,
            attemptedMcqCount: countMCQQuestions?.length ?? 0,
            solvedMcqCount: solvedMCQQuestions?.length ?? 0,
        };
        console.log(examData, 'exam data');
        try {
            setCountDownTimer(examDuration || 3600);
            SessionStorage.removeAllSession();
            dispatch(setCheckedQuestions([]));

            const response = await handleExamSubmit(examData);
            console.log(response, 'exam submit result response');

            exitFullscreen();
            setIsModalOpen(false);
            navigate('/exam-completed');
        } catch (error: any) {
            throw new Error(error.message);
        }
    }, [
        dispatch,
        navigate,
        examDuration,
        questionStore,
        fullScreenExitedCount,
    ]);

    useEffect(() => {
        const model = getModel();
        if (model) {
            setIsModelsLoaded(true);
        }
        const mediaQuery = window.matchMedia('(display-mode: fullscreen)');

        const handleMediaQueryChange = (event: any) => {
            if (event.matches) {
                // setfullscreenCount((prev) => prev + 1);
            } else {
                setfullscreenExitedCount((prevState) => prevState + 1);
                setIsAlertOpen(true);
            }
        };

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, [fullScreenExitedCount]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            SessionStorage.setSessionItem('countdownTimer', coutdownTime);
            event.preventDefault();
        };

        const handlePopState = (event: PopStateEvent) => {
            event.preventDefault();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        // Push the initial state to the history
        window.history.pushState(null, '', window.location.pathname);

        const timerId = setInterval(() => {
            setCountDownTimer((prevTime: number) => prevTime - 1);
        }, 1000);

        if (coutdownTime <= 0) {
            clearInterval(timerId);
            handleMCQSubmit();
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
            clearInterval(timerId);
        };
    }, [coutdownTime, handleMCQSubmit]);

    // Retrieve the saved state from sessionStorage when the component mounts
    // useEffect(() => {
    //     const savedState = SessionStorage.getSessionItem('questionsState');
    //     if (savedState) {
    //         dispatch(setCheckedQuestions(JSON.parse(savedState)));
    //     }
    // }, [dispatch]);

    const [showToastOnce, setShowToastOnce] = useState(false);
    const closePreviousToast = () => {
        setShowToastOnce(false);
    };
    useEffect(() => {
        if (soundLevel > 50 && !showToastOnce) {
            setHighNoiseCount((prev) => prev + 1);
            Toast.Error(
                'High noise detected',
                CustomError.audioError,
                closePreviousToast
            );
            setShowToastOnce(true);
        }
    }, [soundLevel, showToastOnce]);

    useEffect(() => {
        async function initializeModel() {
            await loadModel();
            const model = getModel();
            if (model) {
                setIsModelsLoaded(true);
            }
        }
        if (!isModelsLoaded) {
            initializeModel();
        }
    }, [isModelsLoaded]);

    return (
        <div className="h-[100vh] w-full flex flex-col md:flex-row ">
            <Alert isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)}>
                You must be in full screen, otherwise you might be disqualified.
                Press Ok to enable full screen mode
            </Alert>
            <div className="flex-[1_1_0%] mx-auto justify-center items-center md:min-w-[300px] p-6">
                <div>
                    <h2>Web Cam</h2>
                    {isModelsLoaded ? (
                        <WebCam isModelsLoaded={isModelsLoaded} />
                    ) : (
                        <p>Please wait...</p>
                    )}
                </div>
                <QuestionNav />
            </div>
            {/* <ErrorBoundary> */}
            <DetectNoise setSoundLevel={setSoundLevel} />
            {/* </ErrorBoundary> */}
            <div className="flex-[6_6_0%] px-6 h-full bg-custom-gradient grid place-items-center">
                <div className="flex flex-col h-max w-full md:min-w-[70%] bg-white rounded-[20px] px-10 py-2">
                    <div className="h-20 mb-3 w-full flex justify-between items-center">
                        <div>
                            <div className="flex">
                                <div className="h-full my-auto mr-3">
                                    <ClockIcon style={{ fontSize: '30px' }} />
                                </div>
                                <div>
                                    <p className="tracking-wide text-[#797777]">
                                        Time Remaining
                                    </p>
                                    <p className="text-[18px] font-bold mt-[-4px] tracking-wider">
                                        {formatCountDownTimer(coutdownTime)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            handleBtnClick={() => setIsModalOpen(true)}
                        >
                            Submit
                        </Button>
                    </div>
                    <Modal
                        isOpen={isModalOpen}
                        isSubmissionModal
                        title="Submission"
                        onClose={() => setIsModalOpen(false)}
                        handleSubmit={handleMCQSubmit}
                    >
                        <h2>Stats:</h2>
                        <div className="h-max flex flex-col flex-wrap justify-between md:flex-row">
                            <div className="flex-[1_1_0%] md:max-h-[10rem]">
                                <CircularProgress
                                    value={
                                        questionStore.checkedQuestions?.length!
                                    }
                                    max={questionStore?.questions?.length!}
                                />
                            </div>
                            <div className="flex-[1_1_0%] flex flex-col ml-auto justify-center font-bold text-[20px]">
                                <p>
                                    <span className="inline-block w-[100px] mr-4">
                                        Attempted:
                                    </span>
                                    {questionStore.checkedQuestions?.length}
                                </p>
                                <p>
                                    <span className="inline-block w-[100px] mr-4">
                                        Remaining:
                                    </span>
                                    {questionStore.questions?.length! -
                                        questionStore.checkedQuestions?.length!}
                                </p>
                                <p>
                                    <span className="inline-block w-[100px] mr-4">
                                        Total:
                                    </span>
                                    {questionStore.questions?.length}
                                </p>
                            </div>
                        </div>
                        <p className="text-center my-4">
                            Note*: Once you submit you can&apos;t revert back.
                            Thank you!
                        </p>
                    </Modal>
                    {questionStore?.selectedQuestion?.category === 'mcq' ? (
                        <MCQQuestionView questionStore={questionStore} />
                    ) : (
                        <CodeMirrorView
                            activeQuestionIndex={questionStore.activeQuesIndex}
                            question={questionStore.selectedQuestion}
                            questions={
                                (questionStore.questions &&
                                    questionStore.questions.filter(
                                        (q) => q.category === 'code'
                                    )) ??
                                null
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamPortal;
