export interface Question {
    id: number;
    question: string;
    options?: string[];
    correctAnswer?: number;
    category: string;
    difficulty?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    deletedAt?: null | string | Date;
}

export interface RandomQuestionResponse {
    message: string;
    questionCollection: Question[];
}

export type LandMark = [number, number];

export interface FacePrediction {
    topLeft: [number, number];
    bottomRight: [number, number];
    landmarks: LandMark[];
}

export interface CheckedQuestionType {
    id: number;
    selectedOption?: string | null;
    selectedOptionIndex?: number;
    correctAnswer?: number;
    category?: string;
    difficulty?: string;
    isSolved?: boolean;
}

export interface CheckedQuestionCodeType {
    isSolved?: boolean;
    slug?: string;
}

export interface CheckedQuestionSetType
    extends CheckedQuestionType,
        CheckedQuestionCodeType {}
export interface IBlazeFaceModel {
    estimateFaces(input: any, returnTensors: boolean): Promise<any>;
    // Add any other methods or properties you need from BlazeFaceModel
}
export interface QuestionStateType {
    // id: number | null;
    // question: string | null;
    // options?: string[] | null;
    // correctAnswer?: number | null;
    // category: string | null;
    // questionNo: number | null;
    selectedQuestion: Question | null;
    activeQuesIndex?: number | null;
    questions?: Question[] | null;
    checkedQuestions?: CheckedQuestionType[] | null;
    showToast?: boolean | null;
    outOfViewCount?: number | null;
}
enum CustomError {
    webCamError = 'webCamError',
    audioError = 'audioError',
}

export interface SubmissionResponse {
    code: string;
    statusCode: string;
    runtimeError: string;
    compileError: string;
    lastTestcase: string;
    codeOutput: string;
    expectedOutput: string;
    totalCorrect: string;
    totalTestcases: string;
    fullCodeOutput: string;
    testDescriptions: string;
    testBodies: string;
    testInfo: string;
    stdOutput: string;
}

export interface CodeSnippet {
    code: string;
    lang: string;
    langSlug: string;
}

export interface LeetCodeQuestion {
    id: number;
    content: string;
    testCase: string;
    codeSnippets: CodeSnippet[];
}

export interface MediaDeviceInfo {
    deviceId: string;
    kind: string;
    label: string;
    groupId: string;
}

export { CustomError };
