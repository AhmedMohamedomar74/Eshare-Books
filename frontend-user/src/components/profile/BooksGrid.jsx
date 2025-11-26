import React from "react";
import BookCard from "./BookCard";

const BooksGrid = ({
  books,
  onDelete,
  userId,
  isOwner,
  booksWithPendingOps,
}) => {
  if (!books || books.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500 text-lg">No books found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 p-4">
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
