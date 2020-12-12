import React from 'react';
import { v4 as uuid } from 'uuid';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';

import GridContainer from '@/components/common/GridContainer';

import { getEventsByIds } from '@/api';
import { KeyedEventId } from './types';

export type TitleEditorProps = {
  title: string,
  setTitle: (newValue: string) => void,
};
const TitleEditorComp: React.FC<TitleEditorProps> = ({
  title, setTitle,
}) => (
  <GridContainer>
    <Grid item xs={2}>
      <Typography>제목</Typography>
    </Grid>
    <Grid item xs>
      <Input
        id="title"
        value={title}
        error={title === ''}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        inputProps={{
          autoCapitalize: 'none',
          autoCorrect: 'off',
        }}
      />
    </Grid>
  </GridContainer>
);
export const TitleEditor = TitleEditorComp;

export type EventIDListEditorProps = {
  compName: string,
  eventIdList: KeyedEventId[],
  setEventIdList: (newV: KeyedEventId[]) => void,
};
const EventIDListEditorComp: React.FC<EventIDListEditorProps> = ({
  compName, eventIdList, setEventIdList,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [events, setEvents] = React.useState<{
    key: string,
    eventId: string,
    eventTitle: string,
  }[]>([]);
  const [newEventId, setNewEventId] = React.useState('');

  React.useEffect(() => {
    setLoading(true);
    getEventsByIds(eventIdList.map((e) => e.eventId)).then((data) => {
      setEvents(eventIdList.map((ev) => ({
        key: ev.key,
        eventId: ev.eventId,
        eventTitle: data.find((v) => v.serverId === ev.eventId)?.title ?? 'NOT FOUND',
      })));
    }).catch((e) => {
      console.error(e);
      setEvents(eventIdList.map((ev) => ({
        key: ev.key,
        eventId: ev.eventId,
        eventTitle: 'NOT FOUND',
      })));
    }).finally(() => {
      setLoading(false);
    });
  }, [eventIdList]);

  const onItemDeleteClick = (key: string) => {
    setEventIdList(eventIdList.filter((e) => e.key !== key));
  };
  const onAddClick = () => {
    if (newEventId !== '') {
      setEventIdList([...eventIdList, {
        key: uuid(),
        eventId: newEventId,
      }]);
      setNewEventId('');
    }
  };
  return (
    <GridContainer>
      <Grid item xs={2}>
        <Typography>{compName}</Typography>
      </Grid>
      <Grid item xs>
        {loading ? (
          <CircularProgress />
        ) : (
          <List dense>
            {events.map((ev) => (
              <ListItem key={ev.key}>
                <ListItemText
                  primary={ev.eventTitle}
                  secondary={ev.eventId}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => onItemDeleteClick(ev.key)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
        <Input
          id="new-event-id"
          value={newEventId}
          onChange={(e) => setNewEventId(e.target.value)}
          fullWidth
          inputProps={{
            autoCapitalize: 'none',
            autoCorrect: 'off',
          }}
        />
        <Button onClick={onAddClick}>추가</Button>
      </Grid>
    </GridContainer>
  );
};
export const EventIDListEditor = EventIDListEditorComp;
