import Button from "../../components/form/buttonComponent.jsx";
import { useSelector } from "react-redux";

const FormStep2 = ({ 
  profileImage, 
  loading, 
  onImageUpload, 
  onBack, 
  onSubmit 
}) => {
  const { content } = useSelector((state) => state.lang);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[#333333] mb-2">{content.register.step2.title}</h2>
        <p className="text-sm text-[#757575]">{content.register.step2.subtitle}</p>
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
            <span>{content.register.step2.choosePhoto}</span>
            <input 
              className="hidden" 
              id="file-upload" 
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          
          <p className="text-xs text-center text-[#757575]">
            {content.register.step2.fileRequirements}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <Button 
          className="flex-1 rounded-lg border-2 border-[#5D9C59] py-3.5 text-base font-semibold text-[#5D9C59] transition-colors hover:bg-[#5D9C59]/10 focus:outline-none focus:ring-2 focus:ring-[#5D9C59]/50 focus:ring-offset-2" 
          onClick={onBack}
        >
          {content.register.step2.backButton}
        </Button>

        <Button 
          className="flex-1 rounded-lg bg-[#5D9C59] py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#5D9C59]/90 focus:outline-none focus:ring-2 focus:ring-[#5D9C59]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {content.register.loading.registering}
            </span>
          ) : content.register.step2.completeButton}
        </Button>
      </div>
    </div>
  );
};

export default FormStep2;