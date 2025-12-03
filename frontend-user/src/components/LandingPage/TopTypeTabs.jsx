import React from "react";
import { Box, Paper, Typography, ButtonBase } from "@mui/material";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import useTranslate from "../../hooks/useTranslate";

const tabs = [
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
        gridTemplateColumns: "repeat(3, 1fr)",
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
            key={tab.key}
            onClick={() => onChange?.(active ? null : tab.key)}
            sx={{
              py: 2.2,
              px: 2,
              transition: "all .25s ease",
              borderBottom: active ? `3px solid ${tab.color}` : "3px solid transparent",
              bgcolor: active ? `${tab.color}10` : "transparent",
              "&:hover": { bgcolor: `${tab.color}15` },
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
