import { Box, Chip, Typography, Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../axiosInstance/axiosInstance.js";
import Spinner from "../../components/Spinner.jsx";
import BreadcrumbNav from "../../components/Book-detalis/BreadcrumbNav.jsx";
import BookImage from "../../components/Book-detalis/BookImage.jsx";
import BookOwner from "../../components/Book-detalis/BookOwner.jsx";
import BookActions from "../../components/Book-detalis/BookActions.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlist.slice";
import BookHeader from "../../components/Book-detalis/BookHeader.jsx";

const BookDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);

  const [book, setBook] = useState(null);
  const [loadingBook, setLoadingBook] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const { content } = useSelector((state) => state.lang);

  useEffect(() => {
    api
      .get(`/books/${id}`)
      .then((res) => {
        setBook(res.data.book);
      })
      .catch((err) => console.error("Error fetching book details:", err))
      .finally(() => setLoadingBook(false));
  }, [id]);

  useEffect(() => {
    if (book?._id) {
      const exists = wishlist?.some((b) => b._id === book._id);
      setInWishlist(exists);
    }
  }, [wishlist, book]);

  const handleToggleWishlist = async () => {
    try {
      if (inWishlist) {
        await dispatch(removeFromWishlist(book._id));
        setMessage(content.bookRemoved);
        setInWishlist(false);
      } else {
        await dispatch(addToWishlist(book._id));
        setMessage(content.bookAdded);
        setInWishlist(true);
      }
    } catch {
      setMessage(content.errorMessage);
    }
    setOpenSnackbar(true);
  };

  const getTransactionLabel = (type) => {
    if (!book) return "";
    switch (type) {
      case "toSale":
        return `${content.forSale}: ${book.Price} ${content.currency}`;
      case "toBorrow":
        return book.isBorrowedNow
          ? content.currentlyBorrowed
          : content.availableToBorrow;
      case "toExchange":
        return content.availableToExchange;
      case "toDonate":
        return content.freeToDonate;
      default:
        return "";
    }
  };

  if (loadingBook) return <Spinner />;
  if (!book)
    return (
      <Typography textAlign="center" mt={5} color="error">
        {content.bookNotFound}
      </Typography>
    );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: { xs: "20px 10px", md: "50px 20px" },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1000px" }}>
        <BreadcrumbNav title={book.Title} categoryId={book.categoryId} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: "20px", md: "40px" },
          }}
        >
          <BookImage src={book.image?.secure_url} alt={book.Title} />

          <Box sx={{ flex: 1 }}>
            <BookHeader
              title={book.Title}
              author={`${book.UserID?.firstName || ""} ${
                book.UserID?.secondName || ""
              }`.trim()}
              bookId={book._id}
              inWishlist={inWishlist}
              onToggleWishlist={handleToggleWishlist}
            />

            <Box sx={{ display: "flex", gap: "10px", mb: 2, flexWrap: "wrap" }}>
              <Chip
                label={book.categoryId?.name || content.general}
                variant="outlined"
              />
              <Chip
                label={getTransactionLabel(book.TransactionType)}
                color="success"
              />
            </Box>

            <Box sx={{ height: "1px", backgroundColor: "#ddd", my: 3 }} />

            <Typography
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.7, textAlign: "justify" }}
            >
              {book.Description}
            </Typography>

            <Box sx={{ height: "1px", backgroundColor: "#ddd", my: 3 }} />

            <BookOwner
              avatar={book.UserID?.avatar}
              name={`${book.UserID?.firstName || ""} ${
                book.UserID?.secondName || ""
              }`.trim()}
              userId={book.UserID?._id}
            />

            {/*✅ تنبيه فقط لو Borrow شغالة */}
            {/* {book.TransactionType === "toBorrow" && book.isBorrowedNow && (
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#fff3e0",
                  color: "#e65100",
                  fontWeight: 600,
                  width: "fit-content",
                }}
              >
                <Typography fontWeight="bold">
                  This book is currently borrowed.
                </Typography>

                {book.currentBorrow?.endDate && (
                  <Typography variant="body2">
                    Current borrow ends at{" "}
                    {dayjs(book.currentBorrow.endDate).format("YYYY-MM-DD")}
                  </Typography>
                )}

                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  You can still reserve another period.
                </Typography>
              </Box>
            )} */}

            {/* BookActions */}
            <BookActions
              bookId={book._id}
              bookOwnerId={book.UserID?._id}
            />
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={
            message.includes("removed") || message.includes("wrong")
              ? "warning"
              : "success"
          }
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookDetails;
