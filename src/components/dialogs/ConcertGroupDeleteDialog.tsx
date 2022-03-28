import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import MuiBackdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import { FadeTransition } from '@/components/common/Transitions';

import { deleteConcertGroup } from '@/api';

import { AppState } from '@/store';
import { clearToken } from '@/store/auth/actions';
import { refreshHash } from '@/store/flags/actions';
import { openSnackbar } from '@/store/snackbar/actions';
import { closeConcertDeleteDialog } from '@/store/concert-delete-dialog/actions';

const Backdrop = styled(MuiBackdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 10,
  color: '#fff',
}));

const ConcertGroupDeleteDialog: React.FC = () => {
  const dispatch = useDispatch();
  const open = useSelector((state: AppState) => state.concertDeleteDialog.open);
  const origConcert = useSelector((state: AppState) => state.concertDeleteDialog.concert);
  const token = useSelector((state: AppState) => state.auth.token);
  const [loading, setLoading] = React.useState(false);

  if (token === null) return null;
  if (origConcert === null) return null;

  const onDeleteClick = () => {
    setLoading(true);
    deleteConcertGroup(token, origConcert.id).then((ok) => {
      setLoading(false);
      if (ok) {
        dispatch(refreshHash());
      } else {
        // Token expired
        dispatch(clearToken());
        dispatch(openSnackbar('토큰이 만료되었습니다. 로그아웃합니다.'));
      }
      dispatch(closeConcertDeleteDialog());
    }).catch((e) => {
      setLoading(false);
      console.error(e);
      dispatch(openSnackbar('API 요청에 문제가 발생했습니다. 관리자에게 문의하세요.'));
    });
  };
  const onCloseDialog = () => {
    dispatch(closeConcertDeleteDialog());
  };
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          onCloseDialog();
        }
      }}
      scroll="paper"
      TransitionComponent={FadeTransition}
      keepMounted
      fullWidth
    >
      <DialogTitle>공연 정보 삭제</DialogTitle>
      <DialogContent>
        <Typography>정말로 해당 공연 정보를 삭제하시겠습니까?</Typography>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onDeleteClick}>삭제</Button>
        <Button color="primary" onClick={onCloseDialog}>닫기</Button>
      </DialogActions>
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default ConcertGroupDeleteDialog;
