import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PublicProfileHeader from "./../../components/publicProfile/PublicProfileHeader.jsx";
import TabNavigation from "./../../components/publicProfile/TabNavigation.jsx";
import BooksGrid from "./../../components/profile/BooksGrid.jsx";
import { userService } from "../../services/user/userService.js";
import { bookService } from "../../services/books/bookServices.js";
import TransactionFilter from "../../components/profile/Filter.jsx";

const PublicProfile = () => {
  const [activeTab, setActiveTab] = useState("user-books");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const [filterType, setFilterType] = useState("");
  const { userId } = useParams();
  const navigate = useNavigate();

  const { content } = useSelector((state) => state.lang);

  // Fetch user data
  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getPublicProfile(userId);
        setUser(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchPublicProfile();
  }, [userId]);

  // Fetch user books
  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const response = await bookService.getUserBooks(userId);
        setBooks(response.books || []);
      } catch {
        setBooks([]);
      }
    };

    if (userId) fetchUserBooks();
  }, [userId]);

  // Filter handler
  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  // Apply filter
  const filteredBooks =
    filterType === ""
      ? books
      : books.filter((book) => book.TransactionType === filterType);

  const renderTabContent = () => {
    switch (activeTab) {
      case "user-books":
        return (
          <>
            <TransactionFilter
              filterType={filterType}
              onFilterChange={handleFilterChange}
            />
            <BooksGrid books={filteredBooks} />
          </>
        );
      default:
        return <BooksGrid books={filteredBooks} />;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f6f7f7]">
      <main className="px-4 sm:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-screen-xl flex-1 w-full">
          <PublicProfileHeader
            user={user}
            onReportUser={() => navigate(`/reports/user/${userId}`)}
          />
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default PublicProfile;
