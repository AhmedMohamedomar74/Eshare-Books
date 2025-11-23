import React from "react";
import { Button, Box } from "@mui/material";

const EditBookButtons = ({ loading, onCancel }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ py: 1.3 }}
        disabled={loading}
      >
        Update Book
      </Button>

      <Button
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
        onClick={onCancel}
        disabled={loading}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default EditBookButtons;
