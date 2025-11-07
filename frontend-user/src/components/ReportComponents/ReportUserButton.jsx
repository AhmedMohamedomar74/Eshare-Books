import { Button } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import { useNavigate } from 'react-router-dom';

export default function ReportUserButton({ userId }) {
  const navigate = useNavigate();

  const handleReport = () => {
    navigate(`/report/user/${userId}`);
  };

  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={<ReportIcon />}
      onClick={handleReport}
      sx={{ textTransform: 'none', borderRadius: 2 }}
    >
      Report User
    </Button>
  );
}
