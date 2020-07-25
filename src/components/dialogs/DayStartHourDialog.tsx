import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { ClockView } from '@material-ui/pickers';

import CloseIcon from '@material-ui/icons/Close';

import { FadeTransition } from '@/components/common/Transitions';
import { AppState } from '@/store';
import { setDayStartHour } from '@/store/settings/actions';

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
}));

interface OwnProps {
  open: boolean,
  setOpen: (newValue: boolean) => void,
}
export type DayStartHourDialogProps = OwnProps;

const DayStartHourDialog: React.FC<DayStartHourDialogProps> = ({
  open, setOpen,
}) => {
  const classes = useStyles();
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
      <div id="about-dialog-title" className={classes.dialogTitle}>
        <Typography variant="h6">하루 시작 기준 시간 변경</Typography>
        <div className={classes.grow} />
        <Tooltip title="닫기">
          <IconButton onClick={onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      <DialogContent className={classes.dialogContent}>
        <ClockView
          type="hours"
          ampm={false}
          date={new Date(2010, 5, 30, dayStartHour)} // Only hour matters
          onHourChange={(date) => {
            if (date !== null) {
              dispatch(setDayStartHour(date.getHours()));
              setOpen(false);
            }
          }}
          onMinutesChange={() => {}}
          onSecondsChange={() => {}}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DayStartHourDialog;
