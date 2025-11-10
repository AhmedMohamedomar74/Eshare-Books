import { useState } from "react";
import { validateRegisterForm } from "./../components/form/validation.js";
import { register, uploadImage } from "./../services/auth/auth.service.js";

export const useRegisterForm = () => {
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

  const validateForm = () => {
    const newErrors = validateRegisterForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    if (id) {
      try {
        await uploadImage(file, id);
        return { success: true, message: 'Profile image uploaded successfully!' };
      } catch (error) {
        console.error('Image upload error:', error);
        return { success: false, message: 'Failed to upload profile image. Please try again.' };
      }
    } else {
      return { success: false, message: 'Please complete step 1 first.' };
    }
  };

  const handleRegistration = async () => {
    try {
      setLoading(true);
      const response = await register(
        formData.firstName, 
        formData.secondName, 
        formData.email, 
        formData.password
      );
      setId(response.data.id);
      setStep(2);
      return { success: true, message: 'Account created successfully! Please add your profile photo.' };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.info || 'Registration failed. Please try again.';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};