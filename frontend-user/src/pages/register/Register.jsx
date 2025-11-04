import React, { useState } from 'react';

const BookShareRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'Reader'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuASROdCfuTXkQJrI2gIsXu_zfPV0ZEToXbOL6sP_7ry4ppfTG-6SdQKt7OipdSA5vu7026RcVp7NrSm9A-8onTcX1SUppPNu6OKnVgVZ6g8Tfl2WTW-jA492MRYfl286wd1fSl16Yb1U51MDPnwwVv30jKojGN8OTprd1DnWTkbetPJVOTFt4ko0ahPBuJ0aZVsHfZmp0NJ7zBHSNuUdxTHVM1cJkeCL-PSbxC5xjB6xWrCJZr3_hLQsFtAFKqUXzLGIvdvxTGMJP9r');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration data:', formData);
    // Add your registration logic here
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 lg:p-8 bg-[#F7F1E5]">
      <div className="container mx-auto grid max-w-6xl grid-cols-1 overflow-hidden rounded-xl bg-white shadow-2xl shadow-black/10 lg:grid-cols-2">
        
        {/* Left Side - Hero Section */}
        <div className="relative hidden h-full items-center justify-center bg-[#5D9C59]/10 p-12 lg:flex">
          <img 
            className="absolute inset-0 h-full w-full object-cover opacity-20" 
            alt="A woman sitting on a floor surrounded by stacks of books, deeply engrossed in reading one." 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDooqQWH4nBEQVvTnToZwrbMLM0DZ6GazKWMPWIcnxq71Vw5ZkigWPxv23qYihieSLfO7pdNkTRgYS95lvkoGfQvXUjkqav1LUY3TY89rXFgPf8UlWzJzQfosmwqNKbwmXtUb9OvPDlMdms1GmSK_ZBpvmKgb2A2qZwO6ZluZcTpmNu-l-f2X3Bzyd6OeowM40CjeybO_hiLz784SbEiyt2qzWwQkQYo5nhooKt_iDb1oiP4elpnoBYUuSJPG-Swaa_YclPkU1_nLPk"
          />
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold text-[#5D9C59]">Join a Community of Book Lovers</h2>
            <p className="mt-4 text-lg text-[#757575]">Share, discover, and connect through the magic of reading.</p>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex flex-col items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-[#333333]">Create Your Account</h1>
            </div>

            <div className="flex flex-col gap-4">
              {/* Full Name */}
              <label className="flex flex-col">
                <p className="text-base font-medium leading-normal pb-2">Full Name</p>
                <input 
                  className="w-full rounded-lg border border-gray-300 bg-white p-3.5 text-base placeholder:text-[#757575] focus:border-[#5D9C59] focus:outline-none focus:ring-1 focus:ring-[#5D9C59]" 
                  placeholder="Enter your full name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </label>

              {/* Email Address */}
              <label className="flex flex-col">
                <p className="text-base font-medium leading-normal pb-2">Email Address</p>
                <input 
                  className="w-full rounded-lg border border-gray-300 bg-white p-3.5 text-base placeholder:text-[#757575] focus:border-[#5D9C59] focus:outline-none focus:ring-1 focus:ring-[#5D9C59]" 
                  placeholder="Enter your email" 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>

              {/* Password */}
              <label className="flex flex-col">
                <p className="text-base font-medium leading-normal pb-2">Password</p>
                <div className="relative flex w-full items-center">
                  <input 
                    className="w-full rounded-lg border border-gray-300 bg-white p-3.5 pr-10 text-base placeholder:text-[#757575] focus:border-[#5D9C59] focus:outline-none focus:ring-1 focus:ring-[#5D9C59]" 
                    placeholder="Enter your password" 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div 
                    className="absolute right-3 flex items-center justify-center text-[#757575] cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
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
              </label>

              {/* Confirm Password */}
              <label className="flex flex-col">
                <p className="text-base font-medium leading-normal pb-2">Confirm Password</p>
                <div className="relative flex w-full items-center">
                  <input 
                    className="w-full rounded-lg border border-gray-300 bg-white p-3.5 pr-10 text-base placeholder:text-[#757575] focus:border-[#5D9C59] focus:outline-none focus:ring-1 focus:ring-[#5D9C59]" 
                    placeholder="Confirm your password" 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <div 
                    className="absolute right-3 flex items-center justify-center text-[#757575] cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      {showConfirmPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      )}
                    </svg>
                  </div>
                </div>
              </label>

              {/* Account Type */}
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

              {/* Profile Picture */}
              <div>
                <p className="text-base font-medium leading-normal pb-2">
                  Profile Picture <span className="text-[#757575]">(Optional)</span>
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    className="h-16 w-16 rounded-full object-cover" 
                    alt="User avatar" 
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
                      name="file-upload" 
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Register Button */}
              <button 
                className="mt-4 w-full rounded-lg bg-[#5D9C59] py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#5D9C59]/90 focus:outline-none focus:ring-2 focus:ring-[#5D9C59]/50 focus:ring-offset-2" 
                onClick={handleSubmit}
              >
                Register
              </button>
            </div>

            {/* Login Link */}
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