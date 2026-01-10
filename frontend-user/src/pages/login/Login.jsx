import React, { useState } from 'react';
import PasswordInput from '../../components/form/passwordInputComponent.jsx';
import Button from '../../components/form/buttonComponent.jsx';
import Input from '../../components/form/inputComponents.jsx';
import { validateLoginForm } from '../../components/form/validation.js';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/auth/auth.service.js';
import { usePopup } from '../../hooks/usePopup.js'; // Import the popup hook
import Popup from '../../components/common/Popup.jsx'; // Import your popup component

const BookCycleLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize popup hook
  const { popup, showPopup, hidePopup } = usePopup();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate on blur using the centralized form validation
    const newErrors = validateLoginForm(formData);
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = validateLoginForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = await login(formData.email, formData.password);
      setLoading(false);
      navigate('/');
      console.log(token);
    } catch (error) {
      setLoading(false);
      console.log(error);

      // Show error popup with backend error message
      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        // Backend responded with error status
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }

      showPopup('error', errorMessage);
    }
  };

  const handleGoHome = () => {
    navigate('/');
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
      {/* Home Icon Button - Top Left Corner */}
      <button
        onClick={handleGoHome}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 shadow-md transition-all hover:bg-white hover:shadow-lg"
        aria-label="Go to home page"
      >
        <span className="text-xl">🏠</span>
        <span className="font-medium text-gray-700">Home</span>
      </button>

      {/* Popup Component */}
      {popup.show && (
        <Popup
          type={popup.type}
          message={popup.message}
          onClose={hidePopup}
          duration={5000} // Auto close after 5 seconds
        />
      )}

      <div className="w-full max-w-md p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm p-8 sm:p-10 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">EshareBook</h1>
            <p className="mt-2 text-base text-gray-600">Welcome back! Please enter your details.</p>
          </div>

          <div className="w-full">
            <div className="flex flex-col gap-y-5">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : ''}
                required
              />

              <PasswordInput
                label="Password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password ? errors.password : ''}
                required
              />
            </div>

            <div className="mt-5 flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Input
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-teal-700 focus:ring-teal-700/50"
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  className="text-gray-900 text-sm font-normal leading-normal flex-1 truncate"
                  htmlFor="remember-me"
                >
                  Remember me
                </label>
              </div>
              <div className="shrink-0">
                <Link className="text-sm font-medium text-teal-700 hover:underline" to="/forget-password">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="mt-6 w-full">
              <Button type="submit" onClick={handleSubmit} loading={loading}>
                Login
              </Button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link className="font-bold text-teal-700 hover:underline" to="/register">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCycleLogin;