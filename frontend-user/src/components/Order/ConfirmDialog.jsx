import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

const ConfirmDialog = ({ open, onClose, onConfirm, operationType }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Operation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to complete this{" "}
          <strong>{operationType}</strong> operation?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button
          component={Link}
          to="/"
          onClick={onConfirm}
          color="success"
          variant="contained"
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
