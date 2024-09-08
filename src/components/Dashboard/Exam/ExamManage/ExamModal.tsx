import * as Yup from 'yup';
import React, { useState } from 'react';
import { DatePicker } from '@hilla/react-components/DatePicker';
import { TimePicker } from '@hilla/react-components/TimePicker.js';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Toast } from '../../../../helper/toast';
import { addExam } from '../../../../services/examService';

interface ExamInfoProps {
    onClose: () => void;
    onExamAdded: () => void;
}

const ExamInfo: React.FC<ExamInfoProps> = ({ onClose, onExamAdded }) => {
    const [includeCodeQuestions, setIncludeCodeQuestions] = useState(false);
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-CA'); // Format as YYYY/MM/DD
    const formattedTime = now.toTimeString().slice(0, 5);

    const [startDate, setStartDate] = useState(formattedDate);
    const [startTime, setStartTime] = useState(formattedTime);
    const [endTime, setEndTime] = useState(formattedTime);
    const validationSchema = Yup.object().shape({
        examTitle: Yup.string().required('Exam Title is required'),
        examDescription: Yup.string().required('Exam Description is required'),
        mcqMarks: Yup.number()
            .required('MCQ Question Marks are required')
            .min(1, 'Must be greater than 0'),
        easyMarks: Yup.number().when('includeCodeQuestions', {
            is: true,
            then: Yup.number()
                .required('Code Questions Easy Marks are required')
                .min(1, 'Must be greater than 0'),
        }),
        mediumMarks: Yup.number().when('includeCodeQuestions', {
            is: true,
            then: Yup.number()
                .required('Code Questions Medium and Hard Marks are required')
                .min(1, 'Must be greater than 0'),
        }),
    });

    const handleSubmit = async (values: any) => {
        console.log('values', values);
        const createExam = await addExam(values, includeCodeQuestions);
        if (createExam) {
            Toast.Success('Exam added successfully');
            onExamAdded();

            onClose();
            return;
        }
        Toast.Error('Error adding Exams');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-8 rounded-lg shadow-lg z-10 w-full max-h-[calc(100vh-50px)] overflow-y-auto max-w-lg">
                <h2 className="text-2xl mb-4">Exam Information</h2>
                <Formik
                    initialValues={{
                        examTitle: '',
                        examDescription: '',
                        mcqMarks: 0,
                        easyMarks: 0,
                        mediumMarks: 0,
                        includeCodeQuestions: false,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values }) => (
                        <Form>
                            <div className="mb-4">
                                <label className="block mb-2">Exam Title</label>
                                <Field
                                    type="text"
                                    name="examTitle"
                                    className="w-full p-2 border"
                                />
                                <ErrorMessage
                                    name="examTitle"
                                    component="div"
                                    className="text-red-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">
                                    Exam Description
                                </label>
                                <Field
                                    as="textarea"
                                    name="examDescription"
                                    className="w-full p-2 border"
                                />
                                <ErrorMessage
                                    name="examDescription"
                                    component="div"
                                    className="text-red-500"
                                />
                            </div>
                            <div className="mb-4 flex justify-between">
                                <TimePicker
                                    label="Start Time"
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                />
                                <TimePicker
                                    label="End Time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <DatePicker
                                    label="Select Start Date"
                                    min={formattedDate}
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">
                                    MCQ Question Marks
                                </label>
                                <Field
                                    type="number"
                                    name="mcqMarks"
                                    className="w-full p-2 border"
                                />
                                <ErrorMessage
                                    name="mcqMarks"
                                    component="div"
                                    className="text-red-500"
                                />
                            </div>
                            <div className="flex items-center gap-2 mb-4 ">
                                <Field
                                    type="checkbox"
                                    name="includeCodeQuestions"
                                    checked={includeCodeQuestions}
                                    onChange={() =>
                                        setIncludeCodeQuestions(
                                            !includeCodeQuestions
                                        )
                                    }
                                    className="ml-2"
                                />
                                <span>Include Code Questions</span>
                            </div>
                            {includeCodeQuestions && (
                                <>
                                    <div className="mb-4">
                                        <label className="block mb-2">
                                            Code Questions Easy Marks
                                        </label>
                                        <Field
                                            type="number"
                                            name="easyMarks"
                                            className="w-full p-2 border"
                                        />
                                        <ErrorMessage
                                            name="easyMarks"
                                            component="div"
                                            className="text-red-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">
                                            Code Questions Medium and Hard Marks
                                        </label>
                                        <Field
                                            type="number"
                                            name="mediumMarks"
                                            className="w-full p-2 border"
                                        />
                                        <ErrorMessage
                                            name="mediumMarks"
                                            component="div"
                                            className="text-red-500"
                                        />
                                    </div>
                                </>
                            )}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ExamInfo;
