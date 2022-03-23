import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Snackbar from '@mui/material/Snackbar';

import { AppState } from '@/store';
import { closeSnackbar } from '@/store/snackbar/actions';

const GlobalSnackbar: React.FC = () => {
  const dispatch = useDispatch();
  const open = useSelector((state: AppState) => state.snackbar.open);
  const text = useSelector((state: AppState) => state.snackbar.text);

  const onSnackbarClose = () => {
    dispatch(closeSnackbar());
  };
  return (
    <Snackbar
      open={open}
      message={text}
      autoHideDuration={3000}
      onClose={onSnackbarClose}
    />
  );
};

export default GlobalSnackbar;
