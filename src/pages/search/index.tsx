import React from 'react';
import ReactGA from 'react-ga4';
import { useDispatch, useSelector } from 'react-redux';
import fuzzysort from 'fuzzysort';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import endOfMonth from 'date-fns/endOfMonth';
import startOfMonth from 'date-fns/startOfMonth';
import subMonths from 'date-fns/subMonths';

import { styled, SxProps, Theme, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import { openEventDetailDialog } from '@/store/detail-dialog/actions';
import { openSnackbar } from '@/store/snackbar/actions';

import { AppState } from '@/store';
import { ClientEvent } from '@/types';
import { callGetEvents } from '@/api';
import { getDateString } from '@/utils';
import SearchToolbar, { SearchToolbarProps } from '@/components/app-frame/SearchToolbar';
import { normalizeEvents } from '@/components/calendar';
import SingleDateResult from './SingleDateResult';

const Root = styled('div')`
  display: flex;
`;
const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));
const Content = styled('main')`
  flex: 1 1 100%;
  max-width: 100%;
`;
const ToolbarSpace = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar as any,
}));
const ResultWrapper = styled('div')(({ theme }) => ({
  margin: 'auto',
  maxWidth: theme.breakpoints.values.md,
}));

const sxFitParent: SxProps<Theme> = (theme) => ({
  width: '100%',
  textAlign: 'center',
  margin: theme.spacing(1),
});

const LOAD_INTERVAL = 6; // Months

const SearchPage: React.FC = () => {
  const theme = useTheme();
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
    <Root>
      <AppBar color="default" elevation={0} position="fixed">
        <SearchToolbar onSearchTrigger={onSearchTrigger} />
        {loading && <LinearProgress sx={{ height: 2 }} />}
      </AppBar>
      <Content>
        <ToolbarSpace />
        <ResultWrapper>
          {events.length !== 0 && (
            <>
              <Button
                color="inherit"
                disabled={loading}
                onClick={onLoadPrevClick}
                sx={sxFitParent(theme)}
              >
                더 보기
              </Button>
              <Typography
                variant="body2"
                sx={sxFitParent(theme)}
              >
                {`${getDateString(searchRange[0])}부터의 결과입니다.`}
              </Typography>
            </>
          )}
          {new Array(diff).fill(null).map((_, idx) => {
            const targetDate = addDays(searchRange[0], idx);
            return (
              <SingleDateResult
                key={targetDate.toISOString()}
                startOfDay={targetDate}
                events={normSearchedEvents}
                onEventClick={onEventClick}
              />
            );
          })}
          {events.length !== 0 && (
            <>
              <Divider />
              <Typography
                variant="body2"
                sx={sxFitParent(theme)}
              >
                {`${getDateString(searchRange[1])}까지의 결과입니다.`}
              </Typography>
              <Button
                color="inherit"
                disabled={loading}
                onClick={onLoadNextClick}
                sx={sxFitParent(theme)}
              >
                더 보기
              </Button>
            </>
          )}
        </ResultWrapper>
      </Content>
    </Root>
  );
};

export default SearchPage;
