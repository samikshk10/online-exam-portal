import { api } from '../helper/axios';
import { SubmissionResponse } from '../types/question';

import {
    authEndPoints,
    examEndpoints,
    examScheduleEndpoints,
    userEndPoints,
} from '../helper/endpoint';

export const handleSingleQuestionFetch = async (value: string) => {
    const URL = examEndpoints.getSingleQuestoin;
    const data = { slug: value };
    const response = await api.post(URL, data);
    return response;
};
interface filterInterface {
    difficulty?: string;
    searchKeywords?: string;
}

export const handleMultipleQuestionFetch = async (
    limit: number,
    skip: number,
    categorySlug: string,
    filters: filterInterface
) => {
    const URL = examEndpoints.getMultipleQuestions;
    const data = {
        limit,
        skip,
        categorySlug,
        filters: {
            searchKeywords: filters?.searchKeywords,
            difficulty: filters?.difficulty,
        },
    };
    const response = await api.post(URL, data);
    return response;
};

export const handleQuestonSubmission = async (
    slug: string,
    code: string,
    language: string
) => {
    const URL = examEndpoints.getSubmissionId;
    const data = { slug, code, language };
    const response = await api.post(URL, data);
    return response;
};

export const handleSubmissionDetails = async (submissionId: number) => {
    const URL = examEndpoints.getSubmissionDetails;
    console.log(URL, submissionId, 'URL, submissionId?????');
    const data = { submissionId };
    const response = await api.post(URL, data);
    return response;
};

export const pollSubmissionDetails = (
    submissionId: number,
    interval = 5000,
    maxAttempts = 10
): Promise<SubmissionResponse> => {
    return new Promise((resolve, reject) => {
        let attempts = 0;

        const intervalId = setInterval(async () => {
            attempts += 1;

            try {
                const data = await handleSubmissionDetails(submissionId);
                clearInterval(intervalId);
                resolve(data.data.submissionDetails);
            } catch (error) {
                if (attempts >= maxAttempts) {
                    clearInterval(intervalId);
                    reject(
                        new Error(
                            'Failed to fetch submission details within the allowed time'
                        )
                    );
                }
            }
        }, interval);
    });
};

export const getExam = async () => {
    const URL = examScheduleEndpoints.getExams;
    const response = await api.get(URL);
    console.log('htis is get Exam', response.data);

    return response.data;
};

export const addExam = async (values: any, includeCodeQuestions: boolean) => {
    const URL = examScheduleEndpoints.addExams;
    console.log('this is values', values);
    const response = await api.post(URL, {
        examTitle: values.examTitle,
        examDescription: values.examDescription,
        mcqQuestionMarks: values.mcqMarks,
        codeQuestionEasyMarks: values.easyMarks,
        codeQuestionMediumHardMarks: values.mediumMarks,
        hasCodeQuestions: includeCodeQuestions,
    });
    if (response && response.data) {
        return true;
    }
    return false;
};

export const scheduleExam = async (examId: number) => {
    const URL = examScheduleEndpoints.scheduleExams;
    const response = await api.post(URL, { examId });
    if (response) {
        return true;
    } else return false;
};

export const UnscheduleExam = async (examId: number) => {
    const URL = examScheduleEndpoints.unscheduleExam;

    try {
        const response = await api.post(URL, { examId });

        if (response) {
            return { success: true, message: 'Exam Unscheduled successfully' };
        } else {
            return { success: false, message: 'Failed to unschedule exam' };
        }
    } catch (error) {
        return {
            success: false,
            message: 'An error occurred while unscheduling the exam',
        };
    }
};

interface loginData {
    email: string;
    password: string;
    token: string;
    examId?: number;
}
export const loginExam = async (authData: loginData) => {
    try {
        const url = authEndPoints.loginExam;
        const response = await api.post(url, authData);
        console.log('this is response', response);
        if (response)
            return {
                success: true,
                data: response.data,
                message: 'Exam login successfully',
            };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response.data.message || 'An error occurred during login',
        };
    }
};

interface searchData {
    searchText?: string;
    status?: string;
}

export const searchUsers = async (searchData: searchData) => {
    const URL = userEndPoints.searchUsers;
    const response = await api.post(URL, {
        searchText: searchData.searchText,
        status: searchData.status,
    });
    console.log('this is responsasdfasdfe', response);
    if (response?.message === 'No Users found') return [];
    if (response) {
        return response.data;
    } else return 'failed to search users';
};

export const handleExamSubmit = async (examData: any) => {
    const URL = examEndpoints.handleResultEvaluation;
    const response = await api.post(URL, examData);

    return response;
};

export const getResult = async (getExam: any) => {
    try {
        const URL = examEndpoints.getResult;
        const response = await api.post(URL, {
            examId: getExam.examId,
            userId: getExam.userId,
        });
        console.log('this is response', response);

        if (response.data) {
            return response.data;
        }
    } catch (error: any) {
        console.log('here');
        return {
            sucess: false,
            message:
                error.response.data.message ||
                'An error occurred while fetching results',
        };
    }
};
export const getDashboardDatas = async () => {
    try {
        const URL = examEndpoints.getDashboardData;
        const response = await api.get(URL);

        if (response.data) {
            return response.data;
        }
    } catch (error: any) {
        console.log('here');
        return {
            sucess: false,
            message:
                error.response.data.message ||
                'An error occurred while fetching results',
        };
    }
};
