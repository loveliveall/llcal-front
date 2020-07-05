import React from 'react';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import subDays from 'date-fns/subDays';
import subMonths from 'date-fns/subMonths';

import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import TodayIcon from '@material-ui/icons/Today';

import Calendar, { ViewType } from '@/components/calendar';

import { mockEvents } from './tmp';

const DRAWER_WIDTH = 240;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  padded: {
    flexGrow: 1,
  },
  menuIcon: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  desktopLeftIcon: {
    [theme.breakpoints.up('md')]: { // https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/IconButton/IconButton.js#L36
      marginLeft: -12,
      '$sizeSmall&': {
        marginLeft: -3,
      },
    },
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
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  calendarWrapper: {
    overflow: 'hidden',
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(1)}px)`,
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`, // fit to toolbar size changes
    },
    [theme.breakpoints.up('md')]: {
      width: `calc(100vw - ${DRAWER_WIDTH}px)`,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
    },
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [currDate, setCurrDate] = React.useState(new Date());
  const [currView] = React.useState<ViewType>('month');

  React.useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [currDate, currView]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const onTodayClick = () => {
    setCurrDate(new Date());
  };
  const handleNextDate = () => {
    if (currView === 'month') {
      setCurrDate(addMonths(currDate, 1));
    } else if (currView === 'day') {
      setCurrDate(addDays(currDate, 1));
    }
  };
  const handlePrevDate = () => {
    if (currView === 'month') {
      setCurrDate(subMonths(currDate, 1));
    } else if (currView === 'day') {
      setCurrDate(subDays(currDate, 1));
    }
  };
  // const onViewSelect = (view: ViewType) => {
  //   setCurrView(view);
  // };

  const dateDisplay = (() => {
    const year = `0000${currDate.getFullYear()}`.slice(-4);
    const month = `0${currDate.getMonth() + 1}`.slice(-2);
    const day = `0${currDate.getDate()}`.slice(-2);
    if (currView === 'month') return `${year}.${month}.`;
    if (currView === 'day') return `${year}.${month}.${day}`;
    return '';
  })();
  return (
    <div className={classes.root}>
      <AppBar color="default" elevation={0} position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            className={classes.menuIcon}
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            className={classes.desktopLeftIcon}
            color="inherit"
            aria-label="show today"
            onClick={onTodayClick}
          >
            <TodayIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="prev day"
            onClick={handlePrevDate}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="next day"
            onClick={handleNextDate}
          >
            <ChevronRightIcon />
          </IconButton>
          <Typography
            variant="h6"
          >
            {dateDisplay}
          </Typography>
          <div className={classes.padded} />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            Test Drawer
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
            Test 2 Drawer
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.calendarWrapper}>
          <Calendar
            events={mockEvents}
            currDate={currDate}
            view={currView}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
