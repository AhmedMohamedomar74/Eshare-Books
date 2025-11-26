import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteBook } from "../../redux/slices/bookSlice";

const BookCard = ({ book, onDelete, isOwner, hasPendingOperation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const menuRef = useRef(null);

  const formatTransactionType = (type) => {
    const typeMap = {
      toSale: "For Sale",
      toBorrow: "For Borrow",
      toExchange: "For Exchange",
      toDonate: "For Donation",
    };
    return typeMap[type] || type;
  };

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
    setOpenConfirm(true);
    setOpenMenu(false);
  };

  const confirmDelete = () => {
    dispatch(deleteBook(book._id)).then(() => {
      setOpenConfirm(false);
      if (onDelete) onDelete(book._id);
    });
  };

  const coverUrl = book?.image?.secure_url || book?.image || "/placeholder.png";

  return (
    <>
      <div
        className="flex flex-col gap-3 pb-3 group cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
          {/* Moderation Icon */}
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

          {/* Options Menu — owner only and no pending operation */}
          {isOwner && !hasPendingOperation && (
            <div className="absolute top-2 right-2 z-10" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu((prev) => !prev);
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
                    d="M12 5v.01M12 12v.01M12 19v.01"
                  />
                </svg>
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={handleEditClick}
                    className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Edit Book
                  </button>

                  <button
                    onClick={handleDeleteClick}
                    className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 border-t border-gray-100 hover:bg-red-50 transition-colors"
                  >
                    Delete Book
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Pending Operation Badge */}
          {hasPendingOperation && (
            <div className="absolute top-2 right-2 z-10">
              <div className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full shadow-sm">
                Pending Order
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <img
            className="w-full h-full object-cover"
            alt={`Book cover of ${book.Title}`}
            src={coverUrl}
          />
        </div>

        <div>
          <p className="text-base font-medium truncate">{book.Title}</p>
          <div className="flex justify-between items-center">
            <p className="text-[#6f7b7b] text-sm">
              {formatTransactionType(book.TransactionType)}
            </p>
            {book.TransactionType === "toSale" && book.Price && (
              <p className="text-green-600 text-sm font-medium">
                ${book.Price}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {openConfirm && isOwner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this book?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenConfirm(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;
