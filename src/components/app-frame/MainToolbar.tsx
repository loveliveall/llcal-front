import React from 'react';
import ReactGA from 'react-ga';
import { useDispatch, useSelector } from 'react-redux';
import subHours from 'date-fns/subHours';

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

import { AVAILABLE_VIEWS } from '@/components/calendar';

import { refreshHash } from '@/store/flags/actions';
import { ViewInfo } from '@/types';
import { AppState } from '@/store';

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
  const dayStartHour = useSelector((state: AppState) => state.settings.dayStartHour);
  const currView = view.currType;

  const onTodayClick = () => {
    ReactGA.event({
      category: 'MainToolbar',
      action: 'Click today',
    });
    setCurrDate(subHours(new Date(), dayStartHour));
  };
  const onRefreshClick = () => {
    ReactGA.event({
      category: 'MainToolbar',
      action: 'Click refresh',
    });
    dispatch(refreshHash());
  };

  const titleText = (() => {
    const year = `0${currDate.getFullYear()}`.slice(-2);
    const month = `0${currDate.getMonth() + 1}`.slice(-2);
    const day = `0${currDate.getDate()}`.slice(-2);
    // const weekday = ['일', '월', '화', '수', '목', '금', '토'][currDate.getDay()];
    if (currView === 'month' || currView === 'agenda') return `'${year}.${month}.`;
    if (currView === 'day') return `'${year}.${month}.${day}.`;
    if (currView === 'dashboard') return '대시보드';
    if (currView === 'concert') return '이벤트 목록';
    throw new Error(`titleText for viewType ${currView} is not defined`);
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
      {AVAILABLE_VIEWS.includes(currView as any) && (
        <>
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
        </>
      )}
      <Typography
        variant="h6"
      >
        {titleText}
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
