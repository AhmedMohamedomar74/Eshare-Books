import React, { useState } from "react";

const BookShareDashboard = () => {
  const [activeTab, setActiveTab] = useState("my-books");
  const [searchQuery, setSearchQuery] = useState("");

  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      status: "For Sale",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB3o3mfcxDz0hbrI_caVkHqbYTsRl-UhMIbMEVHY6NFScSbP4KVN_BgFsQODu0EX2cteVgx2QBcN5Oxd0EoafcKvrOVAPYLGOJ8R4HonKTzjCS4c89PKMwZbJZRqdJI-__RZPzLdLCENuZhU6qnAi9f5RcZ3bk6WW0HD-ee6aQ_bvvU81haAo4mHgNs6pJC3KhAwgIJPlg8NWxEcbzgZHL55YtNGkq3LgjEFMZacW4YCwH9MfBMmLPE6gyco7PAmUh6Dq2dtepdndk4",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      status: "For Donation",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuALeXyHZMhCQbCjsRUMrupF4s5t_ZJI3s72S0R0HyGeCQTRu7SHucSyOoIwrb-pKiWBkHgympad4GueRbtq8VMPdtCAzq4iMvSSpfoCcPcBLbWEw-7NxeoszEmH09lV3kbC8ArVnRqLTC_q9Edua3tc3NjxJRTGRcwvrOi-csjViMpsCC7Iu4oy3TF562X6aaBrc4GghK9BJUMFbFkY7ljwSVsWOR3qmCUNq24bKaQoBG3zmosOcBIXGANlL1lDYueDY0w1svqhicWe",
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      status: "For Share",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAVYm3SKyr3Qv5rybymoVpcY9kqbwWjtxYvWS5iRQAmKH-LPn0fpA3NhT78axnelRQqxh5c9Mf0JqPFTgKoPJyN2ZrxCqt9VtodVd9waFNAzn315YmnA8dHiIM_-3pWxiuk1Wt9R0fwHDRstD6vaQMX7npYR8n2CYqJI7C74pmPoHf4_fbJHka9VtPeab543Lce8tM_925QSYM2zl9Z08aqMtHuRQ8ubhuJ8rmPfE9mu1vtz498feVmVklby-oiRKLkSI_9mOpQH_u0",
    },
    {
      id: 4,
      title: "Dune",
      author: "Frank Herbert",
      status: "For Sale",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCBVr1WY9OMgvfRNxbKUcfCKpe1qS6-c9SBmK-wzeFRUR8vaESK4OsYKzxx1Wf7IbgNNatSc6lb7_hltGA25EIBMQc0tWva4m0QyblDjB1nRBWJHfHQSMZ1ttwIU1UggNY4eXbQWqqGHnqSPbTlkNnX_pbsLU8SwHBOCU7iusZEnG9zoFZDE-E015bYPaKgXFmgU5VKuC_Yip1TH62KXodH21wXwLKV6_eXSRaTGDnf91c13a7S6aZkpIv8q4O1lgwfLtWf7n49gswS",
    },
    {
      id: 5,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      status: "For Share",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCDgEn6ePHDd9kC3awqKRyCLbktJaTdmeIi3md_pl4vMVpwYNTwheet48RdH45eYcZB_Nj0Sc9txb0EG4X5okFugSoJQz3iYDHP7y0TJgmRWR0bf1Q5ib0E2fpfUtXWm1-cAT6XzVS88-ch76rgqrjd_KuK3BUZuLfvHMP_7uHl5Yn1ohceaXbG6hzfKmsPkWqdPYR_GzJKjDBA45bFWAPR0KBLgD--tA-qBHQhwwBsLvF97svjvXmhbfnehWgnkECQwx3PnKjtbWST",
    },
    {
      id: 6,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      status: "For Donation",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBT1orQd7g30EEnYmyG_bfr_mvGG4OXnW9PyKjGKnYnf8vPU9HnoBvXGbdpbHgqa4atTLIS7X-BPGLqd3sp_0XyLrlvBvh901UneecLMTfYCzZ0y_MMmSyxA_-6YZzAFHkVMKkvOHiH0tcnQRMFp0uw_9WsiP9lafCaKgcpav8qpFACUAspLcs02MVyIUzJn-APUEcX0Dgkrl5Xdv3XeK5dMMT4wjjMyvg1xlaPg2lrWu8XBmmJPbzFz3GjBWliuS5ZXoKeHHsCd1if",
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f6f7f7]">
      {/* Top Navigation Bar */}
      

      {/* Main Content */}
      <main className="px-4 sm:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-screen-xl flex-1 w-full">
          {/* Profile Header */}
          <div className="flex p-4 bg-white rounded-xl shadow-sm border border-[#dfe2e2] mb-6">
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex gap-4">
                <div
                  className="rounded-full min-h-24 w-24 sm:min-h-32 sm:w-32 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBupPSwK2kKVkwS8hx3U6o4BL8QoMbfbwT8oRP0-UJoArwMuAlu5p8DD4Np3wjhj7OlCqZGeOyWAdKWOiOf9ELAlNYPF5e0mvxyxY4eTu6rzT_G5ppYfFQjt4Ex6aSqRoZH-F-qEG3GkMCuiJt_5BCSA5z-loVu_Jzydn2kzkH2BB6MJNIdcJL7xUu8duRGdGrCG97FWa2dS1wD5oOdM0MziTPRN0lADFXUw-0XzbPIZcOx2XjcE2e-mLLoVm4M0UQEnCTEJmHJAqzP")',
                  }}
                />
                <div className="flex flex-col justify-center">
                  <p className="text-xl sm:text-2xl font-bold">Jane Doe</p>
                  <p className="text-[#6f7b7b] text-sm sm:text-base">
                    Lover of classic literature and sci-fi.
                  </p>
                </div>
              </div>
              <button className="h-10 px-4 bg-[#f6f7f7] border border-[#dfe2e2] rounded-lg text-sm font-bold hover:bg-[#4c7b7b]/10 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="pb-3 sticky top-0 bg-[#f6f7f7] z-10">
            <div className="flex border-b border-[#dfe2e2] px-4 gap-8">
              <button
                className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 text-sm font-bold ${
                  activeTab === "my-books"
                    ? "border-b-[#4c7b7b] text-[#4c7b7b]"
                    : "border-b-transparent text-[#6f7b7b] hover:text-[#4c7b7b]"
                }`}
                onClick={() => setActiveTab("my-books")}
              >
                My Books
              </button>
              <button
                className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 text-sm font-bold ${
                  activeTab === "add-new"
                    ? "border-b-[#4c7b7b] text-[#4c7b7b]"
                    : "border-b-transparent text-[#6f7b7b] hover:text-[#4c7b7b]"
                }`}
                onClick={() => setActiveTab("add-new")}
              >
                Add New Book
              </button>
              <button
                className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 text-sm font-bold ${
                  activeTab === "wishlist"
                    ? "border-b-[#4c7b7b] text-[#4c7b7b]"
                    : "border-b-transparent text-[#6f7b7b] hover:text-[#4c7b7b]"
                }`}
                onClick={() => setActiveTab("wishlist")}
              >
                My Wishlist
              </button>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 p-4">
            {books.map((book) => (
              <div key={book.id} className="flex flex-col gap-3 pb-3 group">
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                  <img
                    className="w-full h-full object-cover"
                    alt={`Book cover of ${book.title}`}
                    src={book.image}
                  />
                </div>
                <div>
                  <p className="text-base font-medium truncate">{book.title}</p>
                  <p className="text-[#6f7b7b] text-sm">{book.author}</p>
                  <p className="text-[#6f7b7b] text-sm">{book.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-6 px-5 py-10 text-center mt-10 border-t border-[#dfe2e2] bg-white">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a
            className="text-[#6f7b7b] text-base min-w-40 hover:text-[#4c7b7b] transition-colors"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-[#6f7b7b] text-base min-w-40 hover:text-[#4c7b7b] transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-[#6f7b7b] text-base min-w-40 hover:text-[#4c7b7b] transition-colors"
            href="#"
          >
            Contact Us
          </a>
          <a
            className="text-[#6f7b7b] text-base min-w-40 hover:text-[#4c7b7b] transition-colors"
            href="#"
          >
            FAQ
          </a>
        </div>

        <div className="flex justify-center gap-4">
          <a
            href="#"
            className="text-[#6f7b7b] hover:text-[#4c7b7b] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-[#6f7b7b] hover:text-[#4c7b7b] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a
            href="#"
            className="text-[#6f7b7b] hover:text-[#4c7b7b] transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.795 2.013 10.148 2 12.315 2zm0 1.802c-2.425 0-2.758.009-3.807.058-.976.045-1.505.207-1.858.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.05 1.055-.058 1.37-.058 4.041s.008 2.987.058 4.042c.044.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058s2.987-.01 4.041-.058c.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041s-.01-2.986-.058-4.04c-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
            </svg>
          </a>
        </div>

        <p className="text-[#6f7b7b] text-base">
          © 2024 BookShare. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default BookShareDashboard;
