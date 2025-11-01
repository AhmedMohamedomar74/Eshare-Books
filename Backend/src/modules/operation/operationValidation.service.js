import { checkActiveBookOperation, checkExistingOperation } from "../../utils/dbHelpers.js";


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
        throw new Error(
          "The seller (destination user) does not own this book."
        );
      }
      break;

    case "donate":
      if (srcBook.UserID.toString() !== user_src.toString()) {
        throw new Error("You can only donate a book you own.");
      }
      break;

    case "borrow":
      if (srcBook.UserID.toString() !== user_dest.toString()) {
        throw new Error(
          "The lender (destination user) does not own this book."
        );
      }
      break;

    case "exchange":
      if (srcBook.UserID.toString() !== user_src.toString()) {
        throw new Error("You do not own the source book.");
      }
      if (!destBook || destBook.UserID.toString() !== user_dest.toString()) {
        throw new Error("The destination user does not own the exchange book.");
      }
      break;
  }
};

export const validateActiveStatus = async ({
  operationType,
  book_src_id,
  book_dest_id,
}) => {
  const srcBookActive = await checkActiveBookOperation(book_src_id);
  if (srcBookActive)
    throw new Error("Source book is already in an active operation.");

  if (operationType === "exchange" && book_dest_id) {
    const destBookActive = await checkActiveBookOperation(book_dest_id);
    if (destBookActive) {
      throw new Error("Destination book is already in an active operation.");
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
    throw new Error("This operation already exists and is pending.");
  }
};
