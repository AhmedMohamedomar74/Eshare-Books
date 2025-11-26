import React from "react";
import { Alert, CircularProgress } from "@mui/material";

export default function EditBookAlerts({ loading, error, successMessage }) {
  return (
    <>
      {/* 🌀 Loading */}
      {loading && (
        <Alert
          severity="info"
          sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}
        >
          <CircularProgress size={20} />
          Updating your book...
        </Alert>
      )}

      {/* ⚠️ Error */}
      {error && !loading && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {/* ✅ Success */}
      {successMessage && !loading && (
        <Alert severity="success" sx={{ mt: 3 }}>
          Book updated successfully! ✅ <br />
          Redirecting to your profile...
        </Alert>
      )}
    </>
  );
}
