import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Linkify, { Props as LinkifyProps } from 'react-linkify';

import { useTheme } from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';

import DateRangeIcon from '@material-ui/icons/DateRange';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LabelIcon from '@material-ui/icons/Label';
import NotesIcon from '@material-ui/icons/Notes';
import PersonIcon from '@material-ui/icons/Person';
import PlaceIcon from '@material-ui/icons/Place';

import { AppState } from '@/store';
import { closeEventDetailDialog } from '@/store/detail-dialog/actions';
import { getDateString, rruleToText, getObjWithProp } from '@/utils';
import { eventCategoryList, voiceActorList, groupInfoList } from '@/commonData';

const linkifyDecorator: LinkifyProps['componentDecorator'] = (href, text, key) => (
  <a href={href} key={key} target="_blank" rel="noreferrer">
    {text}
  </a>
);

const Transition = React.forwardRef((
  props: TransitionProps & { children?: React.ReactElement<any, any>, },
  ref: React.Ref<unknown>,
) => <Slide direction="up" ref={ref} {...props} />); // eslint-disable-line react/jsx-props-no-spreading

const EventDetailDialog: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const open = useSelector((state: AppState) => state.detailDialog.open);
  const event = useSelector((state: AppState) => state.detailDialog.event);
  if (event === null) return null;

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

  const onCloseDialog = () => {
    dispatch(closeEventDetailDialog());
  };
  return (
    <Dialog
      open={open}
      onClose={onCloseDialog}
      scroll="paper"
      TransitionComponent={Transition}
      keepMounted
      fullScreen={isMobile}
      fullWidth
    >
      <DialogTitle id="event-dialog-title">{event.title}</DialogTitle>
      <DialogContent>
        <List dense disablePadding>
          {/* Date range */}
          <ListItem disableGutters>
            <ListItemIcon><DateRangeIcon /></ListItemIcon>
            <ListItemText
              primary={dateRangeStr}
              secondary={rruleToText(event.startTime, event.rrule)}
            />
          </ListItem>
          {/* Place */}
          <ListItem disableGutters>
            <ListItemIcon><PlaceIcon /></ListItemIcon>
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
            <ListItemIcon><NotesIcon /></ListItemIcon>
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
            <ListItemIcon><LabelIcon /></ListItemIcon>
            <ListItemText
              primary={getObjWithProp(eventCategoryList, 'id', event.categoryId)?.name}
            />
          </ListItem>
          {/* VA List */}
          <ListItem disableGutters>
            <ListItemIcon><PersonIcon /></ListItemIcon>
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
                      />
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </ListItem>
          {/* Is LoveLive */}
          <ListItem disableGutters>
            <ListItemIcon><FavoriteIcon /></ListItemIcon>
            <ListItemText
              primary={event.isLoveLive ? 'LoveLive! 관련' : 'LoveLive! 비관련'}
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseDialog} color="primary">닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailDialog;
