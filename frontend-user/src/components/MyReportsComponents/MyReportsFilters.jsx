import { FormControl, Select, MenuItem, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';

export default function MyReportsFilters({
  statusFilter,
  targetTypeFilter,
  onStatusChange,
  onTargetTypeChange,
}) {
  const { content } = useSelector((state) => state.lang);

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <FormControl sx={{ minWidth: 130 }}>
        <Typography variant="caption" sx={{ mb: 1, fontWeight: 'bold', color: '#666' }}>
          {content.status || 'Status'}
        </Typography>
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          sx={{ backgroundColor: '#fff', borderRadius: 1 }}
        >
          <MenuItem value="All">{content.all || 'All'}</MenuItem>
          <MenuItem value="Pending">{content.pending || 'Pending'}</MenuItem>
          <MenuItem value="Reviewed">{content.reviewed || 'Reviewed'}</MenuItem>
          <MenuItem value="Dismissed">{content.dismissed || 'Dismissed'}</MenuItem>
          <MenuItem value="Cancelled">{content.cancelled || 'Cancelled'}</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 130 }}>
        <Typography variant="caption" sx={{ mb: 1, fontWeight: 'bold', color: '#666' }}>
          {content.targetType || 'Target Type'}
        </Typography>
        <Select
          value={targetTypeFilter}
          onChange={(e) => onTargetTypeChange(e.target.value)}
          sx={{ backgroundColor: '#fff', borderRadius: 1 }}
        >
          <MenuItem value="All">{content.all || 'All'}</MenuItem>
          <MenuItem value="user">{content.user || 'User'}</MenuItem>
          <MenuItem value="Book">{content.book || 'Book'}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
