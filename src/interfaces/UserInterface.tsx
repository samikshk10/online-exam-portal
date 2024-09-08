export interface UserInterface {
    id?: number;
    fullName: string;
    email: string;
    role?: string;
    status?: string;
}
export interface ExamInterface {
    id: number;
    examTitle: string;
    examDescription: string;
    mcqQuestionMarks: number;
    codeQuestionEasyMarks: number;
    codeQuestionMediumHardMarks?: number;
    hasCodeQuestions?: boolean;
    totalMarks?: number;
    existScheduleExam?: boolean;
}

export interface ResultInterface {
    id: number;
    exam: ExamInterface;
    user: UserInterface;
    obtainedMarks: number;
    totalMarks: number;
}
