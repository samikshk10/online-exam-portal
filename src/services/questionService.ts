import { api } from '../helper/axios';
import { questionEndPoints } from '../helper/endpoint';
import { LocalStorage } from '../helper/localStorage';
import { RandomQuestionResponse } from '../types/question';

interface Option {
    text: string;
}

interface Question {
    question: string;
    options: Option[];
    correctOptionIndex: number | null;
}

interface CodeQuestion {
    question: string;
    difficulty: string;
    category: string;
}

export const submitMCQQuestions = async (questions: Question[]) => {
    const formattedQuestions = questions.map(
        ({ question, options, correctOptionIndex }) => ({
            question,
            options: options.map((option) => option.text),
            correctAnswer: correctOptionIndex! + 1,
            category: 'mcq',
        })
    );

    const response = await api.post(questionEndPoints.addMCQQuestion, {
        questions: formattedQuestions,
    });
    if (response.data.message === 'MCQ questions added successfully')
        console.log('hereee');
    return true;
};

export const submitCodeQuestions = async (questions: CodeQuestion[]) => {
    const response = await api.post(questionEndPoints.addCodeQuestion, {
        questions,
    });
    if (response.data.message === 'Code questions added successfully')
        console.log('hereee');
    return true;
};

export const getRandomQuestions = async () => {
    const localData = LocalStorage.getLocalItem('examId');
    const URL =
        questionEndPoints.getRandomQuestions + '/' + parseInt(localData);
    const response: RandomQuestionResponse = await api.get(URL);
    console.log('hereeeeeeeee');
    return response;
};
