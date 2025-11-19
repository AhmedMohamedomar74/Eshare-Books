import React from "react";
import { useNavigate } from "react-router-dom";

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  // Format transaction type for display
  const formatTransactionType = (type) => {
    const typeMap = {
      toSale: "For Sale",
      toBorrow: "For Borrow", 
      toExchange: "For Exchange",
      toDonate: "For Donation"
    };
    return typeMap[type] || type;
  };

  const handleCardClick = () => {
    navigate(`/details/${book._id}`);
  };

  return (
    <div 
      className="flex flex-col gap-3 pb-3 group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        {/* Moderation Status Icon */}
        <div className="absolute top-2 left-2 p-1.5 bg-white/80 rounded-full">
          {book.IsModerated ? (
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        {/* Options Button */}
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

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <img
          className="w-full h-full object-cover"
          alt={`Book cover of ${book.Title}`}
          src={book.image.secure_url}
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
            <p className="text-green-600 text-sm font-medium">
              ${book.Price}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;