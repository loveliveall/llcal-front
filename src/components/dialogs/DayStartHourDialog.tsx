import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import MuiDialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ClockPicker from '@mui/lab/ClockPicker';

import CloseIcon from '@mui/icons-material/Close';

import { FadeTransition } from '@/components/common/Transitions';
import { AppState } from '@/store';
import { setDayStartHour } from '@/store/settings/actions';

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

interface OwnProps {
  open: boolean,
  setOpen: (newValue: boolean) => void,
}
export type DayStartHourDialogProps = OwnProps;

const DayStartHourDialog: React.FC<DayStartHourDialogProps> = ({
  open, setOpen,
}) => {
  const dispatch = useDispatch();
  const dayStartHour = useSelector((state: AppState) => state.settings.dayStartHour);

  const onCloseDialog = () => {
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onClose={onCloseDialog}
      scroll="paper"
      TransitionComponent={FadeTransition}
      fullWidth
    >
      <DialogTitle id="about-dialog-title">
        <Typography variant="h6">하루 시작 기준 시간 변경</Typography>
        <Spacer />
        <Tooltip title="닫기">
          <IconButton onClick={onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        <ClockPicker
          ampm={false}
          date={new Date(2010, 5, 30, dayStartHour)} // Only hour matters
          onChange={(date) => {
            if (date !== null) {
              dispatch(setDayStartHour(date.getHours()));
              setOpen(false);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DayStartHourDialog;
