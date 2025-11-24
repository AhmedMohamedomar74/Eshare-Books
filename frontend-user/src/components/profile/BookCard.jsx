import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BookCard = ({ book, hasPendingOperation }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  // Format transaction type for display
  const formatTransactionType = (type) => {
    const typeMap = {
      toSale: "For Sale",
      toBorrow: "For Borrow",
      toExchange: "For Exchange",
      toDonate: "For Donation",
    };
    return typeMap[type] || type;
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  const handleCardClick = () => {
    navigate(`/details/${book._id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/edit-book/${book._id}`);
    setOpenMenu(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this book?")) {
      // TODO: Implement delete functionality
      console.log("Delete book:", book._id);
    }
    setOpenMenu(false);
  };

  return (
    <div
      className="flex flex-col gap-3 pb-3 group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        {/* Moderation Status Icon */}
        <div className="absolute top-2 left-2 p-1.5 bg-white/80 rounded-full z-10">
          {book.IsModerated ? (
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* Options Button with Menu */}
        {/* ✅ Only show menu if no pending operation */}
        {!hasPendingOperation && (
          <div className="absolute top-2 right-2 z-10" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(!openMenu);
              }}
              className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors duration-200 shadow-sm"
            >
              <svg
                className="w-5 h-5 text-gray-700"
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

            {/* Dropdown Menu */}
            {openMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={handleEditClick}
                  className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Book
                </button>

                <button
                  onClick={handleDeleteClick}
                  className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Book
                </button>
              </div>
            )}
          </div>
        )}

        {/* ✅ Show "Pending Operation" badge */}
        {hasPendingOperation && (
          <div className="absolute top-2 right-2 z-10">
            <div className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full shadow-sm">
              Pending Order
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <img
          className="w-full h-full object-cover"
          alt={`Book cover of ${book.Title}`}
          src={book.image?.secure_url}
        />
      </div>

      <div>
        <p className="text-base font-medium truncate">{book.Title}</p>
        <p className="text-[#6f7b7b] text-sm">
          {/* {book.UserID?.fullName || "Unknown Author"} */}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-[#6f7b7b] text-sm">
            {formatTransactionType(book.TransactionType)}
          </p>
          {book.TransactionType === "toSale" && book.Price && (
            <p className="text-green-600 text-sm font-medium">${book.Price}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
