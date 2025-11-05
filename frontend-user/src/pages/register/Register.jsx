import React, { useState } from 'react';
import Button from '../../components/form/buttonComponent.jsx';
import PasswordInput from '../../components/form/passwordInputComponent.jsx';
import Input from '../../components/form/inputComponents.jsx';
import { validateConfirmPassword, validateEmail, validateFullName, validatePassword } from '../../components/form/validation.js';

const BookShareRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'Reader'
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuASROdCfuTXkQJrI2gIsXu_zfPV0ZEToXbOL6sP_7ry4ppfTG-6SdQKt7OipdSA5vu7026RcVp7NrSm9A-8onTcX1SUppPNu6OKnVgVZ6g8Tfl2WTW-jA492MRYfl286wd1fSl16Yb1U51MDPnwwVv30jKojGN8OTprd1DnWTkbetPJVOTFt4ko0ahPBuJ0aZVsHfZmp0NJ7zBHSNuUdxTHVM1cJkeCL-PSbxC5xjB6xWrCJZr3_hLQsFtAFKqUXzLGIvdvxTGMJP9r');

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
    
    let error = '';
    if (name === 'fullName') error = validateFullName(formData.fullName);
    else if (name === 'email') error = validateEmail(formData.email);
    else if (name === 'password') error = validatePassword(formData.password);
    else if (name === 'confirmPassword') error = validateConfirmPassword(formData.password, formData.confirmPassword);
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = validateFullName(formData.fullName);
    if (nameError) newErrors.fullName = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      console.log('Registration data:', formData);
      alert('Registration successful! (This is a demo)');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 lg:p-8 bg-[#F7F1E5]">
      <div className="container mx-auto grid max-w-6xl grid-cols-1 overflow-hidden rounded-xl bg-white shadow-2xl shadow-black/10 lg:grid-cols-2">
        
        <div className="relative hidden h-full items-center justify-center bg-[#5D9C59]/10 p-12 lg:flex">
          <img 
            className="absolute inset-0 h-full w-full object-cover opacity-20" 
            alt="Reading books" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDooqQWH4nBEQVvTnToZwrbMLM0DZ6GazKWMPWIcnxq71Vw5ZkigWPxv23qYihieSLfO7pdNkTRgYS95lvkoGfQvXUjkqav1LUY3TY89rXFgPf8UlWzJzQfosmwqNKbwmXtUb9OvPDlMdms1GmSK_ZBpvmKgb2A2qZwO6ZluZcTpmNu-l-f2X3Bzyd6OeowM40CjeybO_hiLz784SbEiyt2qzWwQkQYo5nhooKt_iDb1oiP4elpnoBYUuSJPG-Swaa_YclPkU1_nLPk"
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
            </div>

            <div className="flex flex-col gap-4">
              <Input
                label="Full Name"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.fullName ? errors.fullName : ''}
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

              <label className="flex flex-col">
                <p className="text-base font-medium leading-normal pb-2">Account Type</p>
                <select 
                  className="w-full rounded-lg border border-gray-300 bg-white p-3.5 text-base text-[#757575] focus:border-[#5D9C59] focus:outline-none focus:ring-1 focus:ring-[#5D9C59]"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                >
                  <option>Reader</option>
                  <option>Donor</option>
                  <option>Seller</option>
                </select>
              </label>

              <div>
                <p className="text-base font-medium leading-normal pb-2">
                  Profile Picture <span className="text-[#757575]">(Optional)</span>
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    className="h-16 w-16 rounded-full object-cover" 
                    alt="Profile" 
                    src={profileImage}
                  />
                  <label 
                    className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100" 
                    htmlFor="file-upload"
                  >
                    <span>Upload Photo</span>
                    <input 
                      className="hidden" 
                      id="file-upload" 
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              <Button 
                className="mt-4 w-full rounded-lg bg-[#5D9C59] py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#5D9C59]/90 focus:outline-none focus:ring-2 focus:ring-[#5D9C59]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
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
                ) : 'Register'}
              </Button>
            </div>

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