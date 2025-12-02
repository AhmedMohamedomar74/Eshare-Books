import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useSelector } from 'react-redux';

const ConfirmDialog = ({ open, onClose, onConfirm, operationType, warningMessage }) => {
  const { content } = useSelector((state) => state.lang);

  // ✅ If warning exists, show warning dialog
  if (warningMessage) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#ed6c02',
          }}
        >
          <WarningIcon />
          {content.warning || 'تحذير'}
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {warningMessage}
          </Alert>
          <DialogContentText>
            {content.proceedWarning ||
              'لقد قمت سابقاً بالإبلاغ عن مالك هذا الكتاب. هل تريد المتابعة في العملية؟'}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={onClose} color="error" variant="outlined" fullWidth>
            {content.cancelOperation || 'إلغاء العملية'}
          </Button>
          <Button onClick={onConfirm} color="warning" variant="contained" fullWidth autoFocus>
            {content.proceedAnyway || 'المتابعة رغم ذلك'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // ✅ Normal confirmation dialog (no warning)
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
        <Button onClick={onConfirm} color="success" variant="contained" autoFocus>
          {content.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
