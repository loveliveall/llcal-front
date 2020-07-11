import React from 'react';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import subDays from 'date-fns/subDays';
import subMonths from 'date-fns/subMonths';

import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import TodayIcon from '@material-ui/icons/Today';

import { ViewType } from '@/components/calendar';

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
  currView: ViewType,
  toggleDrawer: () => void,
}
type MainToolbarProps = IOwnProps;

const MainToolbar: React.FC<MainToolbarProps> = ({
  currDate, setCurrDate, currView, toggleDrawer,
}) => {
  const classes = useStyles();

  const onTodayClick = () => setCurrDate(new Date());
  const handleNextDate = () => {
    if (currView === 'month' || currView === 'agenda') {
      setCurrDate(addMonths(currDate, 1));
    } else if (currView === 'day') {
      setCurrDate(addDays(currDate, 1));
    }
  };
  const handlePrevDate = () => {
    if (currView === 'month' || currView === 'agenda') {
      setCurrDate(subMonths(currDate, 1));
    } else if (currView === 'day') {
      setCurrDate(subDays(currDate, 1));
    }
  };

  const dateDisplay = (() => {
    // const year = `0000${currDate.getFullYear()}`.slice(-4);
    const month = `0${currDate.getMonth() + 1}`.slice(-2);
    const day = `0${currDate.getDate()}`.slice(-2);
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][currDate.getDay()];
    if (currView === 'month' || currView === 'agenda') return `${currDate.getMonth() + 1}월`;
    if (currView === 'day') return `${month}.${day}.(${weekday})`;
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
      <IconButton
        className={classes.menuIcon}
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={toggleDrawer}
      >
        <MenuIcon />
      </IconButton>
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
    </Toolbar>
  );
};

export default MainToolbar;
