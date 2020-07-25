import React from 'react';
import ReactGA from 'react-ga';
import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
import { useDispatch, useSelector } from 'react-redux';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import endOfMonth from 'date-fns/endOfMonth';
import isSameMonth from 'date-fns/isSameMonth';
import subDays from 'date-fns/subDays';
import subMonths from 'date-fns/subMonths';
import startOfDay from 'date-fns/startOfDay';
import startOfMonth from 'date-fns/startOfMonth';

import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';

import Calendar, { ViewType } from '@/components/calendar';
import MainToolbar from '@/components/app-frame/MainToolbar';
import DrawerContent from '@/components/app-frame/DrawerContent';

import { AppState } from '@/store';
import { openEventDetailDialog } from '@/store/detail-dialog/actions';
import { openSnackbar } from '@/store/snackbar/actions';

import { filterEvents } from '@/utils';
import { VA_FILTER_DEFAULT, CATEGORY_FILTER_DEFAULT, ETC_FILTER_DEFAULT } from '@/defaults';
import { ClientEvent, ViewInfo } from '@/types';
import { callGetEvents } from '@/api';

const VirtualizeSwipeableViews = virtualize(SwipeableViews);
const DRAWER_WIDTH = 280;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
  content: {
    flex: '1 1 100%',
    [theme.breakpoints.up('md')]: {
      maxWidth: `calc(100% - ${DRAWER_WIDTH}px)`,
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  toolbar: theme.mixins.toolbar,
  calendarWrapper: {
    minHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(1)}px)`,
    [theme.breakpoints.down('xs')]: {
      minHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`, // fit to toolbar size changes
    },
  },
  monthViewWrapper: {
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(1)}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`, // fit to toolbar size changes
    },
  },
  progress: {
    height: 2,
  },
}));

function getCacheKey(currDate: Date) {
  const year = `000${currDate.getFullYear()}`.slice(-4);
  const month = `0${currDate.getMonth() + 1}`.slice(-2);
  return `${year}${month}`;
}

const Main: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const refreshFlag = useSelector((state: AppState) => state.flags.refreshFlag);
  const [viewIndex, setViewIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [currRefreshFlag, setCurrRefreshFlag] = React.useState('');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [currDate, setCurrDate] = React.useState(new Date());
  const [view, setView] = React.useState<ViewInfo>({
    showBack: false,
    currType: 'month',
  });
  const [eventCache, setEventCache] = React.useState<{
    [key: string]: ClientEvent[] | undefined,
  }>({});
  const [vaFilter, setVAFilter] = React.useState(VA_FILTER_DEFAULT);
  const [categoryFilter, setCategoryFilter] = React.useState(CATEGORY_FILTER_DEFAULT);
  const [etcFilter, setETCFilter] = React.useState(ETC_FILTER_DEFAULT);

  const initScroll = () => {
    if (view.currType === 'day') {
      window.scrollTo(0, 0);
    } else if (view.currType === 'agenda') {
      const now = startOfDay(new Date());
      if (isSameMonth(currDate, now)) {
        // Today month. scroll to date
        const scrollTop = document.getElementById(`date-${now.getTime()}`)?.offsetTop;
        window.scroll({
          top: scrollTop === undefined ? undefined : scrollTop,
        });
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  React.useEffect(() => {
    initScroll();
  }, [currDate, view.currType, loading]);

  const handleNextDate = () => {
    const currView = view.currType;
    setViewIndex(viewIndex + 1);
    if (currView === 'month' || currView === 'agenda') {
      setCurrDate(addMonths(currDate, 1));
    } else if (currView === 'day') {
      setCurrDate(addDays(currDate, 1));
    }
  };
  const handlePrevDate = () => {
    const currView = view.currType;
    setViewIndex(viewIndex - 1);
    if (currView === 'month' || currView === 'agenda') {
      setCurrDate(subMonths(currDate, 1));
    } else if (currView === 'day') {
      setCurrDate(subDays(currDate, 1));
    }
  };
  let timeoutId: NodeJS.Timeout;
  const onCalendarWheel = (ev: React.WheelEvent<HTMLDivElement>) => {
    const { deltaY } = ev;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (view.currType === 'month') {
        // Support wheel move only on month view
        if (deltaY < 0) {
          // Scroll up
          handlePrevDate();
        } else {
          handleNextDate();
        }
      }
    }, 100);
  };
  const onSelectView = (v: ViewType) => {
    ReactGA.event({
      category: 'Main',
      action: 'Change view type',
      label: v,
    });
    setView({
      showBack: false,
      currType: v,
    });
  };
  const showPrevView = () => {
    ReactGA.event({
      category: 'Main',
      action: 'Change view type',
      label: 'month-showback',
    });
    setView({
      showBack: false,
      currType: 'month', // TODO: This may be changed in future...? (when app grows...)
    });
  };
  const toggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };
  const onMonthDateClick = (date: Date) => {
    setCurrDate(date);
    setView({
      showBack: true,
      currType: 'day',
    });
  };
  const onEventClick = (event: ClientEvent) => {
    ReactGA.event({
      category: 'Main',
      action: 'See event detail',
      label: event.title,
    });
    dispatch(openEventDetailDialog(event));
  };
  if (refreshFlag !== currRefreshFlag) {
    setEventCache({});
    setCurrRefreshFlag(refreshFlag);
  }

  const cacheKey = getCacheKey(currDate);
  const rangeStart = subDays(startOfMonth(currDate), 7);
  const rangeEnd = addDays(endOfMonth(currDate), 14);
  if (!(cacheKey in eventCache) && !loading) {
    // Load data into cache
    setLoading(true);
    callGetEvents(rangeStart, rangeEnd).then((data) => {
      setEventCache((prev) => ({
        ...prev,
        [cacheKey]: data,
      }));
    }).catch((e) => {
      console.error(e);
      dispatch(openSnackbar('일정 불러오기를 실패했습니다.'));
    }).finally(() => {
      setLoading(false);
    });
  }
  const events = eventCache[cacheKey] ?? [];

  const drawer = (
    <DrawerContent
      currView={view.currType}
      setCurrView={onSelectView}
      etcFilter={etcFilter}
      setETCFilter={setETCFilter}
      vaFilter={vaFilter}
      setVAFilter={setVAFilter}
      categoryFilter={categoryFilter}
      setCategoryFilter={setCategoryFilter}
      setMobileDrawerOpen={setMobileOpen}
    />
  );

  return (
    <div className={classes.root}>
      <AppBar color="default" elevation={0} position="fixed" className={classes.appBar}>
        <MainToolbar
          currDate={currDate}
          setCurrDate={setCurrDate}
          view={view}
          onBackClick={showPrevView}
          toggleDrawer={toggleMobileDrawer}
          handlePrevDate={handlePrevDate}
          handleNextDate={handleNextDate}
        />
        {loading && <LinearProgress className={classes.progress} />}
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={toggleMobileDrawer}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <div className={classes.toolbar} />
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <VirtualizeSwipeableViews
          overscanSlideAfter={1}
          overscanSlideBefore={1}
          enableMouseEvents
          index={viewIndex}
          onChangeIndex={(index, indexLatest) => {
            if (index < indexLatest) handlePrevDate();
            else handleNextDate();
          }}
          slideRenderer={({ index, key }) => {
            const isCurrIndex = index === viewIndex;
            const dateFn = view.currType === 'month' ? addMonths : addDays;
            return (
              <div
                key={key}
                className={`${classes.calendarWrapper} ${view.currType === 'month' && classes.monthViewWrapper}`}
                onWheel={onCalendarWheel}
              >
                <Calendar
                  isLoading={isCurrIndex ? loading : true}
                  events={isCurrIndex ? filterEvents(events, vaFilter, categoryFilter, etcFilter) : []}
                  currDate={dateFn(currDate, index - viewIndex)}
                  view={view.currType}
                  onMonthDateClick={onMonthDateClick}
                  onEventClick={onEventClick}
                />
              </div>
            );
          }}
        />
      </main>
    </div>
  );
};

export default Main;
