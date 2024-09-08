import * as Yup from 'yup';
import Button from '../../common/Button';
import React from 'react';
import { ErrorMessage, Field, FieldArray, Formik, FormikHelpers } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setMCQFormValues } from '../../../feature/questions/questionsSlice';

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

const MCQQuestionsAdd: React.FC<{
    prevStep: () => void;
    nextStep: () => void;
}> = ({ prevStep, nextStep }) => {
    const dispatch = useAppDispatch();
    const savedFormValues = useAppSelector(
        (state) => state.questions.formValues
    );

    const initialQuestionOptionsLength = 4;
    const initialQuestions: Question[] = [
        {
            question: '',
            options: Array.from(
                { length: initialQuestionOptionsLength },
                () => ({ text: '' })
            ),
            correctOptionIndex: null,
        },
    ];

    const initialValues: FormValues = savedFormValues.questions.length
        ? savedFormValues
        : { questions: initialQuestions };

    const validationSchema = Yup.object().shape({
        questions: Yup.array().of(
            Yup.object().shape({
                question: Yup.string().required('Question is required'),
                options: Yup.array()
                    .of(
                        Yup.object().shape({
                            text: Yup.string().required(
                                'Option text is required'
                            ),
                        })
                    )
                    .min(
                        initialQuestionOptionsLength,
                        `At least ${initialQuestionOptionsLength} options are required`
                    )
                    .required('Options are required'),
                correctOptionIndex: Yup.number()
                    .nullable()
                    .required('Correct option is required')
                    .min(0, 'Select a valid option'),
            })
        ),
    });

    const handleSubmit = async (
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
    ) => {
        try {
            dispatch(setMCQFormValues(values));
            nextStep();
        } catch (error) {
            console.error('Error adding MCQ questions:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl mb-4">Quiz Questions</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, isSubmitting, setFieldValue, submitForm }) => (
                    <>
                        <FieldArray name="questions">
                            {({ push, remove }) => (
                                <div>
                                    {values.questions.map((item, index) => (
                                        <div
                                            key={index}
                                            className="mb-4 relative"
                                        >
                                            <label className="block mb-2">
                                                Question {index + 1}
                                            </label>
                                            <Field
                                                name={`questions.${index}.question`}
                                                placeholder="Enter Question Title"
                                                className="w-full p-2 border mb-2"
                                            />
                                            <ErrorMessage
                                                name={`questions.${index}.question`}
                                                component="div"
                                                className="text-red-500 my-2"
                                            />
                                            {values.questions.length > 1 && (
                                                <Button
                                                    variant="danger"
                                                    handleBtnClick={() =>
                                                        remove(index)
                                                    }
                                                    className="absolute top-[-12px] right-0"
                                                >
                                                    X
                                                </Button>
                                            )}

                                            <FieldArray
                                                name={`questions.${index}.options`}
                                            >
                                                {({
                                                    push: pushOption,
                                                    remove: removeOption,
                                                }) => (
                                                    <div>
                                                        {item.options.map(
                                                            (
                                                                _,
                                                                optionIndex
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        optionIndex
                                                                    }
                                                                    className="flex flex-col"
                                                                >
                                                                    <div className="flex items-center">
                                                                        <Field
                                                                            name={`questions.${index}.options.${optionIndex}.text`}
                                                                            placeholder={`Option ${optionIndex + 1}`}
                                                                            className="w-full p-2 border mr-2"
                                                                        />
                                                                        <Button
                                                                            variant="danger"
                                                                            handleBtnClick={() =>
                                                                                removeOption(
                                                                                    optionIndex
                                                                                )
                                                                            }
                                                                            className="mr-2"
                                                                        >
                                                                            -
                                                                        </Button>
                                                                        <Button
                                                                            variant={
                                                                                item.correctOptionIndex ===
                                                                                optionIndex
                                                                                    ? 'primary'
                                                                                    : 'secondary'
                                                                            }
                                                                            handleBtnClick={() =>
                                                                                setFieldValue(
                                                                                    `questions.${index}.correctOptionIndex`,
                                                                                    optionIndex
                                                                                )
                                                                            }
                                                                            className="w-[16rem]"
                                                                        >
                                                                            {item.correctOptionIndex ===
                                                                            optionIndex
                                                                                ? 'Correct'
                                                                                : 'Set as Correct'}
                                                                        </Button>
                                                                    </div>
                                                                    <div className="text-red-500 mt-2 mb-2">
                                                                        <ErrorMessage
                                                                            name={`questions.${index}.options.${optionIndex}.text`}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                        {item.options.length <
                                                            4 && (
                                                            <div className="text-red-500 mt-2">
                                                                At least four
                                                                options are
                                                                required
                                                            </div>
                                                        )}
                                                        <Button
                                                            variant="primary"
                                                            handleBtnClick={() =>
                                                                pushOption({
                                                                    text: '',
                                                                })
                                                            }
                                                            className="mt-4 mb-4"
                                                        >
                                                            Add Option
                                                        </Button>
                                                    </div>
                                                )}
                                            </FieldArray>
                                            <ErrorMessage
                                                name={`questions.${index}.correctOptionIndex`}
                                                component="div"
                                                className="text-red-500 mt-2"
                                            />
                                        </div>
                                    ))}
                                    <div className="flex justify-start gap-5">
                                        <Button
                                            variant="primary"
                                            outline
                                            handleBtnClick={() =>
                                                push({
                                                    question: '',
                                                    options: Array.from(
                                                        {
                                                            length: initialQuestionOptionsLength,
                                                        },
                                                        () => ({ text: '' })
                                                    ),
                                                    correctOptionIndex: null,
                                                })
                                            }
                                        >
                                            Add a New MCQ Question
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </FieldArray>
                        <div className="mt-4 flex justify-between">
                            <Button
                                variant="secondary"
                                className="bg-gray-500"
                                handleBtnClick={() => {
                                    dispatch(setMCQFormValues(values));
                                    prevStep();
                                }}
                            >
                                Previous
                            </Button>

                            <Button
                                variant="primary"
                                handleBtnClick={() => submitForm()}
                                disabled={isSubmitting}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </Formik>
        </div>
    );
};

export default MCQQuestionsAdd;
