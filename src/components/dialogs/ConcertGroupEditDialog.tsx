import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import { styled } from '@mui/material/styles';
import MuiBackdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import MuiDialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

import useMobileCheck from '@/hooks/useMobileCheck';

import { FadeTransition } from '@/components/common/Transitions';

import { AppState } from '@/store';
import { refreshHash } from '@/store/flags/actions';
import { clearToken } from '@/store/auth/actions';
import { openSnackbar } from '@/store/snackbar/actions';
import { closeConcertEditDialog } from '@/store/concert-edit-dialog/actions';

import { addConcertGroup, editConcertGroup } from '@/api';
import { TitleEditor, EventIDListEditor } from './ConcertGroupEditDialogComp';
import { KeyedEventId } from './types';

const DialogTitle = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  alignItems: 'center',
}));
const DialogContent = styled(MuiDialogContent)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
}));
const Spacer = styled('div')`
  flex-grow: 1;
`;
const Backdrop = styled(MuiBackdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 10,
  color: '#fff',
}));

const ConcertGroupEditDialog: React.FC = () => {
  const dispatch = useDispatch();
  const isMobile = useMobileCheck();
  const token = useSelector((state: AppState) => state.auth.token);
  const open = useSelector((state: AppState) => state.concertEditDialog.open);
  const origConcert = useSelector((state: AppState) => state.concertEditDialog.concert);
  const [errMsg, setErrMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [mainEventIds, setMainEventIds] = React.useState<KeyedEventId[]>([]);
  const [subEventIds, setSubEventIds] = React.useState<KeyedEventId[]>([]);

  React.useEffect(() => {
    setErrMsg('');
    setTitle(origConcert === null ? '' : origConcert.title);
    setMainEventIds(origConcert === null ? [] : origConcert.mainEventIds.map((e) => ({
      key: uuid(),
      eventId: e,
    })));
    setSubEventIds(origConcert === null ? [] : origConcert.subEventIds.map((e) => ({
      key: uuid(),
      eventId: e,
    })));
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
        const m = mainEventIds.map((e) => e.eventId);
        const s = subEventIds.map((e) => e.eventId);
        if (origConcert === null) return addConcertGroup(token, title, m, s);
        return editConcertGroup(token, origConcert.id, title, m, s);
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
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          onCloseDialog();
        }
      }}
      scroll="paper"
      TransitionComponent={FadeTransition}
      fullScreen={isMobile}
      fullWidth
    >
      <DialogTitle id="event-dialog-title">
        <Typography variant="h6">{origConcert === null ? '새 공연 정보 생성' : '공연 정보 수정'}</Typography>
        <Spacer />
        <Tooltip title="저장" disableInteractive>
          <IconButton onClick={onSaveClick} disabled={loading}>
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="닫기" disableInteractive>
          <IconButton onClick={onCloseDialog} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        {errMsg !== '' && (
          <Typography sx={{ color: 'red' }}>{errMsg}</Typography>
        )}
        <TitleEditor
          title={title}
          setTitle={setTitle}
        />
        <EventIDListEditor
          compName="공연 정보"
          eventIdList={mainEventIds}
          setEventIdList={setMainEventIds}
        />
        <EventIDListEditor
          compName="관련 정보"
          eventIdList={subEventIds}
          setEventIdList={setSubEventIds}
        />
      </DialogContent>
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default ConcertGroupEditDialog;
