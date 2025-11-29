import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useSelector } from "react-redux";

export default function EditBookTypeSelector({ type, handleTypeChange }) {
  const { content } = useSelector((state) => state.lang);

  return (
    <ToggleButtonGroup
      value={type}
      exclusive
      onChange={handleTypeChange}
      fullWidth
      sx={{ mt: 3 }}
    >
      <ToggleButton value="toSale">{content.toSale}</ToggleButton>
      <ToggleButton value="toDonate">{content.toDonate}</ToggleButton>
      <ToggleButton value="toBorrow">{content.toBorrow}</ToggleButton>
    </ToggleButtonGroup>
  );
}
