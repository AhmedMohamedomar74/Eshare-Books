import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ConfirmDialog = ({ open, onClose, onConfirm, operationType }) => {
  const { content } = useSelector((state) => state.lang);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{content.confirmOperation}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content.confirmMessage} <strong>{content[operationType]}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          {content.cancel}
        </Button>
        <Button
          component={Link}
          to="/"
          onClick={onConfirm}
          color="success"
          variant="contained"
          autoFocus
        >
          {content.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
