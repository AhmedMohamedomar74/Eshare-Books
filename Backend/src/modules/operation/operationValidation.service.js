import { AppError } from "../../utils/AppError.js";
import {
  checkActiveBookOperation,
  checkExistingOperation,
} from "../../utils/dbHelpers.js";

export const validateBookTransactionType = ({
  operationType,
  srcBook,
  destBook,
}) => {
  switch (operationType) {
    case "buy":
      if (srcBook.TransactionType !== "toSale") {
        throw new AppError("This book is not available for sale", 400);
      }
      break;

    case "borrow":
      if (srcBook.TransactionType !== "toBorrow") {
        throw new AppError("This book is not available for borrowing", 400);
      }
      break;

    case "donate":
      if (srcBook.TransactionType !== "toDonate") {
        throw new AppError("This book is not available for donation.", 400);
      }
      break;

    case "exchange":
      if (srcBook.TransactionType !== "toExchange") {
        throw new AppError("Source book is not available for exchange.", 400);
      }

      if (!destBook || destBook.TransactionType !== "toExchange") {
        throw new AppError(
          "Destination book is not available for exchange",
          400
        );
      }
      break;
  }
};

export const validateOperationOwnership = async ({
  operationType,
  user_src,
  user_dest,
  srcBook,
  destBook,
}) => {
  switch (operationType) {
    case "buy":
      if (srcBook.UserID.toString() !== user_dest.toString()) {
        throw new AppError(
          "The seller (destination user) does not own this book."
        );
      }
      break;

    case "donate":
      if (srcBook.UserID.toString() !== user_dest.toString()) {
        throw new AppError("You can only donate a book you own.");
      }
      break;

    case "borrow":
      if (srcBook.UserID.toString() !== user_dest.toString()) {
        throw new AppError(
          "The lender (destination user) does not own this book."
        );
      }
      break;

    case "exchange":
      if (srcBook.UserID.toString() !== user_dest.toString()) {
        throw new AppError("You do not own the source book.");
      }
      if (!destBook || destBook.UserID.toString() !== user_dest.toString()) {
        throw new AppError(
          "The destination user does not own the exchange book."
        );
      }
      break;
  }
};

export const validateActiveStatus = async ({
  operationType,
  book_src_id,
  book_dest_id,
}) => {
  const srcBookActive = await checkActiveBookOperation(book_dest_id);
  if (srcBookActive)
    throw new AppError("Source book is already in an active operation.");

  if (operationType === "exchange" && book_dest_id) {
    const destBookActive = await checkActiveBookOperation(book_dest_id);
    if (destBookActive) {
      throw new AppError("Destination book is already in an active operation.");
    }
  }
};

export const validateDuplicateOperation = async ({
  user_src,
  user_dest,
  book_src_id,
  book_dest_id,
  operationType,
}) => {
  const existing = await checkExistingOperation({
    user_src,
    user_dest,
    book_src_id,
    book_dest_id,
    operationType,
  });

  if (existing) {
    throw new AppError("This operation already exists and is pending.");
  }
};
