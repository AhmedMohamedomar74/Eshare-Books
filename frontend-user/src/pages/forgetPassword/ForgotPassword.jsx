import React, { useState } from 'react';
import PasswordInput from '../../components/form/passwordInputComponent.jsx';
import Button from '../../components/form/buttonComponent.jsx';
import Input from '../../components/form/inputComponents.jsx';
import { validateEmail, validatePassword, validateConfirmPassword } from '../../components/form/validation.js';
import { useNavigate } from 'react-router-dom';
import { forgetPasswordSendEmail, resetPassword, verifyResetCode } from '../../services/auth/auth.service.js';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  // Validation functions
  const validateCode = (code) => {
    if (!code) return 'Verification code is required';
    if (code.length !== 6) return 'Code must be 6 digits';
    return '';
  };

  // Step 1: Request reset code
  const handleSendCode = async () => {
    const emailError = validateEmail(email);
    
    if (emailError) {
      setErrors({ email: emailError });
      setTouched({ email: true });
      return;
    }

    setLoading(true);
    try {
      // Replace with your API call
      // await forgotPasswordService.sendCode(email);
      const response = await forgetPasswordSendEmail(email); // Simulate API call
      
      setStep(2);
      setErrors({});
      setTouched({});
    } catch (error) {
      setErrors({ email: error.response?.data?.info || 'Failed to send code. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async () => {
    const codeError = validateCode(code);
    if (codeError) {
      setErrors({ code: codeError });
      setTouched({ code: true });
      return;
    }

    setLoading(true);
    try {
      // Replace with your API call
      // await forgotPasswordService.verifyCode(email, code);
      // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      const response = await verifyResetCode(email, code);
      setResetToken(response.data.resetToken)
      setStep(3);
      setErrors({});
      setTouched({});
    } catch (error) {
      setErrors({ code: error.response?.data?.info || 'Invalid or expired code. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async () => {
    const passwordError = validatePassword(newPassword);
    const confirmError = validateConfirmPassword(newPassword, confirmPassword);
    
    const newErrors = {};
    if (passwordError) newErrors.newPassword = passwordError;
    if (confirmError) newErrors.confirmPassword = confirmError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ newPassword: true, confirmPassword: true });
      return;
    }

    setLoading(true);
    try {
      // Replace with your API call
      // await forgotPasswordService.resetPassword(email, code, newPassword);
      // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      await resetPassword( resetToken  , newPassword);
      // Success - redirect to login
      navigate('/login');
    } catch (error) {
      setErrors({ newPassword: error.response?.data?.info || 'Failed to reset password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSnKGyhHabigIj3zM4Gsl5Q8T3CFWtFp6iXVFoLToGLJXwlQHZJaF38UENNwiorq_GmyDsjx_JNqWda2SsuCqueIfrgcmNNbY6luq19hbJwAQe9CcyRCO-Eg5Q3NbM7Jc1BHNSYraFvE8WBM-ARVTG5zUTBtIEsjARkElBUUKbn2mEV5aF9NRVtxLXECFFVDJPl5g9dYJByG-1SX7xvqybcczpgYo0IF6Cw_ljlDdz_XPaCOxl4O-dfK8w2hR8s0SXhH49MrOvZkJ')",
        backgroundColor: '#f6f7f7',
      }}
    >
      <div className="w-full max-w-md p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm p-8 sm:p-10 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">EshareBook</h1>
            <p className="mt-2 text-base text-gray-600">
              {step === 1 && "Reset your password"}
              {step === 2 && "Verify your email"}
              {step === 3 && "Create new password"}
            </p>
          </div>

          <div className="w-full">
            {/* Step Indicator */}
            <div className="mb-6 flex justify-center">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <React.Fragment key={s}>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        s <= step ? 'bg-teal-700' : 'bg-gray-300'
                      }`}
                    />
                    {s < 3 && (
                      <div
                        className={`h-0.5 w-8 ${
                          s < step ? 'bg-teal-700' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step 1: Enter Email */}
            {step === 1 && (
              <div className="flex flex-col gap-y-5">
                <p className="text-sm text-gray-600 text-center">
                  Enter your email address and we'll send you a verification code to reset your password.
                </p>
                
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({});
                  }}
                  onBlur={() => handleBlur('email')}
                  error={touched.email ? errors.email : ''}
                  required
                />

                <Button
                  type="button"
                  onClick={handleSendCode}
                  loading={loading}
                >
                  Send Verification Code
                </Button>

                <div className="text-center">
                  <a className="text-sm font-medium text-teal-700 hover:underline" href="/login">
                    Back to Login
                  </a>
                </div>
              </div>
            )}

            {/* Step 2: Enter Verification Code */}
            {step === 2 && (
              <div className="flex flex-col gap-y-5">
                <p className="text-sm text-gray-600 text-center">
                  We've sent a 6-digit verification code to <strong>{email}</strong>. Please enter it below.
                </p>
                
                <Input
                  label="Verification Code"
                  name="code"
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(value);
                    if (errors.code) setErrors({});
                  }}
                  onBlur={() => handleBlur('code')}
                  error={touched.code ? errors.code : ''}
                  required
                />

                <Button
                  type="button"
                  onClick={handleVerifyCode}
                  loading={loading}
                >
                  Verify Code
                </Button>

                <div className="text-center">
                  <button
                    className="text-sm font-medium text-teal-700 hover:underline"
                    onClick={() => setStep(1)}
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Create New Password */}
            {step === 3 && (
              <div className="flex flex-col gap-y-5">
                <p className="text-sm text-gray-600 text-center">
                  Create a strong new password for your account.
                </p>
                
                <PasswordInput
                  label="New Password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }));
                  }}
                  onBlur={() => handleBlur('newPassword')}
                  error={touched.newPassword ? errors.newPassword : ''}
                  required
                  showStrength
                />

                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  onBlur={() => handleBlur('confirmPassword')}
                  error={touched.confirmPassword ? errors.confirmPassword : ''}
                  required
                />

                <Button
                  type="button"
                  onClick={handleResetPassword}
                  loading={loading}
                >
                  Reset Password
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;