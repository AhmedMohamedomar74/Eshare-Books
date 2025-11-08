import { Card, CardMedia, CardContent, Typography, Button, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import notFoundImage from '/src/assets/not_foundimage.png';

export default function BookCardGrid({ book, onDelete, onView }) {
  const imageSrc = book.image || notFoundImage;

  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        width: '270px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          '& .delete-button': { opacity: 1, visibility: 'visible' },
        },
      }}
    >
      <IconButton
        className="delete-button"
        onClick={onDelete}
        aria-label={`Remove ${book.Title} from wishlist`}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: '#ffffffd2',
          color: '#d32f2f',
          borderRadius: '50%',
          width: 36,
          height: 36,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          opacity: 0,
          visibility: 'hidden',
          transition: 'opacity 0.2s, visibility 0.2s',
          zIndex: 2,
          '&:hover': { backgroundColor: '#f8d7da' },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      <CardMedia
        component="img"
        height="280"
        image={imageSrc}
        alt={book.Title}
        sx={{ objectFit: 'cover' }}
        loading="lazy"
      />

      <CardContent sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            mb: 0.5,
            color: '#000',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}
        >
          {book.Title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {book.TransactionType}
        </Typography>
        <Button
          variant="contained"
          fullWidth
          onClick={onView}
          sx={{
            backgroundColor: '#1976d2',
            textTransform: 'none',
            fontWeight: 'bold',
            py: 1,
            '&:hover': { backgroundColor: '#1565c0' },
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
