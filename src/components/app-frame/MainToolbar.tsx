import React from 'react';
import ReactGA from 'react-ga';
import { useDispatch, useSelector } from 'react-redux';
import subHours from 'date-fns/subHours';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import TodayIcon from '@mui/icons-material/Today';

import { AVAILABLE_VIEWS } from '@/components/calendar';

import { refreshHash } from '@/store/flags/actions';
import { ViewInfo } from '@/types';
import { AppState } from '@/store';

const MenuIconButton = styled(IconButton)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));
const PaddedDiv = styled('div')`
  flex-grow: 1;
`;
const LeftMostIconButton = styled(IconButton)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginLeft: -12,
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
        <MenuIconButton
          color="inherit"
          aria-label="go back to prev view"
          edge="start"
          onClick={onBackClick}
        >
          <ArrowBackIcon />
        </MenuIconButton>
      ) : (
        <MenuIconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </MenuIconButton>
      )}
      {AVAILABLE_VIEWS.includes(currView as any) && (
        <>
          <Tooltip title="오늘" disableInteractive>
            <LeftMostIconButton
              color="inherit"
              aria-label="show today"
              onClick={onTodayClick}
            >
              <TodayIcon />
            </LeftMostIconButton>
          </Tooltip>
          <Tooltip title={prevDateTooltip} disableInteractive>
            <IconButton
              color="inherit"
              aria-label="prev day"
              onClick={handlePrevDate}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={nextDateTooltip} disableInteractive>
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
      <PaddedDiv />
      <Tooltip title="새로고침" disableInteractive>
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
