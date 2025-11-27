import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { IconButton, Tooltip } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language"; // 🌐 أيقونة اللغة

const LangButton = () => {
  const dispatch = useDispatch();
  const { lang } = useSelector((state) => state.lang);

  const toggleLang = () => {
    dispatch({ type: "TOGGLE_LANG" });
  };

  return (
    <Tooltip title={lang === "en" ? "Switch to Arabic" : "Switch to English"}>
      <IconButton
        onClick={toggleLang}
        sx={{
          color: "gray",
          "&:hover": { color: "black" },
        }}
      >
        <LanguageIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LangButton;
