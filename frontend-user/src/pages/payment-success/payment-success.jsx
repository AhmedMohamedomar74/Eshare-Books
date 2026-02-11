import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './payment-success.css';
const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status');
  const transactionId = searchParams.get('transactionId');

  const getStatusContent = () => {
    switch (status) {
      case 'success':
        return {
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully.',
          icon: '✅',
          buttonText: 'Continue Shopping'
        };
      case 'pending':
        return {
          title: 'Payment Pending',
          message: 'Your payment is being processed. Please wait for confirmation.',
          icon: '⏳',
          buttonText: 'Go Home'
        };
      case 'failed':
        return {
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again.',
          icon: '❌',
          buttonText: 'Try Again'
        };
      default:
        return {
          title: 'Payment Error',
          message: 'An error occurred during payment processing.',
          icon: '⚠️',
          buttonText: 'Go Back'
        };
    }
  };

  const { title, message, icon, buttonText } = getStatusContent();

  const handleButtonClick = () => {
    if (status === 'failed') {
      // Redirect to payment page to try again
      navigate('/payment');
    } else {
      // Redirect to home or orders page
      navigate('/');
    }
  };

  return (
    <div className="payment-status-container">
      <div className="payment-status-card">
        <div className="status-icon">{icon}</div>
        <h1 className="status-title">{title}</h1>
        <p className="status-message">{message}</p>
        
        {transactionId && status === 'success' && (
          <p className="transaction-id">
            Transaction ID: {transactionId}
          </p>
        )}
        
        <button 
          className="continue-button"
          onClick={handleButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;