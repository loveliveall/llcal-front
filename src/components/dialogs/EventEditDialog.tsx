import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import TitleIcon from '@material-ui/icons/Title';

import { SlideUpTransition } from '@/components/common/Transitions';

import useMobileCheck from '@/hooks/useMobileCheck';

import { AppState } from '@/store';
import { closeEventEditDialog } from '@/store/edit-dialog/actions';

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

const EventEditDialog: React.FC = () => {
  const classes = useStyles();
  const isMobile = useMobileCheck();
  const dispatch = useDispatch();
  const open = useSelector((state: AppState) => state.editDialog.open);
  const origEvent = useSelector((state: AppState) => state.editDialog.event);

  const onCloseDialog = () => {
    dispatch(closeEventEditDialog());
  };
  const onSaveClick = () => {
    console.log('Save! do here!');
  };
  return (
    <Dialog
      open={open}
      onClose={onCloseDialog}
      scroll="paper"
      TransitionComponent={SlideUpTransition}
      keepMounted
      fullScreen={isMobile}
      fullWidth
      disableBackdropClick
    >
      <div id="event-dialog-title" className={classes.dialogTitle}>
        <Typography variant="h6">{origEvent === null ? '새 일정 생성' : '일정 수정'}</Typography>
        <div className={classes.grow} />
        <Tooltip title="저장">
          <IconButton onClick={onSaveClick}>
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="닫기">
          <IconButton onClick={onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      <DialogContent className={classes.dialogContent}>
        <List dense disablePadding>
          {/* Title */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="제목" arrow><TitleIcon /></Tooltip>
            </ListItemIcon>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default EventEditDialog;
