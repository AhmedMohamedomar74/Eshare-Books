import { FormControl, Select, MenuItem, Typography, Box } from '@mui/material';

export default function MyReportsFilters({
  statusFilter,
  targetTypeFilter,
  onStatusChange,
  onTargetTypeChange,
}) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <FormControl sx={{ minWidth: 130 }}>
        <Typography variant="caption" sx={{ mb: 1, fontWeight: 'bold', color: '#666' }}>
          Status
        </Typography>
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          sx={{ backgroundColor: '#fff', borderRadius: 1 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Reviewed">Reviewed</MenuItem>
          <MenuItem value="Dismissed">Dismissed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 130 }}>
        <Typography variant="caption" sx={{ mb: 1, fontWeight: 'bold', color: '#666' }}>
          Target Type
        </Typography>
        <Select
          value={targetTypeFilter}
          onChange={(e) => onTargetTypeChange(e.target.value)}
          sx={{ backgroundColor: '#fff', borderRadius: 1 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="User">User</MenuItem>
          <MenuItem value="Book">Book</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
