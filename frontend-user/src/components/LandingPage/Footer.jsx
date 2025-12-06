import React from "react";
import { Box, Container, Typography, Stack, IconButton } from "@mui/material";
import useTranslate from "../../hooks/useTranslate";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const MAIN_COLOR = "#22a699";
const SUPPORT_EMAIL = "support@eshareBook.com";

export default function Footer() {
  const { t } = useTranslate();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: MAIN_COLOR,
        color: "white",
        py: { xs: 5, md: 6 },   // ✅ أكبر
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        {/* Top Row */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={{ xs: 3, md: 4 }}   // ✅ مسافة أكبر
          sx={{ mb: { xs: 3, md: 3.5 } }}
        >
          {/* Brand */}
          <Box>
            <Typography
              variant="h5"             // ✅ كان h6
              fontWeight={900}
              sx={{ letterSpacing: 0.6, mb: 0.6 }}
            >
              Eshare Books
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.05rem" }, // ✅ أكبر
                opacity: 0.95,
                maxWidth: 520,
                lineHeight: 1.7,
              }}
            >
              {t(
                "footerTagline",
                "Borrow, sell, or donate books easily with your community."
              )}
            </Typography>
          </Box>

          {/* Support Email */}
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.05rem" }, // ✅ أكبر
                fontWeight: 800,
                mb: 0.7,
              }}
            >
              {t("support", "Support")}
            </Typography>

            <Typography
              component="a"
              href={`mailto:${SUPPORT_EMAIL}`}
              sx={{
                fontSize: { xs: "1.05rem", md: "1.1rem" }, // ✅ أكبر
                color: "white",
                textDecoration: "none",
                fontWeight: 700,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {SUPPORT_EMAIL}
            </Typography>
          </Box>

          {/* Social */}
          <Stack direction="row" spacing={1.5}>
            <IconButton
              sx={{
                bgcolor: "rgba(255,255,255,0.18)",
                color: "white",
                width: 44,            // ✅ أكبر
                height: 44,
                "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
              }}
              component="a"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon fontSize="medium" /> {/* ✅ أكبر */}
            </IconButton>

            <IconButton
              sx={{
                bgcolor: "rgba(255,255,255,0.18)",
                color: "white",
                width: 44,
                height: 44,
                "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
              }}
              component="a"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon fontSize="medium" />
            </IconButton>

            <IconButton
              sx={{
                bgcolor: "rgba(255,255,255,0.18)",
                color: "white",
                width: 44,
                height: 44,
                "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
              }}
              component="a"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon fontSize="medium" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Divider + Copyright */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.25)",
            pt: { xs: 2.5, md: 3 },   // ✅ أكبر
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "0.95rem", opacity: 0.95 }}> {/* ✅ أكبر */}
            © 2025 Eshare Books. {t("allRightsReserved", "All rights reserved.")}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
