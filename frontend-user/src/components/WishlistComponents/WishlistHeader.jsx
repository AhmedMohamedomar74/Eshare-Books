import { Box, Typography } from '@mui/material';
import ViewToggle from './ViewToggle';

export default function WishlistHeader({ viewMode, onViewChange }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000' }}>
        My Saved Books
      </Typography>
      <ViewToggle viewMode={viewMode} onViewChange={onViewChange} />
    </Box>
  );
}
