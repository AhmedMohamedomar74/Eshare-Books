import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export default function EditBookTypeSelector({ type, handleTypeChange }) {
  return (
    <ToggleButtonGroup
      value={type}
      exclusive
      onChange={handleTypeChange}
      fullWidth
      sx={{ mt: 3 }}
    >
      <ToggleButton value="toSale">Sell</ToggleButton>
      <ToggleButton value="toDonate">Donate</ToggleButton>
      <ToggleButton value="toBorrow">Borrow</ToggleButton>
    </ToggleButtonGroup>
  );
}
