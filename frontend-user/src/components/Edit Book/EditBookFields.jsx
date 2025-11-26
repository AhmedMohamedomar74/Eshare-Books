import React from 'react';
import { TextField, Box } from '@mui/material';
import SuggestCategoryButton from '../SuggestCategoryComponents/SuggestCategoryButton';

export default function EditBookFields({
  form,
  categories,
  type,
  fieldErrors,
  handleChange,
  validateField,
}) {
  return (
    <>
      {/* 🏷️ Title */}
      <TextField
        fullWidth
        label="Title"
        name="Title"
        value={form.Title}
        onChange={handleChange}
        onBlur={(e) => validateField('Title', e.target.value)}
        sx={{ mb: 2 }}
        error={Boolean(fieldErrors.Title)}
        helperText={fieldErrors.Title}
      />

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {/* 📂 Category Dropdown */}
        <TextField
          select
          fullWidth
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          onBlur={(e) => validateField('categoryId', e.target.value)}
          SelectProps={{ native: true }}
          sx={{ mb: 2 }}
          error={Boolean(fieldErrors.categoryId)}
          helperText={fieldErrors.categoryId}
        >
          <option value="" disabled>
            Select category
          </option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </TextField>

        {/* Suggest Button */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <SuggestCategoryButton />
        </Box>
      </Box>

      {/* 💰 Price (Sell) */}
      {type === 'toSale' && (
        <TextField
          fullWidth
          label="Price"
          name="Price"
          type="number"
          value={form.Price}
          onChange={handleChange}
          onBlur={(e) => validateField('Price', e.target.value)}
          sx={{ mb: 2 }}
          inputProps={{ min: 1 }}
          error={Boolean(fieldErrors.Price)}
          helperText={fieldErrors.Price}
        />
      )}

      {/* 📅 Price Per Day (Borrow) */}
      {type === 'toBorrow' && (
        <TextField
          fullWidth
          label="Price Per Day"
          name="PricePerDay"
          type="number"
          value={form.PricePerDay}
          onChange={handleChange}
          onBlur={(e) => validateField('PricePerDay', e.target.value)}
          sx={{ mb: 2 }}
          inputProps={{ min: 1 }}
          error={Boolean(fieldErrors.PricePerDay)}
          helperText={fieldErrors.PricePerDay}
        />
      )}

      {/* 📝 Description */}
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Description"
        name="Description"
        value={form.Description}
        onChange={handleChange}
        onBlur={(e) => validateField('Description', e.target.value)}
        sx={{ mb: 2 }}
        error={Boolean(fieldErrors.Description)}
        helperText={fieldErrors.Description}
      />
    </>
  );
}
