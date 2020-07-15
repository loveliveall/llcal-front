import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Linkify, { Props as LinkifyProps } from 'react-linkify';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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

const GridContainer: React.FC = ({ children }) => (
  <Grid container wrap="nowrap" spacing={2}>
    {children}
  </Grid>
);

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
      fullScreen={isMobile}
      fullWidth
    >
      <DialogTitle id="event-dialog-title">{event.title}</DialogTitle>
      <DialogContent>
        {/* Date range */}
        <GridContainer>
          <Grid item alignItems="center"><DateRangeIcon /></Grid>
          <Grid item>
            <Typography variant="body2">{dateRangeStr}</Typography>
            {event.rrule && (
              <Typography color="textSecondary" variant="body2">
                {rruleToText(event.startTime, event.rrule)}
              </Typography>
            )}
          </Grid>
        </GridContainer>
        {/* Place */}
        <GridContainer>
          <Grid item><PlaceIcon /></Grid>
          <Grid item>
            <Linkify componentDecorator={linkifyDecorator}>
              <Typography variant="body2">{event.place}</Typography>
            </Linkify>
          </Grid>
        </GridContainer>
        {/* Description */}
        <GridContainer>
          <Grid item><NotesIcon /></Grid>
          <Grid item>
            <Linkify componentDecorator={linkifyDecorator}>
              <Typography
                variant="body2"
                style={{ whiteSpace: 'pre-line' }}
              >
                {event.description}
              </Typography>
            </Linkify>
          </Grid>
        </GridContainer>
        {/* Category */}
        <GridContainer>
          <Grid item><LabelIcon /></Grid>
          <Grid item>
            <Typography variant="body2">{getObjWithProp(eventCategoryList, 'id', event.categoryId)?.name}</Typography>
          </Grid>
        </GridContainer>
        {/* VA List */}
        <GridContainer>
          <Grid item><PersonIcon /></Grid>
          <Grid item style={{ flex: 1 }}>
            <div style={{ maxHeight: 150, overflowY: 'auto', flex: 1 }}>
              <List dense disablePadding>
                {event.voiceActorIds.map((vaId) => {
                  const va = getObjWithProp(voiceActorList, 'id', vaId);
                  if (va === undefined) return null;
                  const group = getObjWithProp(groupInfoList, 'id', va.groupId);
                  if (group === undefined) return null; // We are guaranteed to find group
                  return (
                    <ListItem key={`detail-${vaId}`} disableGutters style={{ paddingTop: 0 }}>
                      <ListItemText
                        primary={`${va.name} (${group.name})`}
                        secondary={va.character}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </Grid>
        </GridContainer>
        {/* Is LoveLive */}
        <GridContainer>
          <Grid item><FavoriteIcon /></Grid>
          <Grid item>
            <Typography variant="body2">
              {event.isLoveLive ? 'LoveLive! 관련' : 'LoveLive! 비관련'}
            </Typography>
          </Grid>
        </GridContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseDialog} color="primary">닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailDialog;
