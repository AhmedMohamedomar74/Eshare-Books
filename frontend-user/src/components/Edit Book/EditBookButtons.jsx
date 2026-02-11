import React from "react";
import { Button, Box } from "@mui/material";
import { useSelector } from "react-redux";

const EditBookButtons = ({ loading, onCancel }) => {
  const { content } = useSelector((state) => state.lang);

  return (
    <Box sx={{ mt: 3 }}>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ py: 1.3 }}
        disabled={loading}
      >
        {content.updateBook}
      </Button>

      <Button
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
        onClick={onCancel}
        disabled={loading}
      >
        {content.cancel}
      </Button>
    </Box>
  );
};

export default EditBookButtons;