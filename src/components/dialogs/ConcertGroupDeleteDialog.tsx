import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import { FadeTransition } from '@/components/common/Transitions';

import { deleteConcertGroup } from '@/api';

import { AppState } from '@/store';
import { clearToken } from '@/store/auth/actions';
import { refreshHash } from '@/store/flags/actions';
import { openSnackbar } from '@/store/snackbar/actions';
import { closeConcertDeleteDialog } from '@/store/concert-delete-dialog/actions';

const useStyles = makeStyles((theme: Theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 10,
    color: '#fff',
  },
  error: {
    color: 'red',
  },
}));

const ConcertGroupDeleteDialog: React.FC = () => {
  const classes = useStyles();
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
      onClose={onCloseDialog}
      scroll="paper"
      TransitionComponent={FadeTransition}
      keepMounted
      fullWidth
      disableBackdropClick
    >
      <DialogTitle>공연 정보 삭제</DialogTitle>
      <DialogContent>
        <Typography>정말로 해당 공연 정보를 삭제하시겠습니까?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDeleteClick}>삭제</Button>
        <Button color="primary" onClick={onCloseDialog}>닫기</Button>
      </DialogActions>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default ConcertGroupDeleteDialog;
