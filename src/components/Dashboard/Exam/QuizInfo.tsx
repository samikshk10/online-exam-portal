import React from 'react';
import Button from '../../common/Button';

interface QuizInfoProps {
    quizTitle: string;
    setQuizTitle: (value: string) => void;
    quizDescription: string;
    setQuizDescription: (value: string) => void;
    quizMarks: string;
    setQuizMarks: (value: string) => void;
    nextStep: () => void;
}

const QuizInfo: React.FC<QuizInfoProps> = ({
    quizTitle,
    setQuizTitle,
    quizDescription,
    setQuizDescription,
    quizMarks,
    setQuizMarks,

    nextStep,
}) => {
    return (
        <div>
            <h2 className="text-2xl mb-4">Quiz Information</h2>
            <div className="mb-4">
                <label className="block mb-2">Quiz Title</label>
                <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full p-2 border"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Quiz Description</label>
                <textarea
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    className="w-full p-2 border"
                ></textarea>
            </div>
            <div className="mb-4">
                <label className="block mb-2">Quiz Marks</label>
                <input
                    type="number"
                    value={quizMarks}
                    onChange={(e) => setQuizMarks(e.target.value)}
                    className="w-full p-2 border"
                />
            </div>

            <Button variant="primary" handleBtnClick={nextStep}>
                Next
            </Button>
        </div>
    );
};

export default QuizInfo;
