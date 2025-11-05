import { ChatBubbleOutline, EmailOutlined } from "@mui/icons-material";
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
    Description:
      "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets? A novel about all the choices that go into a life well lived.",
    image:
      "https://diwanegypt.com/wp-content/uploads/2021/02/9781786892737-663x1024.jpg",
    price: 12,
    categoryId: "Fiction",
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
      <Box sx={{ flex: 1 }}>
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
          </Box>
        </Box>
      </Box>

      {/* Right Content (Order Summary) */}
      <Box
        sx={{
          flex: 0.4,
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={3} textAlign="center">
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

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Book Price</Typography>
          <Typography>${book.price.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>Shipping</Typography>
          <Typography>${book.shipping.toFixed(2)}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography
          fontWeight="bold"
          sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
        >
          Total <span>${(book.price + book.shipping).toFixed(2)}</span>
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 3,
          }}
        >
          <Button
            variant="contained"
            sx={{
              py: "12px",
              fontWeight: "bold",
              backgroundColor: "#004d40",
              width: "80%",
              borderRadius: "15px",
            }}
          >
            Complete Purchase
          </Button>

          <Button
            variant="contained"
            startIcon={<EmailOutlined />}
            sx={{
              backgroundColor: "#c0ca33",
              textTransform: "none",
              fontWeight: "bold",
              width: "80%",
              borderRadius: "12px",
            }}
          >
            Contact Owner
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderPage;
