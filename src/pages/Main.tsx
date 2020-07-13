import React from 'react';
import addDays from 'date-fns/addDays';
import endOfDay from 'date-fns/endOfDay';
import endOfMonth from 'date-fns/endOfMonth';
import subDays from 'date-fns/subDays';
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

import { filterEvents } from '@/utils';
import { VA_FILTER_DEFAULT } from '@/defaults';
import { ClientEvent } from '@/types';
import { getEvents } from '@/api';

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

const Main: React.FC = () => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [currDate, setCurrDate] = React.useState(new Date());
  const [currView, setCurrView] = React.useState<ViewType>('month');
  const [loading, setLoading] = React.useState(false);
  const [events, setEvents] = React.useState<ClientEvent[]>([]);
  const [vaFilter, setVAFilter] = React.useState(VA_FILTER_DEFAULT);

  React.useEffect(() => {
    const rangeStart = (() => {
      if (currView === 'month') return subDays(startOfMonth(currDate), 7);
      if (currView === 'day') return startOfDay(currDate);
      // Agenda
      return startOfMonth(currDate);
    })();
    const rangeEnd = (() => {
      if (currView === 'month') return addDays(endOfMonth(currDate), 7);
      if (currView === 'day') return endOfDay(currDate);
      // Agenda
      return endOfMonth(currDate);
    })();
    setLoading(true);
    getEvents(rangeStart, rangeEnd).then((data) => {
      if (data.status) {
        setEvents(data.events);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [currDate, currView]);

  const toggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };
  const onMonthDateClick = (date: Date) => {
    setCurrDate(date);
    setCurrView('day');
  };

  const drawer = (
    <DrawerContent
      currView={currView}
      setCurrView={setCurrView}
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
          currView={currView}
          toggleDrawer={toggleMobileDrawer}
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
        <div className={classes.calendarWrapper}>
          <Calendar
            events={filterEvents(events, vaFilter)}
            currDate={currDate}
            view={currView}
            onMonthDateClick={onMonthDateClick}
          />
        </div>
      </main>
    </div>
  );
};

export default Main;
