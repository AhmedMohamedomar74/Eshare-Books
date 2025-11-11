import React from "react";

const BookCard = ({ book }) => {
  return (
    <div className="flex flex-col gap-3 pb-3 group">
      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
        <img
          className="w-full h-full object-cover"
          alt={`Book cover of ${book.title}`}
          src={book.image.secure_url}
        />
      </div>
      <div>
        <p className="text-base font-medium truncate">{book.Title}</p>
        <p className="text-[#6f7b7b] text-sm">{book.author}</p>
        <p className="text-[#6f7b7b] text-sm">{book.TransactionType}</p>
      </div>
    </div>
  );
};

export default BookCard;