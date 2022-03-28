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
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { FadeTransition } from '@/components/common/Transitions';
import GridContainer from '@/components/common/GridContainer';

import { duplicateEvent } from '@/api';

import { AppState } from '@/store';
import { clearToken } from '@/store/auth/actions';
import { closeEventDuplicateDialog } from '@/store/duplicate-dialog/actions';
import { refreshHash } from '@/store/flags/actions';
import { openSnackbar } from '@/store/snackbar/actions';

const Backdrop = styled(MuiBackdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 10,
  color: '#fff',
}));

const EventDuplicateDialog: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: AppState) => state.auth.token);
  const open = useSelector((state: AppState) => state.duplicateDialog.open);
  const targetEvent = useSelector((state: AppState) => state.duplicateDialog.event);
  const [loading, setLoading] = React.useState(false);
  const [keepExceptions, setKeepExceptions] = React.useState(false);

  React.useEffect(() => {
    setKeepExceptions(false);
  }, [open]);

  if (token === null) return null;
  if (targetEvent === null) return null;

  const onKeepExceptionsToggle = () => {
    setKeepExceptions(!keepExceptions);
  };
  const onDuplicateClick = () => {
    setLoading(true);
    duplicateEvent(token, targetEvent.serverId, keepExceptions).then((ok) => {
      setLoading(false);
      if (ok) {
        dispatch(refreshHash());
      } else {
        // Token expired
        dispatch(clearToken());
        dispatch(openSnackbar('토큰이 만료되었습니다. 로그아웃합니다.'));
      }
      dispatch(closeEventDuplicateDialog());
    });
  };
  const onCloseDialog = () => {
    dispatch(closeEventDuplicateDialog());
  };
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') onCloseDialog();
      }}
      scroll="paper"
      TransitionComponent={FadeTransition}
      keepMounted
      fullWidth
    >
      <DialogTitle>일정 복제</DialogTitle>
      <DialogContent>
        <GridContainer>
          <Grid item xs>
            <Typography>{`일정 '${targetEvent.title}'을/를 복제합니다`}</Typography>
          </Grid>
        </GridContainer>
        {targetEvent.rrule !== '' && (
          <GridContainer>
            <Grid item xs={3}>
              <Typography>반복 예외 유지:</Typography>
            </Grid>
            <Grid item xs>
              <Switch
                checked={keepExceptions}
                onChange={onKeepExceptionsToggle}
                color="primary"
              />
            </Grid>
          </GridContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onDuplicateClick}>복제</Button>
        <Button color="primary" onClick={onCloseDialog}>닫기</Button>
      </DialogActions>
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default EventDuplicateDialog;
