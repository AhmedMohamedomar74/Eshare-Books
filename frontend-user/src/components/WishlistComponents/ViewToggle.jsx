import { IconButton, Box } from '@mui/material';
import { GridView as GridViewIcon, List as ListIcon } from '@mui/icons-material';

export default function ViewToggle({ viewMode, onViewChange }) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <IconButton
        onClick={() => onViewChange('grid')}
        aria-label="Grid view"
        sx={{
          backgroundColor: viewMode === 'grid' ? '#e3f2fd' : 'transparent',
          color: viewMode === 'grid' ? '#1976d2' : '#999',
        }}
      >
        <GridViewIcon />
      </IconButton>
      <IconButton
        onClick={() => onViewChange('list')}
        aria-label="List view"
        sx={{
          backgroundColor: viewMode === 'list' ? '#e3f2fd' : 'transparent',
          color: viewMode === 'list' ? '#1976d2' : '#999',
        }}
      >
        <ListIcon />
      </IconButton>
    </Box>
  );
}
