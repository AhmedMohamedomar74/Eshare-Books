import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import ViewToggle from './ViewToggle';

export default function WishlistHeader({ viewMode, onViewChange }) {
  const { content } = useSelector((state) => state.lang);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000' }}>
        {content.mySavedBooks || 'My Saved Books'}
      </Typography>
      <ViewToggle viewMode={viewMode} onViewChange={onViewChange} />
    </Box>
  );
}
