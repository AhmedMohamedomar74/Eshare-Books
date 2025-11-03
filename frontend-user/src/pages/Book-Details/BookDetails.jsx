import { ChatBubbleOutline, FavoriteBorderOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Chip, Typography } from "@mui/material";

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
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: "20px", md: "40px" },
          maxWidth: "1000px",
          width: "100%",
        }}
      >
        {/* Book Image */}
        <Box
          component="img"
          src={book.image}
          alt={book.Title}
          sx={{
            width: { xs: "100%", sm: "250px", md: "300px" },
            height: "auto",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            alignSelf: { xs: "center", md: "flex-start" },
          }}
        />

        {/* Book Content */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ fontSize: { xs: "1.8rem", md: "2.3rem" } }}
          >
            {book.Title}
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            mb={2}
            sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
          >
            by Matt Haig
          </Typography>

          {/* Category + Pricing Type */}
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            <Chip label={book.categoryId} variant="outlined" />
            <Chip
              label={getTransactionLabel(book.TransactionType)}
              color="success"
            />
          </Box>

          {/* Description */}
          <Typography
            sx={{
              mb: 3,
              lineHeight: 1.7,
              textAlign: "justify",
              fontSize: { xs: "0.95rem", md: "1rem" },
            }}
          >
            {book.Description}
          </Typography>

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

          {/*  Action Buttons */}
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
              fullWidth={true}
              startIcon={<ChatBubbleOutline sx={{ fontWeight: "bold" }} />}
              sx={{
                backgroundColor: "#2e7d32",
                textTransform: "none",
                padding: "10px 25px",
                borderRadius: "8px",
                fontWeight: "bold",
              }}
            >
              Contact Owner
            </Button>
            <Button
              variant="outlined"
              startIcon={
                <FavoriteBorderOutlined
                  sx={{ color: "black", fontWeight: "bold" }}
                />
              }
              fullWidth={true}
              sx={{
                textTransform: "none",
                padding: "10px 25px",
                borderRadius: "8px",
                backgroundColor: "#f5f5dc",
                color: "black",
                fontWeight: "bold",
                borderColor: "#c0a427ff",
              }}
            >
              Add to Wishlist
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BookDetails;
