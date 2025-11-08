import { Box, Typography, Stack, Pagination } from '@mui/material';

export default function MyReportsPagination({
  currentPage,
  onPageChange,
  totalPages,
  totalItems,
  itemsPerPage,
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
      <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
        Showing {startItem} to {endItem} of {totalItems} results
      </Typography>
      <Stack spacing={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => onPageChange(value)}
          shape="rounded"
          siblingCount={1}
          showFirstButton
          showLastButton
        />
      </Stack>
    </Box>
  );
}
