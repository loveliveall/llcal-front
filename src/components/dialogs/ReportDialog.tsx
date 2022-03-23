import React from 'react';
import { useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import MuiBackdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '@mui/material/Input';

import { FadeTransition } from '@/components/common/Transitions';
import { sendReport } from '@/api';

import { openSnackbar } from '@/store/snackbar/actions';

const Backdrop = styled(MuiBackdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 10,
  color: '#fff',
}));

interface OwnProps {
  open: boolean,
  setOpen: (newValue: boolean) => void,
}
export type ReportDialogProps = OwnProps;

const ReportDialog: React.FC<ReportDialogProps> = ({
  open, setOpen,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [content, setContent] = React.useState('');

  React.useEffect(() => {
    setContent('');
  }, [open]);

  const onSendClick = () => {
    if (content !== '') {
      setLoading(true);
      sendReport(content).then(() => {
        setLoading(false);
        setOpen(false);
        dispatch(openSnackbar('요청 전송 완료'));
      });
    }
  };
  const onCloseDialog = () => {
    setOpen(false);
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
      <DialogTitle>일정 추가 요청</DialogTitle>
      <DialogContent>
        <Input
          id="report"
          value={content}
          error={content === ''}
          placeholder="추가하고 싶은 일정에 대한 정보를 적어주세요. 해당 일정에 대한 공지 링크(공식 사이트, 트위터 등) 정보가 있으면 더 정확하게 추가할 수 있습니다"
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          inputProps={{
            autoCapitalize: 'none',
            autoCorrect: 'off',
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onSendClick}>보내기</Button>
        <Button color="primary" onClick={onCloseDialog}>닫기</Button>
      </DialogActions>
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default ReportDialog;
