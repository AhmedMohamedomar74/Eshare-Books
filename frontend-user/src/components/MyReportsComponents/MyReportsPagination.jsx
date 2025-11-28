import { Box, Typography, Stack, Pagination } from '@mui/material';
import { useSelector } from 'react-redux';

export default function MyReportsPagination({
  currentPage,
  onPageChange,
  totalPages,
  totalItems,
  itemsPerPage,
}) {
  const { content } = useSelector((state) => state.lang);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
      <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
        {content.showingResults
          ? content.showingResults
              .replace('{start}', startItem)
              .replace('{end}', endItem)
              .replace('{total}', totalItems)
          : `Showing ${startItem} to ${endItem} of ${totalItems} results`}
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
