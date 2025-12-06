import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteBook } from "../../redux/slices/bookSlice";

const BookCard = ({ book, onDelete, isOwner, hasPendingOperation, showOperationDetails = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const handleCardClick = () => {
    if (showOperationDetails && book.operations?.length > 0) {
      setShowDetails(!showDetails);
    } else {
      navigate(`/details/${book._id || book.book?._id}`);
    }
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
      onDelete?.(book._id);
    });
  };

  // Handle both book structure formats
  const bookData = book.book || book;
  const coverUrl = bookData?.image?.secure_url || bookData?.image || "/placeholder.png";
  const transaction = formatTransactionType(bookData.TransactionType);

  return (
    <>
      <div className="flex flex-col w-[260px] gap-3 pb-3 group">
        {/* Book Image */}
        <div 
          className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
          onClick={handleCardClick}
        >
          {/* Moderation Icon */}
          <div className="absolute top-2 left-2 p-1.5 bg-white/80 rounded-full z-10">
            {bookData.IsModerated ? (
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>

          {/* Options Menu */}
          {isOwner && !hasPendingOperation && !showOperationDetails && (
            <div className="absolute top-2 right-2 z-10" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu((prev) => !prev);
                }}
                className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
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

          {/* Operation Count Badge */}
          {showOperationDetails && book.operations?.length > 0 && (
            <div className="absolute bottom-2 right-2 z-10">
              <div className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full shadow">
                {book.operations.length} {book.operations.length === 1 ? 'Operation' : 'Operations'}
              </div>
            </div>
          )}

          <img
            className="w-full h-full object-cover"
            alt={`${content.bookCoverOf} ${bookData.Title}`}
            src={coverUrl}
          />
        </div>

        {/* Card Content */}
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold truncate">{bookData.Title}</p>

          {/* Operation Type */}
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${transaction.color}`}>
            {transaction.label}
          </span>

          {/* Price Display */}
          {bookData.TransactionType === "toSale" && bookData.Price && (
            <p className="text-green-600 text-sm font-medium">
              {bookData.Price} {content.egp || "EGP"}
            </p>
          )}

          {bookData.TransactionType === "toBorrow" && bookData.PricePerDay && (
            <p className="text-blue-600 text-sm font-medium">
              {bookData.PricePerDay} {content.egpPerDay || "EGP / day"}
            </p>
          )}

          {/* Show summary for history books */}
          {showOperationDetails && book.totalRevenue !== undefined && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700">
                Total Revenue: <span className="text-green-600">{book.totalRevenue} EGP</span>
              </p>
            </div>
          )}

          {showOperationDetails && book.totalSpent !== undefined && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700">
                Total Spent: <span className="text-blue-600">{book.totalSpent} EGP</span>
              </p>
            </div>
          )}

          {/* Show Details Button */}
          {showOperationDetails && book.operations?.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              className="mt-2 text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              {showDetails ? '▼' : '▶'} {showDetails ? 'Hide' : 'Show'} Details
            </button>
          )}
        </div>

        {/* Operation Details Expandable Section */}
        {showDetails && showOperationDetails && book.operations?.length > 0 && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
            {book.operations.map((operation, index) => (
              <div key={operation._id || index} className="pb-3 border-b border-gray-300 last:border-0 last:pb-0">
                {/* Operation Type Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    operation.operationType === 'buy' ? 'bg-green-100 text-green-700' :
                    operation.operationType === 'borrow' ? 'bg-blue-100 text-blue-700' :
                    operation.operationType === 'donate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {operation.operationType.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(operation.transactionDate)}
                  </span>
                </div>

                {/* Recipient/Provider Info */}
                {operation.recipient && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 font-medium">To:</p>
                    <p className="text-sm font-semibold text-gray-800">{operation.recipient.name}</p>
                    <p className="text-xs text-gray-500">{operation.recipient.email}</p>
                  </div>
                )}

                {operation.provider && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 font-medium">From:</p>
                    <p className="text-sm font-semibold text-gray-800">{operation.provider.name}</p>
                    <p className="text-xs text-gray-500">{operation.provider.email}</p>
                  </div>
                )}

                {/* Sale Details */}
                {operation.saleDetails && (
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-xs font-semibold text-green-700">
                      Sale Price: {operation.saleDetails.salePrice || operation.totalPrice} EGP
                    </p>
                    <p className="text-xs text-gray-600">Sold to: {operation.saleDetails.soldTo}</p>
                    {operation.saleDetails.soldAt && (
                      <p className="text-xs text-gray-500">Date: {formatDate(operation.saleDetails.soldAt)}</p>
                    )}
                  </div>
                )}

                {/* Purchase Details */}
                {operation.purchaseDetails && (
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-xs font-semibold text-blue-700">
                      Purchase Price: {operation.purchaseDetails.purchasePrice || operation.totalPrice} EGP
                    </p>
                    <p className="text-xs text-gray-600">Bought from: {operation.purchaseDetails.boughtFrom}</p>
                    {operation.purchaseDetails.purchasedAt && (
                      <p className="text-xs text-gray-500">Date: {formatDate(operation.purchaseDetails.purchasedAt)}</p>
                    )}
                  </div>
                )}

                {/* Borrow Details */}
                {operation.borrowDetails && (
                  <div className="bg-blue-50 p-2 rounded space-y-1">
                    <p className="text-xs font-semibold text-blue-700">
                      Total: {operation.borrowDetails.totalPrice || operation.totalPrice} EGP
                    </p>
                    {operation.borrowDetails.numberOfDays > 0 && operation.borrowDetails.pricePerDay > 0 && (
                      <p className="text-xs text-gray-600">
                        {operation.borrowDetails.numberOfDays} days @ {operation.borrowDetails.pricePerDay} EGP/day
                      </p>
                    )}
                    {operation.borrowDetails.startDate && (
                      <p className="text-xs text-gray-600">
                        From: {formatDate(operation.borrowDetails.startDate)}
                      </p>
                    )}
                    {operation.borrowDetails.endDate && (
                      <p className="text-xs text-gray-600">
                        To: {formatDate(operation.borrowDetails.endDate)}
                      </p>
                    )}
                    {operation.borrowDetails.borrowedFrom && (
                      <p className="text-xs text-gray-500">Borrowed from: {operation.borrowDetails.borrowedFrom}</p>
                    )}
                    {operation.borrowDetails.borrowedBy && (
                      <p className="text-xs text-gray-500">Borrowed by: {operation.borrowDetails.borrowedBy}</p>
                    )}
                  </div>
                )}

                {/* Donation Details */}
                {operation.donationDetails && (
                  <div className="bg-yellow-50 p-2 rounded">
                    {operation.donationDetails.donatedBy && (
                      <p className="text-xs text-gray-600">Donated by: {operation.donationDetails.donatedBy}</p>
                    )}
                    {operation.donationDetails.donatedTo && (
                      <p className="text-xs text-gray-600">Donated to: {operation.donationDetails.donatedTo}</p>
                    )}
                    {operation.donationDetails.donatedAt && (
                      <p className="text-xs text-gray-500">Date: {formatDate(operation.donationDetails.donatedAt)}</p>
                    )}
                  </div>
                )}

                {/* Exchange Details */}
                {operation.exchangeDetails && (
                  <div className="bg-purple-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Exchanged with: {operation.exchangeDetails.exchangedWith}</p>
                    {operation.exchangeDetails.exchangedAt && (
                      <p className="text-xs text-gray-500">Date: {formatDate(operation.exchangeDetails.exchangedAt)}</p>
                    )}
                  </div>
                )}

                {/* Payment Status */}
                <div className="mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    operation.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                    operation.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    operation.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    Payment: {operation.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {openConfirm && isOwner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">{content.confirmDelete}</h2>
            <p className="text-sm text-gray-600 mb-6">{content.deleteBookConfirmation}</p>
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