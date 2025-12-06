import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useTranslate from "../../hooks/useTranslate";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

const MAIN_COLOR = "#22a699";
const BG = "#f6f7f9";

export default function Landing() {
  const { t } = useTranslate();
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: BG, minHeight: "100vh" }}>
      {/* ================= HERO SECTION ================= */}
      <Box
        sx={{
          bgcolor: "#f7f1e8",
          py: { xs: 12, md: 20 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 4, md: 6 },
              alignItems: "center",
            }}
          >
            {/* Left side - Text content */}
            <Box>
              <Typography
                fontWeight={900}
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  mb: 2,
                  color: "#111827",
                  lineHeight: 1.2,
                }}
              >
                {t("heroTitle", "Share, Donate, or Sell Your Books.")}
              </Typography>

              <Typography
                sx={{
                  color: "#4b5563",
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  mb: 3,
                }}
              >
                {t(
                  "heroSubtitle",
                  "Connect with readers in your community. Borrow, buy, or donate books easily."
                )}
              </Typography>

              {/* CTA buttons */}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: MAIN_COLOR,
                    "&:hover": { bgcolor: "#1b8b7f" },
                    fontWeight: 700,
                    borderRadius: 999,
                    textTransform: "none",
                    px: 4,
                    py: 1.2,
                  }}
                  onClick={() => navigate("/home")}
                >
                  {t("getStarted", "Get Started")}
                </Button>
              </Stack>
            </Box>

            {/* Right side - Hero Image */}
            <Box
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1000"
                alt="Stack of books"
                sx={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ================= EXPLORE COMMUNITY SECTION ================= */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={900}
            textAlign="center"
            sx={{ mb: 5, color: "#111827" }}
          >
            {t("exploreCommunity", "Explore the Community")}
          </Typography>

          <Stack spacing={3}>
            {/* Borrow Books Card */}
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
                    <Box
                      sx={{
                        bgcolor: `${MAIN_COLOR}15`,
                        p: 1.5,
                        borderRadius: 2,
                        display: "flex",
                      }}
                    >
                      <LocalLibraryIcon sx={{ color: MAIN_COLOR, fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 1, color: "#111827" }}
                      >
                        {t("borrowBooks", "Borrow Books")}
                      </Typography>
                      <Typography
                        sx={{ color: "#6b7280", fontSize: "0.9rem", maxWidth: 500 }}
                      >
                        {t(
                          "borrowDesc",
                          "Discover a wide range of books available for borrowing from people near you."
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/home")}
                    sx={{
                      bgcolor: MAIN_COLOR,
                      "&:hover": { bgcolor: "#1b8b7f" },
                      fontWeight: 600,
                      borderRadius: 999,
                      textTransform: "none",
                      px: 3,
                    }}
                  >
                    {t("startBorrowing", "Start Borrowing")}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Sell Books Card */}
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
                    <Box
                      sx={{
                        bgcolor: `${MAIN_COLOR}15`,
                        p: 1.5,
                        borderRadius: 2,
                        display: "flex",
                      }}
                    >
                      <ShoppingBasketIcon sx={{ color: MAIN_COLOR, fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 1, color: "#111827" }}
                      >
                        {t("sellBooks", "Sell Books")}
                      </Typography>
                      <Typography
                        sx={{ color: "#6b7280", fontSize: "0.9rem", maxWidth: 500 }}
                      >
                        {t(
                          "sellDesc",
                          "Turn your pre-loved books into cash by selling them to our community of readers."
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/home")}
                    sx={{
                      bgcolor: MAIN_COLOR,
                      "&:hover": { bgcolor: "#1b8b7f" },
                      fontWeight: 600,
                      borderRadius: 999,
                      textTransform: "none",
                      px: 3,
                    }}
                  >
                    {t("sellBooks", "Sell Books")}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Donate Books Card */}
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
                    <Box
                      sx={{
                        bgcolor: `${MAIN_COLOR}15`,
                        p: 1.5,
                        borderRadius: 2,
                        display: "flex",
                      }}
                    >
                      <VolunteerActivismIcon sx={{ color: MAIN_COLOR, fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 1, color: "#111827" }}
                      >
                        {t("donateBooks", "Donate Books")}
                      </Typography>
                      <Typography
                        sx={{ color: "#6b7280", fontSize: "0.9rem", maxWidth: 500 }}
                      >
                        {t(
                          "donateDesc",
                          "Give your books a new life and support a good cause by donating them to local charities."
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/home")}
                    sx={{
                      bgcolor: MAIN_COLOR,
                      "&:hover": { bgcolor: "#1b8b7f" },
                      fontWeight: 600,
                      borderRadius: 999,
                      textTransform: "none",
                      px: 3,
                    }}
                  >
                    {t("donateNow", "Donate Now")}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>

      {/* ================= ABOUT SECTION ================= */}
      <Box sx={{ bgcolor: "#f7f1e8", py: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={900}
            textAlign="center"
            sx={{ mb: 4, color: "#111827" }}
          >
            {t("aboutUs", "About Us")}
          </Typography>

          <Typography
            sx={{
              color: "#4b5563",
              fontSize: "1.05rem",
              textAlign: "center",
              maxWidth: 800,
              mx: "auto",
              mb: 5,
              lineHeight: 1.8,
            }}
          >
            {t(
              "aboutDesc",
              "At Eshare Books, our mission is to foster a love for reading by making books more accessible and sustainable. We believe every book deserves to be read, and our platform connects passionate readers to facilitate easy exchanges, sales, and donations within local communities."
            )}
          </Typography>

          {/* Feature Pills */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 2 }}
          >
            <Box
              sx={{
                bgcolor: `${MAIN_COLOR}15`,
                color: MAIN_COLOR,
                px: 3,
                py: 1,
                borderRadius: 999,
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              💱 {t("safeExchange", "Safe Exchange")}
            </Box>
            <Box
              sx={{
                bgcolor: `${MAIN_COLOR}15`,
                color: MAIN_COLOR,
                px: 3,
                py: 1,
                borderRadius: 999,
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              👥 {t("communitySharing", "Community Sharing")}
            </Box>
            <Box
              sx={{
                bgcolor: `${MAIN_COLOR}15`,
                color: MAIN_COLOR,
                px: 3,
                py: 1,
                borderRadius: 999,
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              🔍 {t("easyDiscovery", "Easy Discovery")}
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}