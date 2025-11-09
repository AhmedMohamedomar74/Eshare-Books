import { useState } from "react";
import Button from "../../components/form/buttonComponent.jsx";
import Input from "../../components/form/inputComponents.jsx";
import PasswordInput from "../../components/form/passwordInputComponent.jsx";
import { validateRegisterForm } from "../../components/form/validation.js";
import { register, uploadImage } from "../../services/auth/auth.service.js";
import Popup from "../../components/common/Popup.jsx";

const BookShareRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');
  const [profileImage, setProfileImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuASROdCfuTXkQJrI2gIsXu_zfPV0ZEToXbOL6sP_7ry4ppfTG-6SdQKt7OipdSA5vu7026RcVp7NrSm9A-8onTcX1SUppPNu6OKnVgVZ6g8Tfl2WTW-jA492MRYfl286wd1fSl16Yb1U51MDPnwwVv30jKojGN8OTprd1DnWTkbetPJVOTFt4ko0ahPBuJ0aZVsHfZmp0NJ7zBHSNuUdxTHVM1cJkeCL-PSbxC5xjB6xWrCJZr3_hLQsFtAFKqUXzLGIvdvxTGMJP9r');
  
  // Popup states
  const [popup, setPopup] = useState({
    show: false,
    type: '', // 'success', 'error', 'warning'
    message: ''
  });

  const showPopup = (type, message) => {
    setPopup({
      show: true,
      type,
      message
    });
  };

  const hidePopup = () => {
    setPopup({
      show: false,
      type: '',
      message: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const newErrors = validateRegisterForm(formData);
    setErrors(newErrors);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    console.log({ file });
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload
      if (id) {
        try {
          console.log({ id });
          const response = await uploadImage(file, id);
          console.log(response);
          showPopup('success', 'Profile image uploaded successfully!');
        } catch (error) {
          console.error('Image upload error:', error);
          showPopup('error', 'Failed to upload profile image. Please try again.');
        }
      } else {
        showPopup('warning', 'Please complete step 1 first.');
      }
    }
  };

  const validateForm = () => {
    const newErrors = validateRegisterForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    
    setTouched({ firstName: true, secondName: true, email: true, password: true, confirmPassword: true });
    
    if (!validateForm()) {
      showPopup('error', 'Please fix the form errors before proceeding.');
      return;
    }
    
    try {
      setLoading(true);
      const response = await register(formData.firstName, formData.secondName, formData.email, formData.password);
      setId(response.data.id);
      console.log(response);
      setStep(2);
      showPopup('success', 'Account created successfully! Please add your profile photo.');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      showPopup('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // Simulate API call or do final registration steps
      console.log('Registration data:', { ...formData, profileImage });
      
      // Show success message
      showPopup('success', 'Registration completed! Please check your email to verify your account.');
      
      // You can redirect to login page after a delay
      setTimeout(() => {
        // window.location.href = '/login'; // Uncomment to redirect
        setLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Final registration error:', error);
      showPopup('error', 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 lg:p-8 bg-[#F7F1E5]">
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
        
        <div className="relative hidden h-full items-center justify-center bg-[#5D9C59]/10 p-12 lg:flex">
          <img 
            className="absolute inset-0 h-full w-full object-cover opacity-20" 
            alt="Reading books" 
            src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg?semt=ais_hybrid&w=740&q=80"
          />
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold text-[#5D9C59]">Join a Community of Book Lovers</h2>
            <p className="mt-4 text-lg text-[#757575]">Share, discover, and connect through the magic of reading.</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-[#333333]">Create Your Account</h1>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className={`h-2 w-16 rounded-full ${step === 1 ? 'bg-[#5D9C59]' : 'bg-gray-300'}`}></div>
                <div className={`h-2 w-16 rounded-full ${step === 2 ? 'bg-[#5D9C59]' : 'bg-gray-300'}`}></div>
              </div>
              <p className="mt-2 text-sm text-[#757575]">Step {step} of 2</p>
            </div>

            {step === 1 ? (
              <div className="flex flex-col gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstName ? errors.firstName : ''}
                  required
                />

                <Input
                  label="Second Name"
                  name="secondName"
                  placeholder="Enter your second name"
                  value={formData.secondName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.secondName ? errors.secondName : ''}
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
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
                  showStrength={true}
                />

                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword ? errors.confirmPassword : ''}
                  required
                />

                <Button 
                  className="mt-4 w-full rounded-lg bg-[#5D9C59] py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#5D9C59]/90 focus:outline-none focus:ring-2 focus:ring-[#5D9C59]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : 'Next: Add Profile Photo'}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-[#333333] mb-2">Add Your Profile Photo</h2>
                  <p className="text-sm text-[#757575]">Help others recognize you (optional)</p>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <img 
                    className="h-32 w-32 rounded-full object-cover border-4 border-[#5D9C59]/20" 
                    alt="Profile" 
                    src={profileImage}
                  />
                  
                  <div className="flex flex-col gap-3 w-full">
                    <label 
                      className="cursor-pointer rounded-lg bg-[#5D9C59] px-6 py-3 text-center text-base font-medium text-white transition-colors hover:bg-[#5D9C59]/90" 
                      htmlFor="file-upload"
                    >
                      <span>Choose Photo</span>
                      <input 
                        className="hidden" 
                        id="file-upload" 
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    
                    <p className="text-xs text-center text-[#757575]">
                      JPG, PNG or GIF (Max 5MB)
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button 
                    className="flex-1 rounded-lg border-2 border-[#5D9C59] py-3.5 text-base font-semibold text-[#5D9C59] transition-colors hover:bg-[#5D9C59]/10 focus:outline-none focus:ring-2 focus:ring-[#5D9C59]/50 focus:ring-offset-2" 
                    onClick={handleBack}
                  >
                    Back
                  </Button>

                  <Button 
                    className="flex-1 rounded-lg bg-[#5D9C59] py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#5D9C59]/90 focus:outline-none focus:ring-2 focus:ring-[#5D9C59]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                      </span>
                    ) : 'Complete Registration'}
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-[#757575]">
                Already have an account? <a className="font-medium text-[#DF826C] hover:underline" href="#">Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookShareRegister;