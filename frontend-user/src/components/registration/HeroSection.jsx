const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;