import QuestionIndicator from './common/QuestionIndicator';
// import { questions } from '../mock-data/questions';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    setActiveQuesIndex,
    setQuestions,
    setSelectedQuestion,
} from '../feature/exam/examSlice';
import { getRandomQuestions } from '../services/questionService';

function QuestionNav() {
    const questions = useAppSelector((state) => state.exam.questions);
    const selectedQuestion = useAppSelector((state) => state.exam);
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function fetchRandomQuestions() {
            try {
                const response = await getRandomQuestions();
                const randomQuestions = response.questionCollection;
                dispatch(setQuestions(randomQuestions));
                dispatch(setSelectedQuestion(randomQuestions[0]));
                dispatch(setActiveQuesIndex(0));
            } catch (err: any) {
                console.log(err);
                throw err;
            }
        }
        fetchRandomQuestions();
        // dispatch(setSelectedQuestion({ ...questions[0], questionNo: 0 }));
    }, [dispatch]);

    function isSolved(id: number) {
        const isQuesSolved = selectedQuestion?.checkedQuestions?.find(
            (q) => q.id === id
        );
        return isQuesSolved ? true : false;
    }
    return (
        <div className="mt-4">
            <h2>Questions</h2>
            <div className="flex flex-wrap gap-[20px] mt-2.5">
                {questions?.map((question, i) => {
                    return (
                        <QuestionIndicator
                            key={i}
                            index={i}
                            isActive={selectedQuestion?.activeQuesIndex === i}
                            isChecked={isSolved(question?.id)}
                            question={question}
                            // question={{ ...question, questionNo: i }}
                        >
                            {++i}
                        </QuestionIndicator>
                    );
                })}
            </div>
        </div>
    );
}

export default QuestionNav;
