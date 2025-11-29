import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Alert,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useDispatch, useSelector } from 'react-redux';
import {
  createSuggestCategory,
  clearSuggestCategoryMessage,
} from '../../redux/slices/suggestCategory.slice';

const SuggestCategoryButton = () => {
  const dispatch = useDispatch();
  const { loading, successMessage, error } = useSelector((state) => state.suggestCategory);
  const { content } = useSelector((state) => state.lang);

  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateInput = (value) => {
    if (/\d/.test(value)) {
      return content.noNumbersError || 'Category name cannot contain numbers';
    }

    if (value.trim().length > 0 && value.trim().length < 3) {
      return content.minCharactersError || 'Category name must be at least 3 characters';
    }

    if (value.length > 50) {
      return content.maxCharactersError || 'Category name must not exceed 50 characters';
    }

    return '';
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (/\d/.test(value)) {
      return;
    }

    if (value.length > 50) {
      return;
    }

    setCategoryName(value);
    setValidationError(validateInput(value));
  };

  const handleSubmit = async () => {
    const trimmedName = categoryName.trim();
    const error = validateInput(trimmedName);

    if (error) {
      setValidationError(error);
      return;
    }

    if (trimmedName.length < 3) {
      setValidationError(
        content.minCharactersError || 'Category name must be at least 3 characters'
      );
      return;
    }

    await dispatch(createSuggestCategory({ name: trimmedName }));
  };

  const handleClose = () => {
    setIsOpen(false);
    setCategoryName('');
    setValidationError('');
    dispatch(clearSuggestCategoryMessage());
  };

  const handleOpen = () => {
    setIsOpen(true);
    dispatch(clearSuggestCategoryMessage());
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  }, [successMessage]);

  const isValid = categoryName.trim().length >= 3;
  const hasNoNumbers = !/\d/.test(categoryName);
  const isWithinLimit = categoryName.length <= 50;

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpen}
        sx={{
          minWidth: '140px',
          height: '56px',
          whiteSpace: 'nowrap',
        }}
      >
        {content.suggest || 'Suggest'}
      </Button>

      <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {content.suggestCategoryTitle || 'Suggest a Category'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {content.suggestCategoryDescription ||
                'Help us improve by suggesting a new book category'}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {loading && <LinearProgress sx={{ mb: 2 }} />}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label={content.categoryName || 'Category Name'}
            placeholder={content.categoryPlaceholder || 'e.g., Science Fiction, History...'}
            value={categoryName}
            onChange={handleInputChange}
            error={Boolean(validationError)}
            helperText={
              validationError || `${categoryName.length}/50 ${content.characters || 'characters'}`
            }
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              {content.requirements || 'Requirements'}:
            </Typography>
            <List dense disablePadding>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {isValid ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={content.atLeastThreeChars || 'At least 3 characters'}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: isValid ? 'success.main' : 'text.secondary',
                  }}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {hasNoNumbers ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={content.noNumbers || 'No numbers allowed'}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: hasNoNumbers ? 'success.main' : 'text.secondary',
                  }}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {isWithinLimit ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={content.maxFiftyChars || 'Maximum 50 characters'}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: isWithinLimit ? 'success.main' : 'text.secondary',
                  }}
                />
              </ListItem>
            </List>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            {content.cancel || 'Cancel'}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || validationError || categoryName.trim().length < 3}
          >
            {loading
              ? content.submitting || 'Submitting...'
              : content.submitSuggestion || 'Submit Suggestion'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SuggestCategoryButton;
