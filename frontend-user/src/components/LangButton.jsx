import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

// Define your main color (or import it from theme/constants)
const MAIN_COLOR = "#22a699";

const LangButton = () => {
  const dispatch = useDispatch();
  const { lang } = useSelector((state) => state.lang);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLang = (selectedLang) => {
    dispatch({ type: "TOGGLE_LANG", payload: selectedLang });
    handleClose();
  };

  return (
    <>
      <Tooltip title={lang === "en" ? "Switch to Arabic" : "Switch to English"}>
        <IconButton
          onClick={handleClick}
          sx={{
            color: MAIN_COLOR,
            width: 40,
            height: 40,
            "&:hover": {
              backgroundColor: `${MAIN_COLOR}12`,
              color: MAIN_COLOR,
            },
            "&:focus": {
              backgroundColor: "transparent !important",
              outline: "none",
            },
            "& .MuiTouchRipple-root": { display: "none" },
          }}
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem selected={lang === "en"} onClick={() => changeLang("en")}>
          English
        </MenuItem>
        <MenuItem selected={lang === "ar"} onClick={() => changeLang("ar")}>
          العربية
        </MenuItem>
      </Menu>
    </>
  );
};

export default LangButton;
