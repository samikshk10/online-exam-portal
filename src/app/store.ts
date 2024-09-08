// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import examReducer from '../feature/exam/examSlice';
import selectedLeetCodeQuestionsReducer from '../feature/exam/selectedLeetCodeQuestionsReducer';
import questionsReducer from '../feature/questions/questionsSlice';
export const store = configureStore({
    reducer: {
        exam: examReducer,
        selectedLeetCodeQuestions: selectedLeetCodeQuestionsReducer,
        questions: questionsReducer, // Add the new reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
