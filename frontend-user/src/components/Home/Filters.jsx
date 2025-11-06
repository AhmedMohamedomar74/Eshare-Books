import React from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Divider,
  Button,
} from "@mui/material";

export default function Filters() {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Filters</Typography>
        <Button size="small">Clear Filters</Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography fontWeight="bold" gutterBottom>
        Category
      </Typography>
      <FormGroup>
        {["Medicine", "Psychology", "Literature", "Science Fiction"].map(
          (cat) => (
            <FormControlLabel key={cat} control={<Checkbox />} label={cat} />
          )
        )}
      </FormGroup>

      <Typography fontWeight="bold" sx={{ mt: 3 }}>
        Type
      </Typography>
      <FormGroup>
        {["Sell", "Donate", "Borrow"].map((type) => (
          <FormControlLabel key={type} control={<Checkbox />} label={type} />
        ))}
      </FormGroup>

      <Typography fontWeight="bold" sx={{ mt: 3 }}>
        Price Range
      </Typography>
      <Slider defaultValue={50} step={5} min={0} max={100} />
    </Box>
  );
}
