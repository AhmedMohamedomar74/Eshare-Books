import React, { useState } from 'react';
import { useSelector } from "react-redux";

const PasswordInput = ({ 
  label, 
  name, 
  placeholder, 
  value, 
  onChange, 
  error,
  required = false,
  showStrength = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { content } = useSelector((state) => state.lang);

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    const labels = ['', content.register.passwordStrength.weak, content.register.passwordStrength.fair, content.register.passwordStrength.good, content.register.passwordStrength.strong];
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
    
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = showStrength ? getPasswordStrength(value) : null;

  return (
    <label className="flex flex-col">
      <p className="text-base font-medium leading-normal pb-2">
        {label} {required && <span className="text-red-500">{content.common.required}</span>}
      </p>
      <div className="relative flex w-full items-center">
        <input
          className={`w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} bg-white p-3.5 pr-10 text-base placeholder:text-gray-500 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700`}
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <div 
          className="absolute right-3 flex items-center justify-center text-gray-500 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? content.common.passwordHide : content.common.passwordShow}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            {showPassword ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            )}
          </svg>
        </div>
      </div>
      
      {showStrength && value && passwordStrength && (
        <div className="mt-2">
          <div className="flex gap-1 mb-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded ${
                  level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">{passwordStrength.label}</span>
        </div>
      )}
      
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </label>
  );
};

export default PasswordInput;