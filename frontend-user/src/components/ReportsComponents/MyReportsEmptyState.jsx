// components/MyReports/MyReportsEmptyState.jsx
import { Box, Typography, Button } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';

export default function MyReportsEmptyState() {
  const navigate = useNavigate();

  const handleBrowseBooks = () => {
    navigate('/books');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        textAlign: 'center',
        py: 6,
        px: 2,
      }}
    >
      <MenuBookIcon sx={{ fontSize: 80, color: '#ccc', mb: 3 }} />

      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#555', mb: 1 }}>
        No Reports Found
      </Typography>

      <Typography variant="body1" sx={{ color: '#777', maxWidth: 500, mb: 3 }}>
        You haven't submitted any reports yet. Explore books and report any issues you find.
      </Typography>

      <Button
        variant="contained"
        startIcon={<MenuBookIcon />}
        onClick={handleBrowseBooks}
        sx={{
          backgroundColor: '#2563eb',
          textTransform: 'none',
          fontWeight: 600,
          px: 4,
          py: 1.5,
          borderRadius: 2,
          '&:hover': { backgroundColor: '#1d4ed8' },
        }}
      >
        Browse Books
      </Button>
    </Box>
  );
}
