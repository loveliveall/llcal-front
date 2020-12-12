import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import useMobileCheck from '@/hooks/useMobileCheck';

import GridContainer from '@/components/common/GridContainer';
import { FadeTransition } from '@/components/common/Transitions';

import { AppState } from '@/store';
import { refreshHash } from '@/store/flags/actions';
import { clearToken } from '@/store/auth/actions';
import { openSnackbar } from '@/store/snackbar/actions';
import { closeConcertEditDialog } from '@/store/concert-edit-dialog/actions';

import { addConcertGroup, editConcertGroup } from '@/api';
import { TitleEditor } from './EventEditDialogComp';

const useStyles = makeStyles((theme: Theme) => ({
  dialogTitle: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    alignItems: 'center',
  },
  dialogContent: {
    paddingBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  error: {
    color: 'red',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 10,
    color: '#fff',
  },
}));

const ConcertGroupEditDialog: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMobile = useMobileCheck();
  const token = useSelector((state: AppState) => state.auth.token);
  const open = useSelector((state: AppState) => state.concertEditDialog.open);
  const origConcert = useSelector((state: AppState) => state.concertEditDialog.concert);
  const [errMsg, setErrMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [mainEventIds, setMainEventIds] = React.useState('');
  const [subEventIds, setSubEventIds] = React.useState('');

  React.useEffect(() => {
    setErrMsg('');
    setTitle(origConcert === null ? '' : origConcert.title);
    setMainEventIds(origConcert === null ? '' : origConcert.mainEventIds.join(','));
    setSubEventIds(origConcert === null ? '' : origConcert.subEventIds.join(','));
  }, [open]);

  if (token === null) return null;

  const onCloseDialog = () => {
    dispatch(closeConcertEditDialog());
  };
  const onSaveClick = () => {
    if (title === '') {
      setErrMsg('제목이 반드시 필요합니다');
    } else if (mainEventIds.length === 0) {
      setErrMsg('공연 일정은 반드시 하나 이상 있어야 합니다');
    } else {
      (async () => {
        if (origConcert === null) return addConcertGroup(token, title, mainEventIds.split(','), subEventIds.split(','));
        return editConcertGroup(token, origConcert.id, title, mainEventIds.split(','), subEventIds.split(','));
      })().then((ok) => {
        setLoading(false);
        if (ok) {
          dispatch(refreshHash());
        } else {
          // Token expired
          dispatch(clearToken());
          dispatch(openSnackbar('토큰이 만료되었습니다. 로그아웃합니다.'));
        }
        dispatch(closeConcertEditDialog());
      }).catch((e) => {
        setLoading(false);
        console.error(e);
        dispatch(openSnackbar('API 요청에 문제가 발생했습니다. 관리자에게 문의하세요.'));
      });
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onCloseDialog}
      scroll="paper"
      TransitionComponent={FadeTransition}
      fullScreen={isMobile}
      fullWidth
      disableBackdropClick
    >
      <div id="event-dialog-title" className={classes.dialogTitle}>
        <Typography variant="h6">{origConcert === null ? '새 공연 정보 생성' : '공연 정보 수정'}</Typography>
        <div className={classes.grow} />
        <Tooltip title="저장">
          <IconButton onClick={onSaveClick} disabled={loading}>
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="닫기">
          <IconButton onClick={onCloseDialog} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      <DialogContent className={classes.dialogContent}>
        {errMsg !== '' && (
          <Typography className={classes.error}>{errMsg}</Typography>
        )}
        <TitleEditor
          title={title}
          setTitle={setTitle}
        />
        <GridContainer>
          <Grid item xs={2}>
            <Typography>공연 일정 ID</Typography>
          </Grid>
          <Grid item xs>
            <Input
              id="mainEventId"
              value={mainEventIds}
              error={mainEventIds === ''}
              onChange={(e) => setMainEventIds(e.target.value)}
              fullWidth
              inputProps={{
                autoCapitalize: 'none',
                autoCorrect: 'off',
              }}
            />
          </Grid>
        </GridContainer>
        <GridContainer>
          <Grid item xs={2}>
            <Typography>관련 일정 ID</Typography>
          </Grid>
          <Grid item xs>
            <Input
              id="subEventId"
              value={subEventIds}
              onChange={(e) => setSubEventIds(e.target.value)}
              fullWidth
              inputProps={{
                autoCapitalize: 'none',
                autoCorrect: 'off',
              }}
            />
          </Grid>
        </GridContainer>
      </DialogContent>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default ConcertGroupEditDialog;
