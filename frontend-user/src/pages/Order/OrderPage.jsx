import {
  Box,
  Typography,
  Chip,
  Avatar,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Divider,
} from "@mui/material";

const OrderPage = () => {
  const book = {
    title: "The Midnight Library",
    author: "Matt Haig",
    image:
      "https://diwanegypt.com/wp-content/uploads/2021/02/9781786892737-663x1024.jpg",
    price: 12,
    shipping: 4.5,
    owner: {
      name: "Jane Doe",
      avatar: "https://i.pravatar.cc/300",
      rating: "4.9 (121 reviews)",
    },
    tags: ["Fantasy Fiction", "Philosophical Fiction", "Contemporary"],
    condition: "Like New",
  };

  return (
    <Box
      sx={{
        padding: { xs: "20px", md: "40px 60px" },
        display: "flex",
        gap: "40px",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Left Content */}
      <Box sx={{ flex: 2 }}>
        {/* Breadcrumb */}
        <Typography sx={{ fontSize: "0.9rem", color: "gray", mb: 2 }}>
          Home / Search Results /{" "}
          <span style={{ fontWeight: "bold", color: "black" }}>
            {book.title}
          </span>
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: "30px",
          }}
        >
          {/* Book Image */}
          <Box
            component="img"
            src={book.image}
            sx={{
              width: { xs: "100%", md: "300px" },
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          />

          {/* Book Details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              {book.title}
            </Typography>
            <Typography color="text.secondary" mb={2}>
              by {book.author}
            </Typography>

            <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap", mb: 2 }}>
              {book.tags.map((tag, index) => (
                <Chip key={index} label={tag} variant="outlined" />
              ))}
            </Box>

            <Typography fontWeight="bold">Condition:</Typography>
            <Typography mb={2}> {book.condition}</Typography>

            {/* Owner */}
            <Typography fontWeight="bold">Owner:</Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 3 }}
            >
              <Avatar src={book.owner.avatar} />
              <Box>
                <Typography fontWeight="bold">{book.owner.name}</Typography>
                <Typography fontSize="0.9rem" color="gray">
                  ⭐ {book.owner.rating}
                </Typography>
              </Box>
            </Box>

            {/* Description */}
            <Typography
              color="text.secondary"
              sx={{ fontSize: "1rem", lineHeight: 1.6 }}
            >
              "Between life and death there is a library, and within that
              library, the shelves go on forever. Every book provides a chance
              to try another life you could have lived..."
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right Content (Order Summary) */}
      <Box
        sx={{
          flex: 1,
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Order Summary
        </Typography>

        <RadioGroup defaultValue="purchase">
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              mb: 2,
              p: "15px",
            }}
          >
            <FormControlLabel
              value="purchase"
              control={<Radio />}
              label={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography fontWeight="bold">Purchase</Typography>
                  <Typography>${book.price.toFixed(2)}</Typography>
                </Box>
              }
            />
          </Box>

          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              mb: 2,
              p: "15px",
            }}
          >
            <FormControlLabel
              value="borrow"
              control={<Radio />}
              label={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography fontWeight="bold">Borrow</Typography>
                  <Typography>$3.00</Typography>
                </Box>
              }
            />
          </Box>

          <Box
            sx={{ border: "1px solid #ccc", borderRadius: "10px", p: "15px" }}
          >
            <FormControlLabel
              value="donate"
              control={<Radio />}
              label={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography fontWeight="bold">Receive Donation</Typography>
                  <Typography sx={{ color: "green" }}>$0.00</Typography>
                </Box>
              }
            />
          </Box>
        </RadioGroup>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Book Price</Typography>
          <Typography>${book.price.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>Shipping</Typography>
          <Typography>${book.shipping.toFixed(2)}</Typography>
        </Box>

        <Typography
          fontWeight="bold"
          sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
        >
          Total <span>${(book.price + book.shipping).toFixed(2)}</span>
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ py: "12px", fontWeight: "bold" }}
        >
          Complete Purchase
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            fontSize: "0.9rem",
          }}
        >
          <Typography>♡ Add to Wishlist</Typography>
          <Typography>✉ Contact Owner</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderPage;
