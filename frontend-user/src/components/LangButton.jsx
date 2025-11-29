import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, Tooltip } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LangButton = () => {
  const dispatch = useDispatch();
  const { lang, content } = useSelector((state) => state.lang);

  const toggleLang = () => {
    dispatch({ type: 'TOGGLE_LANG' });
  };

  return (
    <Tooltip
      title={lang === 'en' ? content.switchToArabic : content.switchToEnglish}
    >
      <IconButton
        onClick={toggleLang}
        sx={{
          color: 'gray',
          '&:hover': {
            backgroundColor: 'transparent !important',
            color: 'black',
          },
          '&:focus': {
            backgroundColor: 'transparent !important',
            outline: 'none',
          },
          '& .MuiTouchRipple-root': { display: 'none' },
        }}
      >
        <LanguageIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LangButton;