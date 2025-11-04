import React, { useState } from 'react';

const BookCycleLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempted with:', { email, password, rememberMe });
    // Add your login logic here
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center"
         style={{
           backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSnKGyhHabigIj3zM4Gsl5Q8T3CFWtFp6iXVFoLToGLJXwlQHZJaF38UENNwiorq_GmyDsjx_JNqWda2SsuCqueIfrgcmNNbY6luq19hbJwAQe9CcyRCO-Eg5Q3NbM7Jc1BHNSYraFvE8WBM-ARVTG5zUTBtIEsjARkElBUUKbn2mEV5aF9NRVtxLXECFFVDJPl5g9dYJByG-1SX7xvqybcczpgYo0IF6Cw_ljlDdz_XPaCOxl4O-dfK8w2hR8s0SXhH49MrOvZkJ')",
           backgroundColor: '#f6f7f7'
         }}>
      <div className="w-full max-w-md p-6 sm:p-8">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm p-8 sm:p-10 shadow-2xl">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">BookCycle</h1>
            <p className="mt-2 text-base text-gray-600">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-y-5">
              
              <label className="flex flex-col w-full">
                <p className="text-gray-900 text-sm font-medium leading-normal pb-2">Email Address</p>
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 focus:outline-0 focus:ring-2 focus:ring-teal-700/50 border border-gray-300 bg-white focus:border-teal-700 h-12 placeholder:text-gray-500 p-3 text-base font-normal leading-normal"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="flex flex-col w-full">
                <p className="text-gray-900 text-sm font-medium leading-normal pb-2">Password</p>
                <div className="flex w-full flex-1 items-stretch">
                  <input
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-r-none border-r-0 text-gray-900 focus:outline-0 focus:ring-2 focus:ring-teal-700/50 border border-gray-300 bg-white focus:border-teal-700 h-12 placeholder:text-gray-500 p-3 pr-2 text-base font-normal leading-normal"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div 
                    className="text-gray-500 flex border border-gray-300 bg-white items-center justify-center pr-3 rounded-r-lg border-l-0 cursor-pointer"
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
            </div>

            <div className="mt-5 flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-teal-700 focus:ring-teal-700/50"
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="text-gray-900 text-sm font-normal leading-normal flex-1 truncate" htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <div className="shrink-0">
                <a className="text-sm font-medium text-teal-700 hover:underline" href="#">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="mt-6 w-full">
              <button
                type="submit"
                className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-teal-700 text-white text-base font-bold leading-normal tracking-wide hover:bg-teal-800 transition-colors duration-200"
              >
                <span className="truncate">Login</span>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account? <a className="font-bold text-teal-700 hover:underline" href="#">Create one</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookCycleLogin;