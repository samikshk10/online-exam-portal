import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Option {
    text: string;
}

interface Question {
    question: string;
    options: Option[];
    correctOptionIndex: number | null;
}

interface FormValues {
    questions: Question[];
}

interface FormAndProblemsState {
    formValues: FormValues;
    selectedProblems: Set<string>;
}

const initialState: FormAndProblemsState = {
    formValues: {
        questions: [
            {
                question: '',
                options: Array.from({ length: 4 }, () => ({ text: '' })),
                correctOptionIndex: null,
            },
        ],
    },
    selectedProblems: new Set(),
};

const formAndProblemsSlice = createSlice({
    name: 'formAndProblems',
    initialState,
    reducers: {
        setMCQFormValues(state, action: PayloadAction<FormValues>) {
            state.formValues = action.payload;
        },
        setSelectedProblems(state, action: PayloadAction<string[]>) {
            state.selectedProblems = new Set(action.payload);
        },
        clearAllQuestions(state) {
            state.formValues = initialState.formValues;
            state.selectedProblems = initialState.selectedProblems;
        },
    },
});

export const { setMCQFormValues, setSelectedProblems, clearAllQuestions } =
    formAndProblemsSlice.actions;
export default formAndProblemsSlice.reducer;
