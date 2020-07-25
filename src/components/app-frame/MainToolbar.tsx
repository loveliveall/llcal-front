import React from 'react';
import ReactGA from 'react-ga';
import { useDispatch } from 'react-redux';

import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import RefreshIcon from '@material-ui/icons/Refresh';
import TodayIcon from '@material-ui/icons/Today';

import { refreshHash } from '@/store/flags/actions';
import { ViewInfo } from '@/types';

const useStyles = makeStyles((theme: Theme) => ({
  menuIcon: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  padded: {
    flexGrow: 1,
  },
  desktopLeftIcon: {
    [theme.breakpoints.up('md')]: { // https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/IconButton/IconButton.js#L36
      marginLeft: -12,
      '$sizeSmall&': {
        marginLeft: -3,
      },
    },
  },
}));

interface IOwnProps {
  currDate: Date,
  setCurrDate: React.Dispatch<React.SetStateAction<Date>>,
  view: ViewInfo,
  onBackClick: () => void,
  toggleDrawer: () => void,
  handlePrevDate: () => void,
  handleNextDate: () => void,
}
type MainToolbarProps = IOwnProps;

const MainToolbar: React.FC<MainToolbarProps> = ({
  currDate, setCurrDate, view, onBackClick, toggleDrawer, handlePrevDate, handleNextDate,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currView = view.currType;

  const onTodayClick = () => {
    ReactGA.event({
      category: 'MainToolbar',
      action: 'Click today',
    });
    setCurrDate(new Date());
  };
  const onRefreshClick = () => {
    ReactGA.event({
      category: 'MainToolbar',
      action: 'Click refresh',
    });
    dispatch(refreshHash());
  };

  const dateDisplay = (() => {
    const year = `0${currDate.getFullYear()}`.slice(-2);
    const month = `0${currDate.getMonth() + 1}`.slice(-2);
    const day = `0${currDate.getDate()}`.slice(-2);
    // const weekday = ['일', '월', '화', '수', '목', '금', '토'][currDate.getDay()];
    if (currView === 'month' || currView === 'agenda') return `'${year}.${month}.`;
    if (currView === 'day') return `'${year}.${month}.${day}.`;
    return '';
  })();
  const prevDateTooltip = (() => {
    if (currView === 'month' || currView === 'agenda') return '이전 달';
    if (currView === 'day') return '이전 날';
    return '';
  })();
  const nextDateTooltip = (() => {
    if (currView === 'month' || currView === 'agenda') return '다음 달';
    if (currView === 'day') return '다음 날';
    return '';
  })();

  return (
    <Toolbar>
      {view.showBack ? (
        <IconButton
          className={classes.menuIcon}
          color="inherit"
          aria-label="go back to prev view"
          edge="start"
          onClick={onBackClick}
        >
          <ArrowBackIcon />
        </IconButton>
      ) : (
        <IconButton
          className={classes.menuIcon}
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Tooltip title="오늘">
        <IconButton
          className={classes.desktopLeftIcon}
          color="inherit"
          aria-label="show today"
          onClick={onTodayClick}
        >
          <TodayIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={prevDateTooltip}>
        <IconButton
          color="inherit"
          aria-label="prev day"
          onClick={handlePrevDate}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={nextDateTooltip}>
        <IconButton
          color="inherit"
          aria-label="next day"
          onClick={handleNextDate}
        >
          <ChevronRightIcon />
        </IconButton>
      </Tooltip>
      <Typography
        variant="h6"
      >
        {dateDisplay}
      </Typography>
      <div className={classes.padded} />
      <Tooltip title="새로고침">
        <IconButton
          color="inherit"
          aria-label="refresh"
          edge="end"
          onClick={onRefreshClick}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

export default MainToolbar;
