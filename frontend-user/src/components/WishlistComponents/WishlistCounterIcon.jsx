import { useSelector } from 'react-redux';
import { Badge } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function WishlistCounterIcon() {
  const count = useSelector((state) => state.wishlist?.items?.length || 0);

  return (
    <Badge
      badgeContent={count}
      color="error"
      overlap="circular"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        '& .MuiBadge-badge': {
          fontSize: '0.65rem',
          minWidth: '18px',
          height: '18px',
        },
      }}
    >
      <FavoriteIcon fontSize="small" />
    </Badge>
  );
}
