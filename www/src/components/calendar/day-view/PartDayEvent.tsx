import React from 'react';
import addDays from 'date-fns/addDays';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import startOfDay from 'date-fns/startOfDay';

import { makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { getCellHeightCalc, SINGLE_LINE_MINUTE } from './styles';
import { getTimeString } from '../utils/utils';
import { ICalendarEvent } from '../utils/types';

const useStyles = makeStyles((theme: Theme) => ({
  eventInstance: {
    paddingLeft: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    cursor: 'pointer',
    '&:hover': {
      boxShadow: 'inset 0px 0px 0px 1000px rgba(0, 0, 0, 0.1)',
    },
  },
  eventText: {
    fontSize: theme.typography.fontSize,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'clip',
  },
}));

interface IOwnProps {
  event: ICalendarEvent,
  visibleStart: Date,
  visibleEnd: Date,
  colIdx: number,
  colCount: number,
  fullColCount: number,
  onEventClick: (event: ICalendarEvent) => void,
}
type PartDayEventProps = IOwnProps;

const PartDayEvent: React.FC<PartDayEventProps> = ({
  event, visibleStart, visibleEnd, colIdx, colCount, fullColCount, onEventClick,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const dayStart = startOfDay(visibleStart);
  const nextDayStart = addDays(dayStart, 1);
  const minFromDayStart = differenceInMinutes(visibleStart, dayStart); // in minutes
  const duration = differenceInMinutes(visibleEnd, visibleStart); // in minutes
  const startTimeStr = event.startTime < dayStart ? '' : getTimeString(event.startTime);
  const endTimeStr = (() => {
    if (event.endTime > nextDayStart) return ''; // Event continues to next day
    if (event.endTime.getTime() === nextDayStart.getTime()) return '24:00'; // Exceptional case to display 24:00
    return getTimeString(event.endTime);
  })();
  const timeString = startTimeStr === endTimeStr ? startTimeStr : `${startTimeStr} - ${endTimeStr}`;
  return (
    <Box
      className={classes.eventInstance}
      position="absolute"
      top={`calc(${getCellHeightCalc(theme)} / 60 * ${minFromDayStart})`}
      left={`${(colIdx * 100) / fullColCount}%`}
      width={colCount / fullColCount}
      height={`calc(${getCellHeightCalc(theme)} / 60 * ${duration})`}
      style={{
        border: `${theme.spacing(0.125)}px solid ${event.colorCode}`,
        backgroundColor: `${event.colorCode}c0`,
      }}
      onClick={() => onEventClick(event)}
    >
      <Typography
        className={classes.eventText}
        variant="body2"
        style={{
          color: theme.palette.getContrastText(event.colorCode),
        }}
      >
        {`${event.title}${duration < SINGLE_LINE_MINUTE * 2 ? `, ${timeString}` : ''}`}
      </Typography>
      {duration >= SINGLE_LINE_MINUTE * 2 && (
        <Typography
          className={classes.eventText}
          variant="body2"
          style={{
            color: theme.palette.getContrastText(event.colorCode),
          }}
        >
          {timeString}
        </Typography>
      )}
    </Box>
  );
};

export default PartDayEvent;
