// validation.js - Validation utility functions

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
};

export const validateFullName = (name) => {
  if (!name) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters long';
  if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
  return '';
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return '';
};

// Validate entire form
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validateRequired(formData.password, 'Password');
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

export const validateRegisterForm = (formData) => {
  const errors = {};
  
  const nameError = validateFullName(formData.fullName);
  if (nameError) errors.fullName = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(
    formData.password, 
    formData.confirmPassword
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  return errors;
};

// Real-time validation hook
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    if (validationRules[name]) {
      const error = validationRules[name](values[name], values);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(field => {
      const error = validationRules[field](values[field], values);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setValues,
    setErrors
  };
};