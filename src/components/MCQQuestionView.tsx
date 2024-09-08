import Button from './common/Button';
import RadioBtn from './common/RadioBtn';
import { useAppDispatch } from '../app/hooks';
import { SessionStorage } from '../helper/sessionStorage';
import { CheckedQuestionType, QuestionStateType } from '../types/question';

import {
    setSelectedQuestion,
    setActiveQuesIndex,
    setCheckedQuestions,
} from '../feature/exam/examSlice';

interface MCQQuestionViewType {
    questionStore: QuestionStateType;
}

function MCQQuestionView({ questionStore }: MCQQuestionViewType) {
    const dispatch = useAppDispatch();

    const handlePrevBtnClick = () => {
        const newIndex = (questionStore?.activeQuesIndex ?? 0) - 1;
        const newQuestion = questionStore?.questions?.[newIndex];
        if (newQuestion) {
            dispatch(setSelectedQuestion(newQuestion));
            dispatch(setActiveQuesIndex(newIndex));
        }
    };
    const handleNxtBtnClick = () => {
        const newIndex = (questionStore?.activeQuesIndex ?? 0) + 1;
        const newQuestion = questionStore?.questions?.[newIndex];
        if (newQuestion) {
            dispatch(setSelectedQuestion(newQuestion));
            dispatch(setActiveQuesIndex(newIndex));
        }
    };

    const handleOptionChange = ({
        id,
        selectedOption,
        selectedOptionIndex,
        correctAnswer,
        category,
    }: CheckedQuestionType) => {
        const existingQuestion = questionStore?.checkedQuestions?.find(
            (q) => q.id === id
        );
        let updatedState;

        if (existingQuestion) {
            // Update the existing question
            updatedState = questionStore?.checkedQuestions?.map((q) =>
                q.id === id
                    ? {
                          ...q,
                          selectedOption,
                          selectedOptionIndex,
                          correctAnswer,
                          category,
                          isSolved: selectedOptionIndex
                              ? selectedOptionIndex + 1 === correctAnswer
                              : false,
                      }
                    : q
            );
        } else {
            // Add new question
            updatedState = [
                ...questionStore.checkedQuestions!,
                {
                    id,
                    selectedOption,
                    selectedOptionIndex,
                    correctAnswer,
                    category,
                    isSolved: selectedOptionIndex
                        ? selectedOptionIndex + 1 === correctAnswer
                        : false,
                },
            ];
        }

        dispatch(setCheckedQuestions(updatedState!));
        SessionStorage.setSessionItem('questionsState', updatedState);
    };
    return (
        <div>
            <p className="text-[20px] font-semibold">
                Q.
                {(questionStore.activeQuesIndex ||
                    questionStore.activeQuesIndex === 0) &&
                    questionStore.activeQuesIndex + 1}{' '}
                {questionStore.selectedQuestion?.question}
            </p>

            <div className="flex flex-col flex-wrap mt-3 ml-8 w-max">
                {questionStore?.selectedQuestion?.options?.map((option, i) => (
                    <div
                        key={i}
                        className="inline-flex min-w-max px-4 py-3.5 rounded-[7px] my-2 items-center border-2 border-solid border-[#eee]"
                    >
                        <RadioBtn
                            name={`ques-${questionStore?.selectedQuestion?.id}`}
                            qid={questionStore?.selectedQuestion?.id!}
                            label={option}
                            index={i}
                            handleOptionChange={() =>
                                handleOptionChange({
                                    id: questionStore?.selectedQuestion?.id!,
                                    selectedOption: option,
                                    selectedOptionIndex: i,
                                    correctAnswer:
                                        questionStore?.selectedQuestion
                                            ?.correctAnswer!,
                                    category:
                                        questionStore.selectedQuestion
                                            ?.category,
                                })
                            }
                            checkedQuestions={questionStore?.checkedQuestions!}
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-4 p-5">
                <Button
                    variant="primary"
                    handleBtnClick={handlePrevBtnClick}
                    disabled={questionStore.activeQuesIndex === 0}
                    outline
                >
                    Previous
                </Button>
                <Button
                    variant="primary"
                    handleBtnClick={handleNxtBtnClick}
                    disabled={questionStore.activeQuesIndex === 26}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

export default MCQQuestionView;
