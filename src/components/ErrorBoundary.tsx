import { useEffect, ErrorInfo, ReactElement } from 'react';
import { Toast } from '../helper/toast';

interface ErrorBoundaryProps {
    children: ReactElement;
}

const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
    const handleError = (error: Error, errorInfo: ErrorInfo) => {
        console.error('ErrorBoundary caught an error', error, errorInfo);
        Toast.Error('Something went wrong!');
    };

    useEffect(() => {
        const originalErrorHandler = (event: ErrorEvent) => {
            handleError(event.error, { componentStack: '' });
        };

        window.addEventListener('error', originalErrorHandler);

        return () => {
            window.removeEventListener('error', originalErrorHandler);
        };
    }, []);

    return children;
};

export default ErrorBoundary;
