import React from "react";
import { useSelector } from "react-redux";
import BookCard from "./BookCard";

const BooksGrid = ({
  books,
  onDelete,
  userId,
  isOwner,
  booksWithPendingOps,
}) => {
  // Get translations from Redux
  const { content } = useSelector((state) => state.lang);

  if (!books || books.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500 text-lg">{content.noBooksFound}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,260px)] gap-6 p-4 justify-center">
      {books.map((book) => {
        const hasPendingOperation = booksWithPendingOps?.has(
          book._id.toString()
        );

        return (
          <BookCard
            key={book._id}
            book={book}
            isOwner={isOwner}
            hasPendingOperation={hasPendingOperation}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};

export default BooksGrid;
