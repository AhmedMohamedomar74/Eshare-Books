import bookmodel from "../DB/models/bookmodel.js";
import operationModel from "../DB/models/operation.model.js";
import userModel from "../DB/models/User.model.js";

// Find User By ID
export const findUserById = async (userId) => {
  return await userModel.findById(userId);
};

// Find Book By ID
export const findBookById = async (bookId) => {
  return await bookmodel.findById(bookId);
};

// Check if Book Already Has Active Operation
export const checkActiveBookOperation = async (bookId) => {
  return await operationModel.findOne({
    $or: [{ book_src_id: bookId }, { book_dest_id: bookId }],
    status: "pending",
  });
};

// Check for Existing Duplicate Operation
export const checkExistingOperation = async ({
  user_src,
  user_dest,
  book_src_id,
  book_dest_id,
  operationType,
}) => {
  return await operationModel.findOne({
    user_src,
    user_dest,
    book_src_id,
    book_dest_id,
    operationType,
    status: "pending",
  });
};
