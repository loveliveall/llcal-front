import React from 'react';
import { useDispatch } from 'react-redux';
import addDays from 'date-fns/addDays';
import endOfMonth from 'date-fns/endOfMonth';
import subDays from 'date-fns/subDays';
import startOfMonth from 'date-fns/startOfMonth';

import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';

import Calendar, { ViewType } from '@/components/calendar';
import MainToolbar from '@/components/app-frame/MainToolbar';
import DrawerContent from '@/components/app-frame/DrawerContent';

import { openEventDetailDialog } from '@/store/detail-dialog/actions';

import { filterEvents } from '@/utils';
import { VA_FILTER_DEFAULT } from '@/defaults';
import { ClientEvent, ViewInfo } from '@/types';
import { callGetEvents } from '@/api';

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

  const onSelectView = (v: ViewType) => {
    setView({
      showBack: false,
      currType: v,
    });
  };
  const showPrevView = () => {
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
    dispatch(openEventDetailDialog(event));
  };

  const cacheKey = getCacheKey(currDate);
  const rangeStart = subDays(startOfMonth(currDate), 7);
  const rangeEnd = addDays(endOfMonth(currDate), 7);
  if (!(cacheKey in eventCache)) {
    // Load data into cache
    callGetEvents(rangeStart, rangeEnd).then((data) => {
      setEventCache((prev) => ({
        ...prev,
        [cacheKey]: data,
      }));
    }).catch((e) => {
      // TODO: Add some error handling (ex. showing snackbar)
      console.error(e);
    });
  }
  const events = eventCache[cacheKey] ?? [];

  const drawer = (
    <DrawerContent
      currView={view.currType}
      setCurrView={onSelectView}
      vaFilter={vaFilter}
      setVAFilter={setVAFilter}
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
        />
        {!(cacheKey in eventCache) && <LinearProgress className={classes.progress} />}
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
        <div className={classes.calendarWrapper}>
          <Calendar
            events={filterEvents(events, vaFilter)}
            currDate={currDate}
            view={view.currType}
            onMonthDateClick={onMonthDateClick}
            onEventClick={onEventClick}
          />
        </div>
      </main>
    </div>
  );
};

export default Main;
