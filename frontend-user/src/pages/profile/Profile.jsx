import React, { useState, useEffect } from "react";
import ProfileHeader from "./../../components/profile/ProfileHeader.jsx";
import TabNavigation from "./../../components/profile/TabNavigation.jsx";
import BooksGrid from "./../../components/profile/BooksGrid.jsx";
import AddBookForm from "./../../components/profile/AddBookForm.jsx";
import Wishlist from "./../../components/profile/Wishlist.jsx";
import { userService } from "../../services/user/userService.js";
import { bookService } from "../../services/books/bookServices.js";

const BookShareDashboard = () => {
  const [activeTab, setActiveTab] = useState("my-books");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books , setBooks] = useState([]);
  // Sample books data (you might want to fetch this separately)
  // const books = [
  //   {
  //     id: 1,
  //     title: "The Great Gatsby",
  //     author: "F. Scott Fitzgerald",
  //     status: "For Sale",
  //     image:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuB3o3mfcxDz0hbrI_caVkHqbYTsRl-UhMIbMEVHY6NFScSbP4KVN_BgFsQODu0EX2cteVgx2QBcN5Oxd0EoafcKvrOVAPYLGOJ8R4HonKTzjCS4c89PKMwZbJZRqdJI-__RZPzLdLCENuZhU6qnAi9f5RcZ3bk6WW0HD-ee6aQ_bvvU81haAo4mHgNs6pJC3KhAwgIJPlg8NWxEcbzgZHL55YtNGkq3LgjEFMZacW4YCwH9MfBMmLPE6gyco7PAmUh6Dq2dtepdndk4",
  //   },
  //   {
  //     id: 2,
  //     title: "To Kill a Mockingbird",
  //     author: "Harper Lee",
  //     status: "For Donation",
  //     image:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuALeXyHZMhCQbCjsRUMrupF4s5t_ZJI3s72S0R0HyGeCQTRu7SHucSyOoIwrb-pKiWBkHgympad4GueRbtq8VMPdtCAzq4iMvSSpfoCcPcBLbWEw-7NxeoszEmH09lV3kbC8ArVnRqLTC_q9Edua3tc3NjxJRTGRcwvrOi-csjViMpsCC7Iu4oy3TF562X6aaBrc4GghK9BJUMFbFkY7ljwSVsWOR3qmCUNq24bKaQoBG3zmosOcBIXGANlL1lDYueDY0w1svqhicWe",
  //   },
  //   {
  //     id: 3,
  //     title: "1984",
  //     author: "George Orwell",
  //     status: "For Share",
  //     image:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuAVYm3SKyr3Qv5rybymoVpcY9kqbWjtxYvWS5iRQAmKH-LPn0fpA3NhT78axnelRQqxh5c9Mf0JqPFTgKoPJyN2ZrxCqt9VtodVd9waFNAzn315YmnA8dHiIM_-3pWxiuk1Wt9R0fwHDRstD6vaQMX7npYR8n2CYqJI7C74pmPoHf4_fbJHka9VtPeab543Lce8tM_925QSYM2zl9Z08aqMtHuRQ8ubhuJ8rmPfE9mu1vtz498feVmVklby-oiRKLkSI_9mOpQH_u0",
  //   },
  //   {
  //     id: 4,
  //     title: "Dune",
  //     author: "Frank Herbert",
  //     status: "For Sale",
  //     image:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuCBVr1WY9OMgvfRNxbKUcfCKpe1qS6-c9SBmK-wzeFRUR8vaESK4OsYKzxx1Wf7IbgNNatSc6lb7_hltGA25EIBMQc0tWva4m0QyblDjB1nRBWJHfHQSMZ1ttwIU1UggNY4eXbQWqqGHnqSPbTlkNnX_pbsLU8SwHBOCU7iusZEnG9zoFZDE-E015bYPaKgXFmgU5VKuC_Yip1TH62KXodH21wXwLKV6_eXSRaTGDnf91c13a7S6aZkpIv8q4O1lgwfLtWf7n49gswS",
  //   },
  //   {
  //     id: 5,
  //     title: "Pride and Prejudice",
  //     author: "Jane Austen",
  //     status: "For Share",
  //     image:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuCDgEn6ePHDd9kC3awqKRyCLbktJaTdmeIi3md_pl4vMVpwYNTwheet48RdH45eYcZB_Nj0Sc9txb0EG4X5okFugSoJQz3iYDHP7y0TJgmRWR0bf1Q5ib0E2fpfUtXWm1-cAT6XzVS88-ch76rgqrjd_KuK3BUZuLfvHMP_7uHl5Yn1ohceaXbG6hzfKmsPkWqdPYR_GzJKjDBA45bFWAPR0KBLgD--tA-qBHQhwwBsLvF97svjvXmhbfnehWgnkECQwx3PnKjtbWST",
  //   },
  //   {
  //     id: 6,
  //     title: "The Hobbit",
  //     author: "J.R.R. Tolkien",
  //     status: "For Donation",
  //     image:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuBT1orQd7g30EEnYmyG_bfr_mvGG4OXnW9PyKjGKnYnf8vPU9HnoBvXGbdpbHgqa4atTLIS7X-BPGLqd3sp_0XyLrlvBvh901UneecLMTfYCzZ0y_MMmSyxA_-6YZzAFHkVMKkvOHiH0tcnQRMFp0uw_9WsiP9lafCaKgcpav8qpFACUAspLcs02MVyIUzJn-APUEcX0Dgkrl5Xdv3XeK5dMMT4wjjMyvg1xlaPg2lrWu8XBmmJPbzFz3GjBWliuS5ZXoKeHHsCd1if",
  //   },
  // ];

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        setUser(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(()=>
  {
    const fetchBooks = async () => {
      try {
        const response = await bookService.getBooks();
        setBooks(response.books);
        console.log(response.books);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  },[])

  // Handle profile update
  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await userService.updateProfile(updatedData);
      setUser(response.data);
      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (file) => {
    try {
      const response = await userService.uploadProfilePicture(file);
      setUser(response.data);
      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "my-books":
        return <BooksGrid books={books} />;
      case "add-new":
        return <AddBookForm />;
      case "wishlist":
        return <Wishlist />;
      default:
        return <BooksGrid books={books} />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-[#f6f7f7]">
        <main className="px-4 sm:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-screen-xl flex-1 w-full items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4c7b7b]"></div>
            <p className="mt-4 text-[#6f7b7b]">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-[#f6f7f7]">
        <main className="px-4 sm:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-screen-xl flex-1 w-full items-center justify-center">
            <div className="text-red-500 text-center">
              <p className="text-lg font-semibold">Error loading profile</p>
              <p className="text-sm mt-2">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-[#4c7b7b] text-white rounded-lg hover:bg-[#3a5f5f] transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f6f7f7]">
      {/* Main Content */}
      <main className="px-4 sm:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-screen-xl flex-1 w-full">
          <ProfileHeader 
            user={user} 
            onUpdateProfile={handleUpdateProfile}
            onProfilePictureUpload={handleProfilePictureUpload}
          />
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default BookShareDashboard;