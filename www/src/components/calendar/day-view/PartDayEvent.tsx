import React from 'react';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import startOfDay from 'date-fns/startOfDay';

import { makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { getCellHeightCalc } from './styles';
import { ICalendarEvent } from '../utils/types';

function hhmmDisplay(date: Date): string {
  return `${`0${date.getHours()}`.slice(-2)}:${`0${date.getMinutes()}`.slice(-2)}`;
}

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
  start: Date,
  end: Date,
  colIdx: number,
  colCount: number,
  fullColCount: number,
  onEventClick: (event: ICalendarEvent) => void,
}
type PartDayEventProps = IOwnProps;

const PartDayEvent: React.FC<PartDayEventProps> = ({
  event, start, end, colIdx, colCount, fullColCount, onEventClick,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const dayStart = startOfDay(start);
  const minFromDayStart = differenceInMinutes(start, dayStart); // in minutes
  const duration = differenceInMinutes(end, start); // in minutes
  const startTimeString = event.startTime < start ? '' : hhmmDisplay(start);
  const endTimeString = (() => {
    if (end < event.endTime) return '';
    if (dayStart.getDate() !== end.getDate()) return '24:00';
    return hhmmDisplay(end);
  })();
  const timeString = `${startTimeString} - ${endTimeString}`;
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
        {`${event.title}${duration < 60 ? `, ${timeString}` : ''}`}
      </Typography>
      {duration >= 60 && (
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
