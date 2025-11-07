import { Button } from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useDispatch } from 'react-redux';
import { clearWishlist } from '../../redux/slices/wishlist.slice';

export default function ClearWishlistButton() {
  const dispatch = useDispatch();

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      dispatch(clearWishlist());
    }
  };

  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={<DeleteSweepIcon />}
      onClick={handleClear}
      sx={{
        borderRadius: 3,
        textTransform: 'none',
        px: 3,
        py: 1,
        fontWeight: 600,
        mt: 2,
        alignSelf: 'flex-end',
      }}
    >
      Clear Wishlist
    </Button>
  );
}
