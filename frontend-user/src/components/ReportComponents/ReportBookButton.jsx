import { Button } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ReportBookButton({ bookId }) {
  const navigate = useNavigate();
  const { content } = useSelector((state) => state.lang);

  const handleReport = () => {
    navigate(`/reports/book/${bookId}`);
  };

  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={<ReportIcon />}
      onClick={handleReport}
      sx={{ textTransform: 'none', borderRadius: 2 }}
    >
      {content.reportBook || 'Report Book'}
    </Button>
  );
}
