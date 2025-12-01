import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteBook } from "../../redux/slices/bookSlice";

const BookCard = ({ book, onDelete, isOwner, hasPendingOperation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const menuRef = useRef(null);

  const { content } = useSelector((state) => state.lang);

  const formatTransactionType = (type) => {
    const typeMap = {
      toSale: { label: content.forSale, color: "bg-green-100 text-green-700" },
      toBorrow: { label: content.toBorrow, color: "bg-blue-100 text-blue-700" },
      toExchange: {
        label: content.availableToExchange,
        color: "bg-purple-100 text-purple-700",
      },
      toDonate: {
        label: content.toDonate,
        color: "bg-yellow-100 text-yellow-700",
      },
    };
    return typeMap[type] || { label: type, color: "bg-gray-100 text-gray-700" };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };
    if (openMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  const handleCardClick = () => navigate(`/details/${book._id}`);
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
      onDelete?.(book._id);
    });
  };

  const coverUrl = book?.image?.secure_url || book?.image || "/placeholder.png";
  const transaction = formatTransactionType(book.TransactionType);

  return (
    <>
      <div
        className="flex flex-col w-[260px] gap-3 pb-3 group cursor-pointer"
        onClick={handleCardClick}
      >
        {/* book image */}
        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow hover:shadow-lg transition">
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

          {/* Options Menu */}
          {isOwner && !hasPendingOperation && (
            <div className="absolute top-2 right-2 z-10" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu((prev) => !prev);
                }}
                className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition"
              >
                {/* 3 dots icon */}
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={handleEditClick}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {content.editBook}
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 border-t border-gray-100 hover:bg-red-50"
                  >
                    {content.deleteBook}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Pending Badge */}
          {hasPendingOperation && (
            <div className="absolute top-2 right-2 z-10">
              <div className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full shadow">
                {content.pendingOrder}
              </div>
            </div>
          )}

          <img
            className="w-full h-full object-cover"
            alt={`${content.bookCoverOf} ${book.Title}`}
            src={coverUrl}
          />
        </div>

        {/* card content */}
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold truncate">{book.Title}</p>

          {/* operation type*/}
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${transaction.color}`}
          >
            {transaction.label}
          </span>

          {/* price */}
          {book.TransactionType === "toSale" && book.Price && (
            <p className="text-green-600 text-sm font-medium">
              {book.Price} {content.egp || "EGP"}
            </p>
          )}

          {book.TransactionType === "toBorrow" && book.PricePerDay && (
            <p className="text-blue-600 text-sm font-medium">
              {book.PricePerDay} {content.egpPerDay || "EGP / day"}
            </p>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {openConfirm && isOwner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">
              {content.confirmDelete}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {content.deleteBookConfirmation}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenConfirm(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                {content.cancel}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                {content.deleteBook}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;
