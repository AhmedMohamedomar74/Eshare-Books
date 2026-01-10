import React from "react";
import { Alert, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

export default function EditBookAlerts({ loading, error, successMessage }) {
  const { content } = useSelector((state) => state.lang);

  return (
    <>
      {/* Loading */}
      {loading && (
        <Alert
          severity="info"
          sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}
        >
          <CircularProgress size={20} />
          {content.updatingBook}
        </Alert>
      )}

      {/* Error */}
      {error && !loading && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {/* Success */}
      {successMessage && !loading && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {content.bookUpdatedSuccess}
          <br />
          {content.redirectingProfile}
        </Alert>
      )}
    </>
  );
}
