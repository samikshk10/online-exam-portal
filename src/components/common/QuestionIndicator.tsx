import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import {
    setActiveQuesIndex,
    setSelectedQuestion,
} from '../../feature/exam/examSlice';
import { Question } from '../../types/question';
interface QuestionIndicatorType {
    children: React.ReactNode;
    index: number;
    isActive: boolean;
    isChecked: boolean;
    question: Question;
}

function QuestionIndicator({
    children,
    index,
    isActive,
    isChecked,
    question,
}: QuestionIndicatorType) {
    const dispatch = useAppDispatch();
    const handleQuestionNumClick = () => {
        dispatch(setActiveQuesIndex(index));
        dispatch(setSelectedQuestion(question));
    };
    return (
        <div
            onClick={handleQuestionNumClick}
            className={`cursor-pointer h-[40px] w-[40px] ${isChecked ? (isActive ? 'bg-[#1935CA]' : 'bg-[#F3B817]') : isActive ? 'bg-[#1935CA]' : 'bg-[#ccc]'} rounded-[50%] grid place-items-center text-white text-[18px] font-semibold hover:bg-[#1935CA]`}
        >
            {children}
        </div>
    );
}

export default QuestionIndicator;
