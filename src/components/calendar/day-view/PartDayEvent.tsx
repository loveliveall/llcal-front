import React from 'react';
import addDays from 'date-fns/addDays';
import differenceInMinutes from 'date-fns/differenceInMinutes';

import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { getCellHeightCalc, SINGLE_LINE_MINUTE } from './styles';
import { DIMMED_FILTER, getTimeString } from '../utils/utils';
import { ICalendarEvent, IEventInfo } from '../utils/types';

const EventInstanceDiv = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(0.5),
  borderRadius: theme.spacing(0.5),
  cursor: 'pointer',
  '&:hover': {
    boxShadow: 'inset 0px 0px 0px 1000px rgba(0, 0, 0, 0.1)',
  },
}));
const EventTextTypo = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.fontSize,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'clip',
}));

interface IOwnProps {
  thisDayStart: Date,
  dayStartHour: number,
  event: IEventInfo,
  visibleStartV: Date,
  visibleEndV: Date,
  colIdx: number,
  colCount: number,
  fullColCount: number,
  onEventClick: (event: ICalendarEvent) => void,
}
type PartDayEventProps = IOwnProps;

const PartDayEvent: React.FC<PartDayEventProps> = ({
  thisDayStart, dayStartHour, event, visibleStartV, visibleEndV, colIdx, colCount, fullColCount, onEventClick,
}) => {
  const theme = useTheme();
  const now = new Date();

  const nextDayStart = addDays(thisDayStart, 1);
  const minFromDayStart = differenceInMinutes(visibleStartV, thisDayStart); // in minutes
  const duration = differenceInMinutes(visibleEndV, visibleStartV); // in minutes
  const startTimeStr = event.startTimeV < thisDayStart ? '' : getTimeString(event.orig.startTime, dayStartHour);
  const endTimeStr = (() => {
    if (event.endTimeV > nextDayStart) return ''; // Event continues to next day
    if (event.endTimeV.getTime() === nextDayStart.getTime()) return `${24 + dayStartHour}:00`; // Exceptional case to display 24:00
    return getTimeString(event.orig.endTime, dayStartHour);
  })();
  const timeString = startTimeStr === endTimeStr ? startTimeStr : `${startTimeStr} - ${endTimeStr}`;

  const onKeyUp = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === 'Enter') {
      onEventClick(event.orig);
    }
  };

  return (
    <EventInstanceDiv
      role="button"
      tabIndex={0}
      sx={{
        position: 'absolute',
        top: `calc(${getCellHeightCalc(theme)} / 60 * ${minFromDayStart})`,
        left: `${(colIdx * 100) / fullColCount}%`,
        width: `${(100 * colCount) / fullColCount}%`,
        height: `calc(${getCellHeightCalc(theme)} / 60 * ${duration})`,
        boxSizing: 'border-box',
        border: `${theme.spacing(0.125)} solid ${event.orig.colorCode}`,
        backgroundColor: `${event.orig.colorCode}c0`,
        filter: event.orig.endTime <= now ? DIMMED_FILTER : undefined,
      }}
      onClick={() => onEventClick(event.orig)}
      onKeyUp={onKeyUp}
    >
      <EventTextTypo
        variant="body2"
        sx={{
          color: theme.palette.getContrastText(event.orig.colorCode),
        }}
      >
        {`${event.orig.title}${duration < SINGLE_LINE_MINUTE * 2 ? `, ${timeString}` : ''}`}
      </EventTextTypo>
      {duration >= SINGLE_LINE_MINUTE * 2 && (
        <EventTextTypo
          variant="body2"
          sx={{
            color: theme.palette.getContrastText(event.orig.colorCode),
          }}
        >
          {timeString}
        </EventTextTypo>
      )}
    </EventInstanceDiv>
  );
};

export default PartDayEvent;
