import React from 'react';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { DIMMED_FILTER, getTimeString } from '../utils/utils';
import { ICalendarEvent, IEventInfo } from '../utils/types';

const EventInstance = styled('div')(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(0.5),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  margin: theme.spacing(0.25),
  borderRadius: theme.spacing(0.5),
  alignItems: 'center',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: 'inset 0px 0px 0px 1000px rgba(0, 0, 0, 0.1)',
  },
}));
const EventCategoryCircle = styled('div')(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  border: `${theme.spacing(0.75)} solid`,
}));
const CircleWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingRight: theme.spacing(3),
}));
const TimeTextTypo = styled(Typography)(({ theme }) => ({
  minWidth: theme.spacing(14),
})) as typeof Typography;

interface IOwnProps {
  isMobile: boolean,
  dayStartHour: number,
  event: IEventInfo,
  onEventClick: (event: ICalendarEvent) => void,
  startOfDay: Date,
  nextDayStart: Date,
}
type SingleEventRowProps = IOwnProps;

const SingleEventRow: React.FC<SingleEventRowProps> = ({
  isMobile, dayStartHour, event, onEventClick, startOfDay, nextDayStart,
}) => {
  const theme = useTheme();
  const now = new Date();

  const onClick = () => onEventClick(event.orig);
  const onKeyUp = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === 'Enter') {
      onEventClick(event.orig);
    }
  };
  const startTimeStr = event.startTimeV < startOfDay ? '' : getTimeString(event.orig.startTime, dayStartHour);
  const endTimeStr = (() => {
    if (event.endTimeV > nextDayStart) return ''; // Event continues to next day
    if (event.endTimeV.getTime() === nextDayStart.getTime()) return `${24 + dayStartHour}:00`; // Exceptional case to display 24:00
    return getTimeString(event.orig.endTime, dayStartHour);
  })();
  const timeString = (() => {
    if (event.orig.allDay) return '종일';
    if (startTimeStr === '' && endTimeStr === '') return '종일';
    if (startTimeStr === endTimeStr) return startTimeStr;
    return `${startTimeStr} - ${endTimeStr}`;
  })();

  const fullLength = differenceInCalendarDays(event.endTimeV, event.startTimeV) + 1;
  const currLength = differenceInCalendarDays(startOfDay, event.startTimeV) + 1;
  const eventText = `${event.orig.title}${timeString === '종일' && fullLength !== 1
    ? ` (${currLength}/${fullLength})` : ''}`;
  return (
    <EventInstance
      role="button"
      tabIndex={0}
      sx={{
        filter: event.orig.endTime <= now ? DIMMED_FILTER : undefined,
        backgroundColor: isMobile ? event.orig.colorCode : undefined,
      }}
      onClick={onClick}
      onKeyUp={onKeyUp}
    >
      {!isMobile && (
        <>
          <CircleWrapper>
            <EventCategoryCircle
              sx={{ borderColor: event.orig.colorCode }}
            />
          </CircleWrapper>
          <TimeTextTypo
            component="span"
            variant="body2"
          >
            {timeString}
          </TimeTextTypo>
        </>
      )}
      <div>
        <Typography
          variant="body2"
          sx={isMobile ? {
            color: theme.palette.getContrastText(event.orig.colorCode),
          } : undefined}
        >
          {eventText}
        </Typography>
        {isMobile && timeString !== '종일' && (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.getContrastText(event.orig.colorCode),
            }}
          >
            {timeString}
          </Typography>
        )}
      </div>
    </EventInstance>
  );
};

export default SingleEventRow;
