import React from "react";
import { useSelector } from "react-redux";
import BookCard from "./BookCard";

const BooksGrid = ({
  books,
  onDelete,
  userId,
  isOwner,
  booksWithPendingOps,
  showOperationDetails = false, // New prop to show operation details
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
        // Handle both book structures (direct book or book with operations)
        const bookId = book._id || book.book?._id;
        const hasPendingOperation = booksWithPendingOps?.has(bookId?.toString());

        return (
          <BookCard
            key={bookId}
            book={book}
            isOwner={isOwner}
            hasPendingOperation={hasPendingOperation}
            onDelete={onDelete}
            showOperationDetails={showOperationDetails}
          />
        );
      })}
    </div>
  );
};

export default BooksGrid;