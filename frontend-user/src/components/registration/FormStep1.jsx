import Input from "../../components/form/inputComponents.jsx";
import PasswordInput from "../../components/form/passwordInputComponent.jsx";
import Button from "../../components/form/buttonComponent.jsx";
import { useSelector } from "react-redux";

const FormStep1 = ({ 
  formData, 
  errors, 
  touched, 
  loading, 
  onChange, 
  onBlur, 
  onSubmit 
}) => {
  const { content } = useSelector((state) => state.lang);

  return (
    <div className="flex flex-col gap-4">
      <Input
        label={content.register.step1.firstName}
        name="firstName"
        placeholder={content.register.step1.firstNamePlaceholder}
        value={formData.firstName}
        onChange={onChange}
        onBlur={onBlur}
        error={touched.firstName ? errors.firstName : ''}
        required
      />

      <Input
        label={content.register.step1.secondName}
        name="secondName"
        placeholder={content.register.step1.secondNamePlaceholder}
        value={formData.secondName}
        onChange={onChange}
        onBlur={onBlur}
        error={touched.secondName ? errors.secondName : ''}
        required
      />

      <Input
        label={content.register.step1.email}
        name="email"
        type="email"
        placeholder={content.register.step1.emailPlaceholder}
        value={formData.email}
        onChange={onChange}
        onBlur={onBlur}
        error={touched.email ? errors.email : ''}
        required
      />

      <PasswordInput
        label={content.register.step1.password}
        name="password"
        placeholder={content.register.step1.passwordPlaceholder}
        value={formData.password}
        onChange={onChange}
        onBlur={onBlur}
        error={touched.password ? errors.password : ''}
        required
        showStrength={true}
      />

      <PasswordInput
        label={content.register.step1.confirmPassword}
        name="confirmPassword"
        placeholder={content.register.step1.confirmPasswordPlaceholder}
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
            {content.register.loading.creatingAccount}
          </span>
        ) : content.register.step1.nextButton}
      </Button>
    </div>
  );
};

export default FormStep1;