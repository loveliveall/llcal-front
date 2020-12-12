import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import addYears from 'date-fns/addYears';
import startOfDay from 'date-fns/startOfDay';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel, { ExpansionPanelProps } from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetail from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelAction from '@material-ui/core/ExpansionPanelActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EventBusyIcon from '@material-ui/icons/EventBusy';

import { DIMMED_FILTER } from '@/components/calendar/utils/utils';
import { AppState } from '@/store';
import { openConcertDeleteDialog } from '@/store/concert-delete-dialog/actions';
import { openConcertEditDialog } from '@/store/concert-edit-dialog/actions';
import { openSnackbar } from '@/store/snackbar/actions';
import { getDateRangeStr, getObjWithProp } from '@/utils';
import {
  ClientConcertGroup,
  ClientEvent,
  VACheckState,
  ETCCheckState,
} from '@/types';
import { voiceActorList } from '@/commonData';
import { getConcertGroups, getEventsByIds } from '@/api';

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%',
  },
  padded: {
    padding: theme.spacing(1),
  },
  paddedCenter: {
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
  textSecondary: {
    color: theme.palette.text.secondary,
    fontSize: 'small',
  },
}));

const CentralCircularProgress: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.paddedCenter}>
      <CircularProgress />
    </div>
  );
};

interface EventListProps {
  isLoading: boolean,
  events: ClientEvent[],
  onEventClick: (event: ClientEvent) => void,
}

const EventList: React.FC<EventListProps> = ({
  isLoading, events, onEventClick,
}) => {
  const classes = useStyles();
  const now = new Date();
  if (isLoading) {
    return <CentralCircularProgress />;
  }
  if (events.length === 0) {
    return (
      <div className={classes.paddedCenter}>
        <div style={{ textAlign: 'center' }}>
          <EventBusyIcon fontSize="large" color="inherit" />
          <Typography>일정 미등록</Typography>
        </div>
      </div>
    );
  }
  return (
    <List dense>
      {events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()).map((ev) => (
        <ListItem key={ev.id} button onClick={() => onEventClick(ev)}>
          <ListItemText
            style={{
              filter: ev.endTime <= now ? DIMMED_FILTER : undefined,
            }}
            primary={ev.title}
            secondary={getDateRangeStr(ev.startTime, ev.endTime, ev.allDay)}
          />
        </ListItem>
      ))}
    </List>
  );
};

interface SingleConcertProps {
  concert: ClientConcertGroup,
  onEventClick: (event: ClientEvent) => void,
}

const SingleConcert: React.FC<SingleConcertProps> = ({
  concert, onEventClick,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    title, mainEventIds, subEventIds, startTime, endTime, isLoveLive, voiceActorIds,
  } = concert;
  const authorized = useSelector((state: AppState) => state.auth.token !== null);
  const [expanded, setExpanded] = React.useState(false);
  const [mainEventLoading, setMainEventLoading] = React.useState(false);
  const [subEventLoading, setSubEventLoading] = React.useState(false);
  const [mainEvents, setMainEvents] = React.useState<ClientEvent[]>([]);
  const [subEvents, setSubEvents] = React.useState<ClientEvent[]>([]);

  React.useEffect(() => {
    if (expanded) {
      setMainEventLoading(true);
      getEventsByIds(mainEventIds).then(
        (data) => setMainEvents(data),
      ).catch((e) => {
        console.error(e);
        dispatch(openSnackbar('일정 불러오기를 실패했습니다.'));
      }).finally(() => {
        setMainEventLoading(false);
      });

      if (subEventIds.length !== 0) {
        setSubEventLoading(true);
        getEventsByIds(subEventIds).then(
          (data) => setSubEvents(data),
        ).catch((e) => {
          console.error(e);
          dispatch(openSnackbar('일정 불러오기를 실패했습니다.'));
        }).finally(() => {
          setSubEventLoading(false);
        });
      }
    }
  }, [expanded]);

  const onPanelChange: ExpansionPanelProps['onChange'] = (_, isExpanded) => {
    setExpanded(isExpanded);
  };
  const prefix = isLoveLive ? '[LoveLive!] ' : '';

  return (
    <ExpansionPanel expanded={expanded} onChange={onPanelChange}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <div>
          <Typography>{`${prefix}${title}`}</Typography>
          <Typography className={classes.textSecondary}>{getDateRangeStr(startTime, endTime, false)}</Typography>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetail>
        <div className={classes.fullWidth}>
          <div>
            <Typography variant="h6">출연 성우</Typography>
            <div className={classes.padded}>
              <Typography>
                {voiceActorIds.sort((a, b) => a - b).map(
                  (va) => getObjWithProp(voiceActorList, 'id', va)?.name,
                ).filter((e) => e !== undefined).join(', ')}
              </Typography>
            </div>
          </div>
          <div>
            <Typography variant="h6">이벤트 일정 목록</Typography>
            <EventList
              isLoading={mainEventLoading}
              events={mainEvents}
              onEventClick={onEventClick}
            />
          </div>
          <div>
            <Typography variant="h6">관련 일정 목록 (티켓 등)</Typography>
            <EventList
              isLoading={subEventLoading}
              events={subEvents}
              onEventClick={onEventClick}
            />
          </div>
        </div>
      </ExpansionPanelDetail>
      {authorized && (
        <ExpansionPanelAction>
          <Button onClick={() => dispatch(openConcertEditDialog(concert))}>수정</Button>
          <Button onClick={() => dispatch(openConcertDeleteDialog(concert))} color="primary">삭제</Button>
        </ExpansionPanelAction>
      )}
    </ExpansionPanel>
  );
};

interface ConcertProps {
  vaFilter: VACheckState,
  etcFilter: ETCCheckState,
  onEventClick: (event: ClientEvent) => void,
}

const Concert: React.FC<ConcertProps> = ({
  vaFilter, etcFilter, onEventClick,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const authorized = useSelector((state: AppState) => state.auth.token !== null);
  const refreshFlag = useSelector((state: AppState) => state.flags.refreshFlag);
  const [currRefreshFlag, setCurrRefreshFlag] = React.useState('');
  const [concertGroups, setConcertGroups] = React.useState<ClientConcertGroup[] | null>(null);
  const [loading, setLoading] = React.useState(false);

  if (refreshFlag !== currRefreshFlag) {
    setConcertGroups(null);
    setCurrRefreshFlag(refreshFlag);
  }

  if (concertGroups === null && !loading) {
    setLoading(true);
    const now = startOfDay(new Date());
    getConcertGroups(now, addYears(now, 1)).then(
      (data) => setConcertGroups(data),
    ).catch((e) => {
      console.error(e);
      dispatch(openSnackbar('공연 정보 불러오기를 실패했습니다.'));
    }).finally(() => {
      setLoading(false);
    });
  }

  if (loading) {
    return <CentralCircularProgress />;
  }

  const groups = (concertGroups ?? []).filter((g) => (
    g.voiceActorIds.some((id) => vaFilter[id]) // VA Filter
    && ( // isLoveLive filter
      (g.isLoveLive && etcFilter.showLoveLive)
      || (!g.isLoveLive && etcFilter.showNonLoveLive)
    )
  ));

  return (
    <div className={classes.padded}>
      {authorized && (
        <div className={classes.paddedCenter}>
          <Button variant="outlined" onClick={() => dispatch(openConcertEditDialog(null))}>새 정보 추가</Button>
        </div>
      )}
      {groups.length === 0 ? (
        <div className={classes.paddedCenter}>
          <div style={{ textAlign: 'center' }}>
            <EventBusyIcon fontSize="large" color="inherit" />
            <Typography>공연 정보가 없습니다</Typography>
          </div>
        </div>
      ) : groups.map((g) => (
        <SingleConcert
          key={g.id}
          concert={g}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  );
};

export default Concert;
