import React, { useState, useEffect } from "react";
import ProfileHeader from "./../../components/profile/ProfileHeader.jsx";
import TabNavigation from "./../../components/profile/TabNavigation.jsx";
import BooksGrid from "./../../components/profile/BooksGrid.jsx";
import { userService } from "../../services/user/userService.js";
import { bookService } from "../../services/books/bookServices.js";

const BookShareDashboard = () => {
  const [activeTab, setActiveTab] = useState("my-books");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);

  // Fetch user profile data
  useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userResponse = await userService.getProfile();
      setUser(userResponse.data);

      // Use userResponse.data.id directly instead of user.id
      const booksResponse = await bookService.getUserBooks(userResponse.data.id);
      setBooks(booksResponse.books);
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchUserProfile();
}, []);

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
