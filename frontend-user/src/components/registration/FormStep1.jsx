import Input from "../../components/form/inputComponents.jsx";
import PasswordInput from "../../components/form/passwordInputComponent.jsx";
import Button from "../../components/form/buttonComponent.jsx";

const FormStep1 = ({ 
  formData, 
  errors, 
  touched, 
  loading, 
  onChange, 
  onBlur, 
  onSubmit 
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="First Name"
        name="firstName"
        placeholder="Enter your first name"
        value={formData.firstName}
        onChange={onChange}
        onBlur={onBlur}
        error={touched.firstName ? errors.firstName : ''}
        required
      />

      <Input
        label="Second Name"
        name="secondName"
        placeholder="Enter your second name"
        value={formData.secondName}
        onChange={onChange}
        onBlur={onBlur}
        error={touched.secondName ? errors.secondName : ''}
        required
      />

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={onChange}
        onBlur={onBlur}
        error={touched.email ? errors.email : ''}
        required
      />

      <PasswordInput
        label="Password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={onChange}
        onBlur={onBlur}
        error={touched.password ? errors.password : ''}
        required
        showStrength={true}
      />

      <PasswordInput
        label="Confirm Password"
        name="confirmPassword"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={onChange}
        onBlur={onBlur}
        error={touched.confirmPassword ? errors.confirmPassword : ''}
        required
      />

      <Button 
        className="mt-4 w-full rounded-lg bg-[#5D9C59] py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#5D9C59]/90 focus:outline-none focus:ring-2 focus:ring-[#5D9C59]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={onSubmit}
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
  );
};

export default FormStep1;