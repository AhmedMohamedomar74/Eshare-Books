import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import WishlistHeartButton from '../WishlistComponents/WishlistHeartButton';

const BookCard = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const imageUrl =
    typeof book.image === 'object'
      ? book.image.secure_url
      : book.image || book.Image;

  const title = book.title || book.Title || 'Untitled';
  const type = book.TransactionType || book.type || book.Type || 'Other';
  const price = book.price || book.Price || 0;
  const pricePerDay = book.PricePerDay || book.pricePerDay || 0; // سعر اليوم في حالة الاستعارة
  const description =
    book.description || book.Description || 'No description available.';
  const id = book._id || book.id;

  // 👇 ده الفلاغ اللي backend بيبعتُه لو الكتاب مستعار حاليًا
  const isBorrowedNow = book.isBorrowedNow;

  const getChipColor = (type) => {
    switch (type) {
      case 'toSale':
        return 'success';
      case 'toExchange':
        return 'info';
      case 'toDonate':
        return 'warning';
      case 'toBorrow':
        return 'primary';
      default:
        return 'default';
    }
  };

  const shortDescription =
    description.length > 70 ? description.slice(0, 70) + '...' : description;

  return (
    <Card
      sx={{
        position: 'relative',
        width: 290,
        height: 420,
        borderRadius: 3,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Report Flag */}
      {isHovered && (
        <Link
          to={`/reports/book/${book._id}`}
          style={{ textDecoration: 'none' }}
          title="report this book"
        >
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 10,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'white',
                transform: 'scale(1.1)',
              },
            }}
          >
            <OutlinedFlagIcon
              sx={{
                fontSize: 20,
                color: '#d32f2f',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#b71c1c' },
              }}
            />
          </Box>
        </Link>
      )}

      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          borderRadius: '50%',
          p: 0.4,
          width: 38,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'white',
            transform: 'scale(1.05)',
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <WishlistHeartButton bookId={book._id} />
      </Box>

      {/* الصورة */}
      <CardMedia
        component="img"
        image={
          imageUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
        }
        alt={title}
        sx={{
          height: 200,
          objectFit: 'contain',
          backgroundColor: '#f5f5f5',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />

      {/* المحتوى */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 2,
          pb: 2,
        }}
      >
        <Box>
          <Chip
            label={type}
            color={getChipColor(type)}
            size="small"
            sx={{ mb: 0.8, fontWeight: 500 }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              mb: 0.5,
              lineHeight: 1.3,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              fontSize: '0.85rem',
              minHeight: '38px',
              lineHeight: 1.3,
            }}
          >
            {shortDescription}
          </Typography>

          {/* السعر / حالة الإتاحة حسب نوع العملية */}
          {type === 'toSale' && (
            <Typography
              variant="subtitle1"
              color="success.main"
              sx={{ fontWeight: 500, mb: 1 }}
            >
              {price} EGP
            </Typography>
          )}

          {type === 'toBorrow' && (
            <Typography
              variant="subtitle2"
              color={isBorrowedNow ? 'error' : 'primary'}
              sx={{ fontWeight: 500, mb: 1 }}
            >
              {isBorrowedNow
                ? 'Not available now'
                : `${pricePerDay} EGP / day`}
            </Typography>
          )}

          {type !== 'toSale' && type !== 'toBorrow' && (
            <Box sx={{ height: '20px', mb: 1 }} />
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => navigate(`/details/${id}`)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            py: 1,
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;
