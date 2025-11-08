import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import notFoundImage from '/src/assets/not_foundimage.png';

export default function BookCardList({ book, onView, onDelete }) {
  const imageSrc = book.image?.secure_url || notFoundImage;

  return (
    <Card
      sx={{
        display: 'flex',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={book.Title}
        sx={{ width: 120, height: 160, objectFit: 'cover' }}
        loading="lazy"
      />
      <CardContent
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#000',
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {book.Title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {book.TransactionType}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={onView}
            sx={{ backgroundColor: '#1976d2', textTransform: 'none', fontWeight: 'bold' }}
          >
            View Details
          </Button>
          <Button
            variant="outlined"
            onClick={onDelete}
            sx={{ textTransform: 'none', fontWeight: 'bold', borderColor: '#ddd', color: '#666' }}
          >
            Remove
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
