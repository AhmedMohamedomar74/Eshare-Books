import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const success = searchParams.get('success');
        const message = searchParams.get('message');

        if (success === 'true') {
            setStatus('success');
            setMessage(message || 'Email verified successfully!');
        } else {
            setStatus('error');
            setMessage(message || 'Email verification failed. Please try again.');
        }

        // Auto redirect after 5 seconds
        const timer = setTimeout(() => {
            navigate('/login');
        }, 5000);

        return () => clearTimeout(timer);
    }, [searchParams, navigate]);

    const handleRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        {status === 'loading' && (
                            <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {status === 'success' && (
                            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {status === 'error' && (
                            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {status === 'loading' && 'Verifying Email...'}
                        {status === 'success' && 'Email Verified!'}
                        {status === 'error' && 'Verification Failed'}
                    </h1>
                </div>

                {/* Message */}
                <div className="text-center mb-8">
                    <p className={`text-lg ${
                        status === 'success' ? 'text-green-600' : 
                        status === 'error' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                        {message}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        You will be redirected to login page in 5 seconds...
                    </p>
                </div>

                {/* Action Button */}
                <div className="text-center">
                    <button
                        onClick={handleRedirect}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Go to Login
                    </button>
                </div>

                {/* Additional Info */}
                {status === 'error' && (
                    <div className="mt-6 p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">
                            If you continue to experience issues, please contact support or try resending the verification email.
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                            Your email has been successfully verified. You can now log in to your account.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;