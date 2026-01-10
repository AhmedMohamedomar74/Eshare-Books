import { useRegisterForm } from "./../../hooks/useRegisterForm.js";
import { usePopup } from "./../../hooks/usePopup";
import StepIndicator from "./../../components/registration/StepIndicator.jsx";
import FormStep1 from "../../components/registration/FormStep1.jsx";
import FormStep2 from "./../../components/registration/FormStep2.jsx";
import Popup from "../../components/common/Popup.jsx";
import HeroSection from "../../components/registration/HeroSection.jsx";
import LoginLink from "../../components/registration/LoginLink";
import { useNavigate } from "react-router-dom";

const BookShareRegister = () => {
  const {
    step,
    setStep,
    formData,
    errors,
    touched,
    loading,
    setLoading,
    profileImage,
    handleChange,
    handleBlur,
    validateForm,
    handleImageUpload,
    handleRegistration,
    setTouched
  } = useRegisterForm();

  const { popup, showPopup, hidePopup } = usePopup();
  const navigate = useNavigate()

  const handleNext = async (e) => {
    e.preventDefault();
    
    setTouched({ 
      firstName: true, 
      secondName: true, 
      email: true, 
      password: true, 
      confirmPassword: true 
    });
    
    if (!validateForm()) {
      showPopup('error', 'Please fix the form errors before proceeding.');
      return;
    }
    
    const result = await handleRegistration();
    showPopup(result.success ? 'success' : 'error', result.message);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleImageUploadWithPopup = async (file) => {
    const result = await handleImageUpload(file);
    showPopup(result.success ? 'success' : result.message.includes('step 1') ? 'warning' : 'error', result.message);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // Simulate API call or do final registration steps
      console.log('Registration data:', { ...formData, profileImage });
      
      showPopup('success', 'Registration completed! Please check your email to verify your account.');
      
      setTimeout(() => {
        navigate('/login');
        setLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Final registration error:', error);
      showPopup('error', 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 lg:p-8 bg-[#F7F1E5]">
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
          duration={popup.type === 'success' ? 5000 : 7000}
        />
      )}
      
      <div className="container mx-auto grid max-w-6xl grid-cols-1 overflow-hidden rounded-xl bg-white shadow-2xl shadow-black/10 lg:grid-cols-2">
        
        <HeroSection />

        <div className="flex flex-col items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md">
            <StepIndicator step={step} />

            {step === 1 ? (
              <FormStep1
                formData={formData}
                errors={errors}
                touched={touched}
                loading={loading}
                onChange={handleChange}
                onBlur={handleBlur}
                onSubmit={handleNext}
              />
            ) : (
              <FormStep2
                profileImage={profileImage}
                loading={loading}
                onImageUpload={handleImageUploadWithPopup}
                onBack={handleBack}
                onSubmit={handleFinalSubmit}
              />
            )}

            <LoginLink />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookShareRegister;