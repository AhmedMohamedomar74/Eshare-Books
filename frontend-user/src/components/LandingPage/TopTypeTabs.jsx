import React from "react";
import { Box, Paper, Typography, ButtonBase } from "@mui/material";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import AppsIcon from "@mui/icons-material/Apps";
import useTranslate from "../../hooks/useTranslate";

const tabs = [
  {
    key: null, // ✅ null means "All"
    label: "All",
    icon: <AppsIcon sx={{ fontSize: 34 }} />,
    color: "#6b7280",
  },
  {
    key: "toSale",
    label: "Sell",
    icon: <LocalOfferOutlinedIcon sx={{ fontSize: 34 }} />,
    color: "#22a699",
  },
  {
    key: "toBorrow",
    label: "Borrow",
    icon: <MenuBookOutlinedIcon sx={{ fontSize: 34 }} />,
    color: "#1976d2",
  },
  {
    key: "toDonate",
    label: "Donate",
    icon: <VolunteerActivismOutlinedIcon sx={{ fontSize: 34 }} />,
    color: "#f59e0b",
  },
];

export default function TopTypeTabs({ selectedType, onChange }) {
  const { t } = useTranslate();

  return (
    <Paper
      elevation={1}
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)", // ✅ Changed to 4 columns
        borderRadius: 2.5,
        overflow: "hidden",
        mb: 3,
        bgcolor: "white",
      }}
    >
      {tabs.map((tab) => {
        const active = selectedType === tab.key;

        return (
          <ButtonBase
            key={tab.key || "all"}
            onClick={() => onChange?.(tab.key)}
            sx={{
              py: 2.2,
              px: 2,
              transition: "all .25s ease",
              borderBottom: active ? `3px solid ${tab.color}` : "3px solid transparent",
              bgcolor: active ? `${tab.color}20` : "transparent", // ✅ More visible
              "&:hover": { 
                bgcolor: `${tab.color}30`, // ✅ Clearer hover
                transform: "translateY(-2px)", // ✅ Subtle lift effect
                boxShadow: active ? "none" : `0 4px 12px ${tab.color}30`, // ✅ Shadow on hover
              },
            }}
          >
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.7,
              }}
            >
              <Box sx={{ color: active ? tab.color : "#111" }}>
                {tab.icon}
              </Box>
              <Typography
                fontWeight={800}
                sx={{
                  color: active ? tab.color : "#111",
                  fontSize: "1rem",
                }}
              >
                {t(tab.label.toLowerCase(), tab.label)}
              </Typography>
            </Box>
          </ButtonBase>
        );
      })}
    </Paper>
  );
}