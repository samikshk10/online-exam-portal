// src/feature/selectedLeetCodeQuestions/selectedLeetCodeQuestionsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedQuestion {
    uniqueId: string;
}

interface SelectedLeetCodeQuestionsState {
    selectedQuestions: SelectedQuestion[];
}

const initialState: SelectedLeetCodeQuestionsState = {
    selectedQuestions: [],
};

const selectedLeetCodeQuestionsSlice = createSlice({
    name: 'selectedLeetCodeQuestions',
    initialState,
    reducers: {
        addSelectedQuestion: (
            state,
            action: PayloadAction<SelectedQuestion>
        ) => {
            if (
                !state.selectedQuestions.find(
                    (q) => q.uniqueId === action.payload.uniqueId
                )
            ) {
                state.selectedQuestions.push(action.payload);
            }
        },
        removeSelectedQuestion: (state, action: PayloadAction<string>) => {
            state.selectedQuestions = state.selectedQuestions.filter(
                (q) => q.uniqueId !== action.payload
            );
        },
        setSelectedQuestions: (
            state,
            action: PayloadAction<SelectedQuestion[]>
        ) => {
            state.selectedQuestions = action.payload;
        },
    },
});

export const {
    addSelectedQuestion,
    removeSelectedQuestion,
    setSelectedQuestions,
} = selectedLeetCodeQuestionsSlice.actions;
export default selectedLeetCodeQuestionsSlice.reducer;
