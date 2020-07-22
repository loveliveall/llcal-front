import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Linkify, { Props as LinkifyProps } from 'react-linkify';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LabelIcon from '@material-ui/icons/Label';
import NotesIcon from '@material-ui/icons/Notes';
import PersonIcon from '@material-ui/icons/Person';
import PlaceIcon from '@material-ui/icons/Place';
import RepeatIcon from '@material-ui/icons/Repeat';

import { FadeTransition } from '@/components/common/Transitions';

import useMobileCheck from '@/hooks/useMobileCheck';

import { AppState } from '@/store';
import { openEventDeleteDialog } from '@/store/delete-dialog/actions';
import { closeEventDetailDialog } from '@/store/detail-dialog/actions';
import { openEventDuplicateDialog } from '@/store/duplicate-dialog/actions';
import { openEventEditDialog } from '@/store/edit-dialog/actions';
import { getDateString, rruleToText, getObjWithProp } from '@/utils';
import { eventCategoryList, voiceActorList, groupInfoList } from '@/commonData';

const linkifyDecorator: LinkifyProps['componentDecorator'] = (href, text, key) => (
  <a href={href} key={key} target="_blank" rel="noreferrer">
    {text}
  </a>
);

const useStyles = makeStyles((theme: Theme) => ({
  dialogTitle: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    alignItems: 'center',
    wordBreak: 'keep-all',
  },
  buttonDiv: {
    display: 'flex',
    width: '100%',
  },
  button: {
    flexGrow: 1,
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  dialogContent: {
    paddingBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
}));

const EventDetailDialog: React.FC = () => {
  const classes = useStyles();
  const isMobile = useMobileCheck();
  const dispatch = useDispatch();
  const authorized = useSelector((state: AppState) => state.auth.token !== null);
  const open = useSelector((state: AppState) => state.detailDialog.open);
  const event = useSelector((state: AppState) => state.detailDialog.event);
  if (event === null) return null;
  const category = getObjWithProp(eventCategoryList, 'id', event.categoryId);

  const { startTime, endTime } = event;
  const startDateStr = getDateString(startTime);
  const endDateStr = getDateString(endTime);
  const dateRangeStr = (() => {
    if (event.allDay) {
      if (startDateStr === endDateStr) return startDateStr;
      return `${startDateStr} - ${endDateStr}`;
    }
    const startTimeStr = `${`0${startTime.getHours()}`.slice(-2)}:${`0${startTime.getMinutes()}`.slice(-2)}`;
    const endTimeStr = `${`0${endTime.getHours()}`.slice(-2)}:${`0${endTime.getMinutes()}`.slice(-2)}`;
    if (startTime.getTime() === endTime.getTime()) {
      return `${startDateStr} ${startTimeStr}`;
    }
    if (startDateStr === endDateStr) {
      return `${startDateStr} ${startTimeStr} - ${endTimeStr}`;
    }
    return `${startDateStr} ${startTimeStr} - ${endDateStr} ${endTimeStr}`;
  })();

  const onDeleteClick = () => {
    dispatch(closeEventDetailDialog());
    dispatch(openEventDeleteDialog(event));
  };
  const onDuplicateClick = () => {
    dispatch(closeEventDetailDialog());
    dispatch(openEventDuplicateDialog(event));
  };
  const onEditClick = () => {
    dispatch(closeEventDetailDialog());
    dispatch(openEventEditDialog(event));
  };
  const onCloseDialog = () => {
    dispatch(closeEventDetailDialog());
  };
  return (
    <Dialog
      open={open}
      onClose={onCloseDialog}
      scroll="paper"
      TransitionComponent={FadeTransition}
      keepMounted
      fullScreen={isMobile}
      fullWidth
    >
      <div id="event-dialog-title" className={classes.dialogTitle}>
        <Typography variant="h6">{event.title}</Typography>
        <div className={classes.grow} />
        <Tooltip title="닫기">
          <IconButton onClick={onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      <DialogContent className={classes.dialogContent}>
        {authorized && category?.frozen === false && (
          <div className={classes.buttonDiv}>
            <Button
              className={classes.button}
              variant="outlined"
              onClick={onDeleteClick}
              startIcon={<DeleteIcon />}
              style={{
                color: 'red',
                border: '1px solid red',
              }}
            >
              삭제
            </Button>
            <Button
              className={classes.button}
              color="secondary"
              variant="outlined"
              onClick={onDuplicateClick}
              startIcon={<FileCopyIcon />}
            >
              복제
            </Button>
            <Button
              className={classes.button}
              variant="outlined"
              onClick={onEditClick}
              startIcon={<EditIcon />}
            >
              수정
            </Button>
          </div>
        )}
        <List dense disablePadding>
          {/* Date range */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="시간" arrow><DateRangeIcon /></Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={dateRangeStr}
              secondary={rruleToText(event.startTime, event.rrule)}
            />
          </ListItem>
          {/* Place */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="장소" arrow><PlaceIcon /></Tooltip>
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={(
                <Linkify componentDecorator={linkifyDecorator}>
                  <Typography variant="body2">{event.place}</Typography>
                </Linkify>
              )}
            />
          </ListItem>
          {/* Description */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="상세 설명" arrow><NotesIcon /></Tooltip>
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={(
                <Linkify componentDecorator={linkifyDecorator}>
                  <Typography
                    variant="body2"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {event.description}
                  </Typography>
                </Linkify>
              )}
            />
          </ListItem>
          {/* Category */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="분류" arrow><LabelIcon /></Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={category?.name}
            />
          </ListItem>
          {/* VA List */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="관련 성우" arrow><PersonIcon /></Tooltip>
            </ListItemIcon>
            <div style={{ maxHeight: 150, overflowY: 'auto', flex: 1 }}>
              <List dense disablePadding>
                {event.voiceActorIds.map((vaId) => {
                  const va = getObjWithProp(voiceActorList, 'id', vaId);
                  if (va === undefined) return null;
                  const group = getObjWithProp(groupInfoList, 'id', va.groupId);
                  if (group === undefined) return null; // We are guaranteed to find group
                  return (
                    <ListItem key={`detail-${vaId}`} disableGutters>
                      <ListItemText
                        primary={`${va.name} (${group.name})`}
                        secondary={va.character}
                        secondaryTypographyProps={{
                          variant: 'caption',
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </ListItem>
          {/* Is LoveLive */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="러브라이브 관련 여부" arrow><FavoriteIcon /></Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={event.isLoveLive ? 'LoveLive! 관련' : 'LoveLive! 비관련'}
            />
          </ListItem>
          {/* Is Repeating */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="정기 일정 여부" arrow><RepeatIcon /></Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={event.isRepeating ? '정기 일정' : '비정기 일정'}
            />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailDialog;
