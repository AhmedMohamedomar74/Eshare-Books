import {
  ChatBubbleOutline,
  FavoriteBorderOutlined,
  OutlinedFlag,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";

const BookDetails = () => {
  const book = {
    Title: "The Midnight Library",
    Description:
      "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets? A novel about all the choices that go into a life well lived.",
    TransactionType: "toSale",
    Price: 100,
    categoryId: "Fiction",
    User: {
      name: "Jane Doe",
      avatar: "https://i.pravatar.cc/300",
      rating: 4.8,
    },
    image:
      "https://diwanegypt.com/wp-content/uploads/2021/02/9781786892737-663x1024.jpg",
  };

  const getTransactionLabel = (type) => {
    switch (type) {
      case "toSale":
        return `For Sale: $${book.Price}`;
      case "toBorrow":
        return "Available to Borrow";
      case "toExchange":
        return "Available to Exchange";
      case "toDonate":
        return "Free to Donate";
      default:
        return "";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: { xs: "20px 10px", md: "50px 20px" },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1000px" }}>
        {/* Breadcrumb */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3, fontSize: "0.9rem" }}>
          <MuiLink component={Link} to="/" underline="hover" color="inherit">
            Home
          </MuiLink>
          <MuiLink
            component={Link}
            to={`/category/${book.categoryId.toLowerCase()}`}
            underline="hover"
            color="inherit"
          >
            {book.categoryId}
          </MuiLink>
          <Typography color="text.primary">{book.Title}</Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: "20px", md: "40px" },
          }}
        >
          {/* Book Image */}
          <Box
            component="img"
            src={book.image}
            alt={book.Title}
            sx={{
              width: { xs: "100%", sm: "250px", md: "300px" },
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          />

          {/* Book Details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              {book.Title}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" mb={2}>
              by Matt Haig
            </Typography>

            {/* Category + Price */}
            <Box sx={{ display: "flex", gap: "10px", mb: 2, flexWrap: "wrap" }}>
              <Chip label={book.categoryId} variant="outlined" />
              <Chip
                label={getTransactionLabel(book.TransactionType)}
                color="success"
              />
            </Box>

            <Box sx={{ height: "1px", backgroundColor: "#ddd", my: 3 }} />

            {/* Description */}
            <Typography
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.7, textAlign: "justify" }}
            >
              {book.Description}
            </Typography>

            <Box sx={{ height: "1px", backgroundColor: "#ddd", my: 3 }} />

            {/* Owner Info */}
            <Typography fontWeight="bold" mb={1}>
              Listed By:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar src={book.User.avatar} />
              <Box>
                <Typography sx={{ fontWeight: "bold" }}>
                  {book.User.name}
                </Typography>
                <Typography sx={{ fontSize: "14px", color: "gray" }}>
                  ⭐ {book.User.rating}
                </Typography>
              </Box>
            </Box>

            {/* Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: "15px",
                mt: 4,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                variant="contained"
                fullWidth
                startIcon={<ChatBubbleOutline />}
                sx={{
                  backgroundColor: "#2e7d32",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Contact Owner
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FavoriteBorderOutlined sx={{ color: "black" }} />}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#f5f5dc",
                  borderColor: "#c0a427ff",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Add to Wishlist
              </Button>
            </Box>

            {/* Report Link */}
            <Box
              component={Link}
              to="/report"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontSize: "0.8rem",
                color: "#0e0101",
                marginTop: "32px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              <OutlinedFlag sx={{ fontSize: "18px" }} />
              Report this book
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BookDetails;
