import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProfileHeader from "./../../components/profile/ProfileHeader.jsx";
import TabNavigation from "./../../components/profile/TabNavigation.jsx";
import BooksGrid from "./../../components/profile/BooksGrid.jsx";

import { userService } from "../../services/user/userService.js";
import { bookService } from "../../services/books/bookServices.js";
import { operationService } from "../../services/operations/operationService.js";
import TransactionFilter from "../../components/profile/Filter.jsx";
import EmptyBooksMessage from "../../components/profile/EmptyBook.jsx";

const BookShareDashboard = () => {
  const [activeTab, setActiveTab] = useState("my-books");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const [booksWithPendingOps, setBooksWithPendingOps] = useState(new Set());
  const [transactionFilter, setTransactionFilter] = useState("");
  const [operations, setOperations] = useState([]);
  
  // ✅ NEW: States for history books
  const [booksAsSource, setBooksAsSource] = useState([]);
  const [booksAsDest, setBooksAsDest] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Get translations from Redux
  const { content } = useSelector((state) => state.lang);

  // Fetch user profile, books, and operations
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        // Fetch user data
        const userResponse = await userService.getProfile();
        setUser(userResponse.data);

        // Fetch user books
        const booksResponse = await bookService.getUserBooks(
          userResponse.data.id
        );
        const visibleBooks = booksResponse.books.filter(
          (book) => !book.isDeleted
        );
        setBooks(visibleBooks);

        // Fetch user operations
        try {
          const operationsResponse = await operationService.getUserOperations();
          const ops = operationsResponse.data || operationsResponse;
          setOperations(ops);

          // Find books with pending operations
          const pendingBookIds = new Set();
          ops.forEach((op) => {
            if (op.status === "pending" && op.book_dest_id) {
              const bookId = op.book_dest_id._id || op.book_dest_id;
              pendingBookIds.add(bookId.toString());
            }
          });

          setBooksWithPendingOps(pendingBookIds);
        } catch (opError) {
          console.error("Error fetching operations:", opError);
        }

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

  // ✅ NEW: Fetch history books when tabs change
  useEffect(() => {
    const fetchHistoryBooks = async () => {
      if (activeTab === "requested-books" && booksAsSource.length === 0) {
        setLoadingHistory(true);
        try {
          const response = await operationService.getMyBooksAsSource();
          setBooksAsSource(response.data || []);
        } catch (err) {
          console.error("Error fetching books as source:", err);
        } finally {
          setLoadingHistory(false);
        }
      } else if (activeTab === "received-requests" && booksAsDest.length === 0) {
        setLoadingHistory(true);
        try {
          const response = await operationService.getMyBooksAsDest();
          setBooksAsDest(response.data || []);
        } catch (err) {
          console.error("Error fetching books as dest:", err);
        } finally {
          setLoadingHistory(false);
        }
      }
    };

    fetchHistoryBooks();
  }, [activeTab, booksAsSource.length, booksAsDest.length]);

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

  const filteredBooks = books.filter((book) => {
    if (!transactionFilter) return true;
    return book.TransactionType === transactionFilter;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "my-books":
        return (
          <>
            <TransactionFilter
              filterType={transactionFilter}
              onFilterChange={setTransactionFilter}
            />
            {filteredBooks.length === 0 ? (
              <EmptyBooksMessage />
            ) : (
              <BooksGrid
                books={filteredBooks}
                isOwner={true}
                userId={user?.id}
                booksWithPendingOps={booksWithPendingOps}
                onDelete={(deletedBookId) =>
                  setBooks((prevBooks) =>
                    prevBooks.filter((b) => b._id !== deletedBookId)
                  )
                }
              />
            )}
          </>
        );

      // ✅ NEW: Books I requested/offered
      case "requested-books":
        if (loadingHistory) {
          return (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4c7b7b]"></div>
            </div>
          );
        }
        return (
          <>
            {booksAsSource.length === 0 ? (
              <div className="flex justify-center items-center p-8">
                <p className="text-gray-500 text-lg">
                  {content.noRequestedBooks || "No books requested yet"}
                </p>
              </div>
            ) : (
              <BooksGrid
                books={booksAsSource}
                isOwner={false}
                userId={user?.id}
                onDelete={() => {}}
              />
            )}
          </>
        );

      // ✅ NEW: Books where others requested from me
      case "received-requests":
        if (loadingHistory) {
          return (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4c7b7b]"></div>
            </div>
          );
        }
        return (
          <>
            {booksAsDest.length === 0 ? (
              <div className="flex justify-center items-center p-8">
                <p className="text-gray-500 text-lg">
                  {content.noReceivedRequests || "No received requests yet"}
                </p>
              </div>
            ) : (
              <BooksGrid
                books={booksAsDest}
                isOwner={false}
                userId={user?.id}
                onDelete={() => {}}
              />
            )}
          </>
        );

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
            <p className="mt-4 text-[#6f7b7b]">{content.loadingProfile}</p>
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
              <p className="text-lg font-semibold">
                {content.errorLoadingProfile}
              </p>
              <p className="text-sm mt-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-[#4c7b7b] text-white rounded-lg hover:bg-[#3a5f5f] transition-colors"
              >
                {content.retry}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f6f7f7]">
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