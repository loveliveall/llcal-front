import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import addYears from 'date-fns/addYears';
import startOfDay from 'date-fns/startOfDay';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Accordion, { AccordionProps } from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionActions from '@mui/material/AccordionActions';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventBusyIcon from '@mui/icons-material/EventBusy';

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

const PaddedCenter = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
}));
const PaddedDiv = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
}));
const SecondaryTypo = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 'small',
}));

const CentralCircularProgress: React.FC = () => {
  return (
    <PaddedCenter>
      <CircularProgress />
    </PaddedCenter>
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
  const now = new Date();
  if (isLoading) {
    return <CentralCircularProgress />;
  }
  if (events.length === 0) {
    return (
      <PaddedCenter>
        <div style={{ textAlign: 'center' }}>
          <EventBusyIcon fontSize="large" color="inherit" />
          <Typography>일정 미등록</Typography>
        </div>
      </PaddedCenter>
    );
  }
  return (
    <List dense>
      {events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()).map((ev) => {
        const isActive = ev.startTime <= now && now <= ev.endTime;
        return (
          // Additional div for overriding background color with hover feature enabled
          <div
            key={ev.id}
            style={{
              backgroundColor: isActive ? 'lightblue' : undefined,
            }}
          >
            <ListItemButton onClick={() => onEventClick(ev)}>
              <ListItemText
                style={{
                  filter: ev.endTime <= now ? DIMMED_FILTER : undefined,
                }}
                primary={ev.title}
                secondary={getDateRangeStr(ev.startTime, ev.endTime, ev.allDay)}
              />
            </ListItemButton>
          </div>
        );
      })}
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

  const onPanelChange: AccordionProps['onChange'] = (_, isExpanded) => {
    setExpanded(isExpanded);
  };
  const prefix = isLoveLive ? '[LoveLive!] ' : '';

  return (
    <Accordion expanded={expanded} onChange={onPanelChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <div>
          <Typography>{`${prefix}${title}`}</Typography>
          <SecondaryTypo>{getDateRangeStr(startTime, endTime, false)}</SecondaryTypo>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ width: '100%' }}>
          <div>
            <Typography variant="h6">출연 성우</Typography>
            <PaddedDiv>
              <Typography>
                {voiceActorIds.sort((a, b) => a - b).map(
                  (va) => getObjWithProp(voiceActorList, 'id', va)?.name,
                ).filter((e) => e !== undefined).join(', ')}
              </Typography>
            </PaddedDiv>
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
      </AccordionDetails>
      {authorized && (
        <AccordionActions>
          <Button onClick={() => dispatch(openConcertEditDialog(concert))} color="inherit">수정</Button>
          <Button onClick={() => dispatch(openConcertDeleteDialog(concert))} color="primary">삭제</Button>
        </AccordionActions>
      )}
    </Accordion>
  );
};

interface ConcertProps {
  vaFilter: VACheckState,
  etcFilter: ETCCheckState,
  onEventClick: (event: ClientEvent) => void,
}

type PageType = 'new' | 'old';

const Concert: React.FC<ConcertProps> = ({
  vaFilter, etcFilter, onEventClick,
}) => {
  const dispatch = useDispatch();
  const authorized = useSelector((state: AppState) => state.auth.token !== null);
  const refreshFlag = useSelector((state: AppState) => state.flags.refreshFlag);
  const [page, setPage] = React.useState<PageType>('new');
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
    const from = page === 'new' ? now : addYears(now, -1);
    const to = page === 'new' ? addYears(now, 1) : now;
    getConcertGroups(from, to).then(
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

  const togglePage = () => {
    if (page === 'new') {
      setPage('old');
    } else {
      setPage('new');
    }
    setConcertGroups(null);
  };

  const groups = (concertGroups ?? []).filter((g) => (
    g.voiceActorIds.some((id) => vaFilter[id]) // VA Filter
    && ( // isLoveLive filter
      (g.isLoveLive && etcFilter.showLoveLive)
      || (!g.isLoveLive && etcFilter.showNonLoveLive)
    )
  ));

  return (
    <PaddedDiv>
      {authorized && (
        <PaddedCenter>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => dispatch(openConcertEditDialog(null))}
          >
            새 정보 추가
          </Button>
        </PaddedCenter>
      )}
      {groups.length === 0 ? (
        <PaddedCenter>
          <div style={{ textAlign: 'center' }}>
            <EventBusyIcon fontSize="large" color="inherit" />
            <Typography>공연 정보가 없습니다</Typography>
          </div>
        </PaddedCenter>
      ) : groups.map((g) => (
        <SingleConcert
          key={g.id}
          concert={g}
          onEventClick={onEventClick}
        />
      ))}
      {authorized && (
        <PaddedCenter>
          <Button color="inherit" variant="outlined" onClick={() => togglePage()}>
            {page === 'new' ? '과거 공연 보기' : '현재 공연 보기'}
          </Button>
        </PaddedCenter>
      )}
    </PaddedDiv>
  );
};

export default Concert;
