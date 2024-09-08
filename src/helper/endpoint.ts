import { getResult } from '../services/examService';

const baseUrl = import.meta.env.VITE_API_URL;

export const examEndpoints = {
    getSingleQuestoin: `${baseUrl}/api/problems/get/single`,
    getSubmissionId: `${baseUrl}/api/problems/submit`,
    getSubmissionDetails: `${baseUrl}/api/problems/get/submission`,
    getMultipleQuestions: `${baseUrl}/api/problems/get/multiple`,
    handleResultEvaluation: `${baseUrl}/api/exams/results`,
    getResult: `${baseUrl}/api/exams/get-results`,
    getDashboardData: `${baseUrl}/api/exams/get-dashboard-data`,
};

export const examScheduleEndpoints = {
    getExams: `${baseUrl}/api/exams/get-exam`,
    addExams: `${baseUrl}/api/exams/add-exam`,
    scheduleExams: `${baseUrl}/api/exams/schedule-exam`,
    unscheduleExam: `${baseUrl}/api/exams/unschedule-exam`,
};

export const authEndPoints = {
    loginExam: `${baseUrl}/api/exams/login-exam`,
};

export const questionEndPoints = {
    addMCQQuestion: `${baseUrl}/api/questions/add/mcqquestions`,
    addCodeQuestion: `${baseUrl}/api/questions/add/codequestions`,
    getRandomQuestions: `${baseUrl}/api/questions/get/questioncollections`,
};

export const userEndPoints = {
    verifyToken: `${baseUrl}/api/users/verify`,
    addUsers: `${baseUrl}/api/users/add`,
    getUsers: `${baseUrl}/api/users/get`,
    updateUser: `${baseUrl}/api/users/update`,
    deleteUser: `${baseUrl}/api/users/delete`,

    searchUsers: `${baseUrl}/api/users/search`,

    loginAdmin: `${baseUrl}/api/users/admin/login`,
};
