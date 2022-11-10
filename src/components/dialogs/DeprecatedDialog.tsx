import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function DeprecatedDialog() {
  const [open, setOpen] = React.useState(localStorage.getItem('__seen') === null); // No key exists. First time to visit
  localStorage.setItem('__seen', 'y');

  return (
    <Dialog open={open}>
      <DialogTitle>캘린더 점검 알림</DialogTitle>
      <DialogContent>
        <Typography>2022.11.12.(토) 중 캘린더 점검을 실시할 예정입니다.</Typography>
        <Typography>자세한 사항은 <a href="https://gall.dcinside.com/sunshine/4949269">링크</a>를 참고하세요.</Typography>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={() => setOpen(false)}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeprecatedDialog;
