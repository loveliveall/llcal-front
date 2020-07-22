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
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import { FadeTransition } from '@/components/common/Transitions';
import GridContainer from '@/components/common/GridContainer';

import { duplicateEvent } from '@/api';

import { AppState } from '@/store';
import { clearToken } from '@/store/auth/actions';
import { closeEventDuplicateDialog } from '@/store/duplicate-dialog/actions';
import { refreshHash } from '@/store/flags/actions';
import { openSnackbar } from '@/store/snackbar/actions';

const useStyles = makeStyles((theme: Theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 10,
    color: '#fff',
  },
  error: {
    color: 'red',
  },
}));

const EventDuplicateDialog: React.FC = () => {
  const classes = useStyles();
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
      onClose={onCloseDialog}
      scroll="paper"
      TransitionComponent={FadeTransition}
      keepMounted
      fullWidth
      disableBackdropClick
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
            <Grid item xs>
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
        <Button onClick={onDuplicateClick}>복제</Button>
        <Button color="primary" onClick={onCloseDialog}>닫기</Button>
      </DialogActions>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default EventDuplicateDialog;
