import * as Yup from 'yup';
import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Toast } from '../../helper/toast';

// Define validation schema using Yup
const validationSchema = Yup.object({
    password: Yup.string()
        .required('Password is requiredf')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(
            /[\W_]/,
            'Password must contain at least one special character'
        ),
    confirmPassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const ResetPassword: React.FC = () => {
    const handleSubmit = (values: {
        password: string;
        confirmPassword: string;
    }) => {
        if (values.password === values.confirmPassword) {
            values.password = '';
            values.confirmPassword = '';
            Toast.Success('Password Reset Successfully');
        } else {
            Toast.Error('Password and Confirm Password must be same');
        }
    };

    return (
        <div className="flex justify-center  mt-4">
            <Formik
                initialValues={{ password: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form className="w-1/3 p-6 bg-white rounded shadow border-2 border-indigo-500">
                    <h2 className="text-2xl font-bold mb-6 flex justify-center">
                        Reset Password
                    </h2>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block mb-2 font-medium"
                        >
                            New Password
                        </label>
                        <Field
                            type="password"
                            id="password"
                            name="password"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="confirmPassword"
                            className="block mb-2 font-medium"
                        >
                            Confirm Password
                        </label>
                        <Field
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                    >
                        Reset
                    </button>
                </Form>
            </Formik>
        </div>
    );
};

export default ResetPassword;
