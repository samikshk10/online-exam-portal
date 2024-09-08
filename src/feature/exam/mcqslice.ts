// src/feature/mcqQuestions/mcqQuestionsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Option {
    text: string;
}

interface Question {
    question: string;
    options: Option[];
    correctOptionIndex: number | null;
}

interface MCQQuestionsState {
    questions: Question[];
}

interface UpdateQuestionPayload {
    index: number;
    question: Question;
}

const initialState: MCQQuestionsState = {
    questions: [],
};

const mcqQuestionsSlice = createSlice({
    name: 'mcqQuestions',
    initialState,
    reducers: {
        setQuestions: (state, action: PayloadAction<Question[]>) => {
            state.questions = action.payload;
        },
        addQuestion: (state, action: PayloadAction<Question>) => {
            state.questions.push(action.payload);
        },
        removeQuestion: (state, action: PayloadAction<number>) => {
            state.questions.splice(action.payload, 1);
        },
        updateQuestion: (
            state,
            action: PayloadAction<UpdateQuestionPayload>
        ) => {
            const { index, question } = action.payload;
            state.questions[index] = question;
        },
    },
});

export const { setQuestions, addQuestion, removeQuestion, updateQuestion } =
    mcqQuestionsSlice.actions;
export default mcqQuestionsSlice.reducer;
