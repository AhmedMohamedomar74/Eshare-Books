const StepIndicator = ({ step, totalSteps = 2 }) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-[#333333]">Create Your Account</h1>
      <div className="mt-4 flex items-center justify-center gap-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div 
            key={index}
            className={`h-2 w-16 rounded-full ${
              step === index + 1 ? 'bg-[#5D9C59]' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-[#757575]">Step {step} of {totalSteps}</p>
    </div>
  );
};

export default StepIndicator;