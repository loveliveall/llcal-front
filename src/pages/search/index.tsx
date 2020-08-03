import React from 'react';
import ReactGA from 'react-ga';
import { useDispatch, useSelector } from 'react-redux';
import fuzzysort from 'fuzzysort';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';
import subMonths from 'date-fns/subMonths';

import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import { openEventDetailDialog } from '@/store/detail-dialog/actions';
import { openSnackbar } from '@/store/snackbar/actions';

import { AppState } from '@/store';
import { ClientEvent } from '@/types';
import { callGetEvents } from '@/api';
import { getDateString } from '@/utils';
import SearchToolbar, { SearchToolbarProps } from '@/components/app-frame/SearchToolbar';
import { normalizeEvents, getEventsInRange } from '@/components/calendar/utils/utils';
import SingleDateResult from './SingleDateResult';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    flex: '1 1 100%',
    maxWidth: '100%',
  },
  toolbar: theme.mixins.toolbar,
  resultWrapper: {
    margin: 'auto',
    maxWidth: theme.breakpoints.values.md,
  },
  fitParent: {
    width: '100%',
    textAlign: 'center',
    margin: theme.spacing(1),
  },
  progress: {
    height: 2,
  },
}));

const LOAD_INTERVAL = 6; // Months

const SearchPage: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const refreshFlag = useSelector((state: AppState) => state.flags.refreshFlag);
  const dayStartHour = useSelector((state: AppState) => state.settings.dayStartHour);
  const now = new Date();
  const [currRefreshFlag, setCurrRefreshFlag] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [searchRange, setSearchRange] = React.useState([
    startOfMonth(subMonths(now, 3)), endOfMonth(addMonths(now, 9)),
  ]);
  const [events, setEvents] = React.useState<ClientEvent[]>([]);
  const [exists, setExists] = React.useState<{
    [id: string]: boolean,
  }>({});

  const loadEvents = (from: Date, to: Date) => {
    setLoading(true);
    callGetEvents(from, to).then((data) => {
      const filtered = data.filter((e) => !exists[e.id]);
      setExists((prev) => ({
        ...prev,
        ...filtered.reduce((acc, curr) => ({
          ...acc,
          [curr.id]: true,
        }), {}),
      }));
      setEvents((prev) => [...prev, ...filtered]);
    }).catch((e) => {
      console.error(e);
      dispatch(openSnackbar('일정 불러오기를 실패했습니다.'));
    }).finally(() => {
      setLoading(false);
    });
  };

  const onSearchTrigger: SearchToolbarProps['onSearchTrigger'] = (text) => {
    ReactGA.event({
      category: 'Search',
      action: 'Perform search',
      label: text,
    });
    setSearchTerm(text);
  };
  const onLoadPrevClick = () => {
    ReactGA.event({
      category: 'Search',
      action: 'Load previous',
    });
    const newStart = subMonths(searchRange[0], LOAD_INTERVAL);
    loadEvents(newStart, searchRange[0]);
    setSearchRange([newStart, searchRange[1]]);
  };
  const onLoadNextClick = () => {
    ReactGA.event({
      category: 'Search',
      action: 'Load next',
    });
    const newEnd = addMonths(searchRange[1], LOAD_INTERVAL);
    loadEvents(searchRange[1], newEnd);
    setSearchRange([searchRange[0], newEnd]);
  };
  const onEventClick = (event: ClientEvent) => {
    ReactGA.event({
      category: 'Search',
      action: 'See event detail',
      label: event.title,
    });
    dispatch(openEventDetailDialog(event));
  };
  if (currRefreshFlag !== refreshFlag) {
    setEvents([]);
    setExists({});
    setCurrRefreshFlag(refreshFlag);
  }

  if (searchTerm !== '' && !loading && events.length === 0) {
    // Initial load
    loadEvents(searchRange[0], searchRange[1]);
  }

  const searchedEvents = fuzzysort.go<ClientEvent>(
    searchTerm,
    events,
    {
      keys: ['title', 'place', 'description'],
    },
  ).map((e) => e.obj);
  const normSearchedEvents = normalizeEvents(searchedEvents, dayStartHour);
  const diff = differenceInCalendarDays(searchRange[1], searchRange[0]);

  return (
    <div className={classes.root}>
      <AppBar color="default" elevation={0} position="fixed" className={classes.appBar}>
        <SearchToolbar onSearchTrigger={onSearchTrigger} />
        {loading && <LinearProgress className={classes.progress} />}
      </AppBar>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.resultWrapper}>
          {events.length !== 0 && (
            <>
              <Button
                className={classes.fitParent}
                disabled={loading}
                onClick={onLoadPrevClick}
              >
                더 보기
              </Button>
              <Typography
                className={classes.fitParent}
                variant="body2"
              >
                {`${getDateString(searchRange[0])}부터의 결과입니다.`}
              </Typography>
            </>
          )}
          {new Array(diff).fill(null).map((_, idx) => {
            const targetDate = addDays(searchRange[0], idx);
            const eventsInRange = getEventsInRange(normSearchedEvents, targetDate, addDays(targetDate, 1));
            return (
              <SingleDateResult
                dayStartHour={dayStartHour}
                key={targetDate.toISOString()}
                startOfDay={targetDate}
                eventsInRange={eventsInRange}
                onEventClick={onEventClick}
              />
            );
          })}
          {events.length !== 0 && (
            <>
              <Divider />
              <Typography
                className={classes.fitParent}
                variant="body2"
              >
                {`${getDateString(searchRange[1])}까지의 결과입니다.`}
              </Typography>
              <Button
                className={classes.fitParent}
                disabled={loading}
                onClick={onLoadNextClick}
              >
                더 보기
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
