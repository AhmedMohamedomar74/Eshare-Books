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
  
  // States for history books
  const [booksAsSource, setBooksAsSource] = useState([]);
  const [booksAsDest, setBooksAsDest] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sourceSummary, setSourceSummary] = useState(null);
  const [destSummary, setDestSummary] = useState(null);

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

  // Fetch history books when tabs change
  useEffect(() => {
    const fetchHistoryBooks = async () => {
      // "Books I Requested" = I am DESTINATION (receiving books)
      if (activeTab === "requested-books" && booksAsDest.length === 0) {
        setLoadingHistory(true);
        try {
          const response = await operationService.getMyBooksAsDest();
          // Handle the new response structure with books and summary
          setBooksAsDest(response.data?.books || response.data || []);
          setDestSummary(response.data?.summary || null);
        } catch (err) {
          console.error("Error fetching books as dest:", err);
        } finally {
          setLoadingHistory(false);
        }
      } 
      // "Requests to My Books" = I am SOURCE (others requesting my books)
      else if (activeTab === "received-requests" && booksAsSource.length === 0) {
        setLoadingHistory(true);
        try {
          const response = await operationService.getMyBooksAsSource();
          // Handle the new response structure with books and summary
          setBooksAsSource(response.data?.books || response.data || []);
          setSourceSummary(response.data?.summary || null);
        } catch (err) {
          console.error("Error fetching books as source:", err);
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
                showOperationDetails={false}
                onDelete={(deletedBookId) =>
                  setBooks((prevBooks) =>
                    prevBooks.filter((b) => b._id !== deletedBookId)
                  )
                }
              />
            )}
          </>
        );

      // Books I requested (I am DESTINATION - receiving books from others)
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
            {/* Summary Statistics */}
            {destSummary && (
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {content.summary || "Summary"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{content.totalBooks || "Total Books"}</p>
                    <p className="text-2xl font-bold text-blue-600">{destSummary.totalBooks}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{content.totalOperations || "Total Operations"}</p>
                    <p className="text-2xl font-bold text-green-600">{destSummary.totalOperations}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{content.totalSpent || "Total Revnue"}</p>
                    <p className="text-2xl font-bold text-orange-600">{destSummary.totalSpent} EGP</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{content.operations || "Operations"}</p>
                    <div className="mt-1 space-y-1">
                      {destSummary.byOperationType && (
                        <>
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Bought:</span> {destSummary.byOperationType.purchased}
                          </p>
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Borrowed:</span> {destSummary.byOperationType.borrowed}
                          </p>
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Donated:</span> {destSummary.byOperationType.donated}
                          </p>
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Exchanged:</span> {destSummary.byOperationType.exchanged}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {booksAsDest.length === 0 ? (
              <div className="flex justify-center items-center p-8">
                <p className="text-gray-500 text-lg">
                  {content.noRequestedBooks || "No books requested yet"}
                </p>
              </div>
            ) : (
              <BooksGrid
                books={booksAsDest}
                isOwner={false}
                userId={user?.id}
                showOperationDetails={true}
                onDelete={() => {}}
              />
            )}
          </>
        );

      // Requests to My Books (I am SOURCE - others requesting my books)
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
            {/* Summary Statistics */}
            {sourceSummary && (
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {content.summary || "Summary"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{content.totalBooks || "Total Books"}</p>
                    <p className="text-2xl font-bold text-blue-600">{sourceSummary.totalBooks}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{content.totalOperations || "Total Operations"}</p>
                    <p className="text-2xl font-bold text-green-600">{sourceSummary.totalOperations}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{content.totalRevenue || "Total Spent"}</p>
                    <p className="text-2xl font-bold text-purple-600">{sourceSummary.totalRevenue} EGP</p>
                  </div>
                </div>
              </div>
            )}

            {booksAsSource.length === 0 ? (
              <div className="flex justify-center items-center p-8">
                <p className="text-gray-500 text-lg">
                  {content.noReceivedRequests || "No received requests yet"}
                </p>
              </div>
            ) : (
              <BooksGrid
                books={booksAsSource}
                isOwner={false}
                userId={user?.id}
                showOperationDetails={true}
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