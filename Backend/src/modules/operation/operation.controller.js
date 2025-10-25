import operationModel from "../../DB/models/operation.model.js";

// @desc    Get all operations
// @route   GET /api/operations

export const getAllOperation = async (req, res) => {
  try {
    const operations = await operationModel
      .find()
      .populate("user_src", "name email")
      .populate("user_dest", "name email")
      .populate("book_id", "title author");
    res
      .status(200)
      .json({ success: true, message: "get All Operation", data: operations });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// @desc    Create new operation
// @route   POST /api/operations

export const createOperation = async (req, res) => {
  try {
    const { user_src, user_dest, book_id } = req.body;
    const newOperation = await operationModel.create({
      user_src,
      user_dest,
      book_id,
    });

    res.status(201).json({
      success: true,
      message: "create operation Successfilly",
      data: newOperation,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// @desc    Update operation status
// @route   PUT /api/operations/:id

export const updateOperation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await operationModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Operation not found" });
    return res
      .status(200)
      .json({ success: true, message: "operation updated", data: updated });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// @desc    Delete an operation
// @route   DELETE /api/operations/:id

export const deleteOperation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await operationModel.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Operation not found" });
    res
      .status(200)
      .json({ success: true, message: "Operation deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
