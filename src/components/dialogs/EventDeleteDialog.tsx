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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import { FadeTransition } from '@/components/common/Transitions';
import GridContainer from '@/components/common/GridContainer';

import {
  deleteEventAll,
  deleteEventOnlyThis,
  deleteEventAfter,
} from '@/api';

import { AppState } from '@/store';
import { clearToken } from '@/store/auth/actions';
import { closeEventDeleteDialog } from '@/store/delete-dialog/actions';
import { refreshHash } from '@/store/flags/actions';
import { openSnackbar } from '@/store/snackbar/actions';
import { isEqual } from 'date-fns';

const Backdrop = styled(MuiBackdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 10,
  color: '#fff',
}));

type DeleteRange = 'this' | 'after' | 'all';

const EventDeleteDialog: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: AppState) => state.auth.token);
  const open = useSelector((state: AppState) => state.deleteDialog.open);
  const targetEvent = useSelector((state: AppState) => state.deleteDialog.event);
  const [loading, setLoading] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const [deleteRange, setDeleteRange] = React.useState<null | DeleteRange>(null);

  React.useEffect(() => {
    setErrMsg('');
    setDeleteRange(null);
  }, [open]);

  if (token === null) return null;
  if (targetEvent === null) return null;

  const onDeleteClick = () => {
    if (targetEvent.rrule !== '' && deleteRange === null) {
      setErrMsg('적절한 삭제 범위를 반드시 선택해야 합니다');
    } else {
      setLoading(true);
      (async () => {
        // Business logic
        if (targetEvent.rrule === '' || deleteRange === 'all'
            || (deleteRange === 'after' && isEqual(targetEvent.dtstart, targetEvent.startTime))) {
          // Non repeat event, all delete, and after delete with initial event delete everything
          return deleteEventAll(token, targetEvent.serverId);
        }
        if (deleteRange === 'this') {
          const deleteOffset = (targetEvent.startTime.getTime() - targetEvent.dtstart.getTime()) / 1000;
          return deleteEventOnlyThis(token, targetEvent.serverId, deleteOffset);
        }
        if (deleteRange === 'after' && !isEqual(targetEvent.dtstart, targetEvent.startTime)) {
          const targetDuration = (targetEvent.endTime.getTime() - targetEvent.startTime.getTime()) / 1000;
          return deleteEventAfter(
            token,
            targetEvent.serverId, targetEvent.startTime, targetEvent.rrule, targetEvent.dtstart, targetDuration,
          );
        }
        return false;
      })().then((ok) => {
        setLoading(false);
        if (ok) {
          dispatch(refreshHash());
        } else {
          // Token expired
          dispatch(clearToken());
          dispatch(openSnackbar('토큰이 만료되었습니다. 로그아웃합니다.'));
        }
        dispatch(closeEventDeleteDialog());
      }).catch((e) => {
        setLoading(false);
        console.error(e);
        dispatch(openSnackbar('API 요청에 문제가 발생했습니다. 관리자에게 문의하세요.'));
      });
    }
  };
  const onCloseDialog = () => {
    dispatch(closeEventDeleteDialog());
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
      <DialogTitle>일정 삭제</DialogTitle>
      <DialogContent>
        {errMsg !== '' && (
          <Typography sx={{ color: 'red' }}>{errMsg}</Typography>
        )}
        {targetEvent.rrule !== '' && (
          <GridContainer>
            <Grid item xs={2}>
              <Typography>삭제 범위:</Typography>
            </Grid>
            <Grid item xs>
              <Select
                value={deleteRange === null ? 'None' : deleteRange}
                error={deleteRange === null}
                onChange={(e) => setDeleteRange(e.target.value as null | DeleteRange)}
              >
                <MenuItem value="None">선택해 주세요</MenuItem>
                <MenuItem value="this">이 일정만 삭제</MenuItem>
                <MenuItem value="after">이 일정 및 향후 일정 삭제</MenuItem>
                <MenuItem value="all">모든 반복 일정 삭제</MenuItem>
              </Select>
            </Grid>
          </GridContainer>
        )}
        <GridContainer>
          <Grid item xs>
            <Typography>{`정말로 일정 '${targetEvent.title}'을(를) 삭제하시겠습니까?`}</Typography>
          </Grid>
        </GridContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDeleteClick}>삭제</Button>
        <Button color="primary" onClick={onCloseDialog}>닫기</Button>
      </DialogActions>
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default EventDeleteDialog;
