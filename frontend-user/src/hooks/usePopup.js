import { useState } from "react";

export const usePopup = () => {
  const [popup, setPopup] = useState({
    show: false,
    type: '', // 'success', 'error', 'warning'
    message: ''
  });

  const showPopup = (type, message) => {
    setPopup({
      show: true,
      type,
      message
    });
  };

  const hidePopup = () => {
    setPopup({
      show: false,
      type: '',
      message: ''
    });
  };

  return {
    popup,
    showPopup,
    hidePopup,
  };
};