import React from 'react';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import isSameDay from 'date-fns/isSameDay';
import isSameMonth from 'date-fns/isSameMonth';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { ICalendarEvent, TMonthEventGrid, ISingleEventRenderInfo } from '../utils/types';
import { getEventsInRange } from '../utils/utils';

import WeekEventRow from './WeekEventRow';

const isMidnight = (date: Date) => date.getHours() === 0 && date.getMinutes() === 0;

const useStyles = makeStyles((theme) => {
  const headerMarginUnit = 0.5;
  const circleDiameter = `calc(${theme.spacing(headerMarginUnit / 2)}px + ${theme.typography.body2.lineHeight}em)`;
  return createStyles({
    row: {
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
      flex: '1 1 0%',
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    cell: {
      flex: '1 1 0%',
      borderRight: `1px solid ${theme.palette.divider}`,
      textAlign: 'center',
      zIndex: -1,
    },
    diffMonthCell: {
      backgroundColor: theme.palette.grey[300],
    },
    todayDate: {
      borderRadius: '50%',
      width: circleDiameter,
      height: circleDiameter,
      color: theme.palette.getContrastText(theme.palette.primary.main),
      backgroundColor: theme.palette.primary.main,
      lineHeight: circleDiameter,
      margin: `${theme.spacing(headerMarginUnit / 2)}px 0px ${theme.spacing(headerMarginUnit / 2)}px 0px`,
      fontWeight: 'bold',
    },
    otherDate: {
      margin: `${theme.spacing(headerMarginUnit)}px 0px ${theme.spacing(headerMarginUnit)}px 0px`,
      fontWeight: 'bold',
    },
    diffMonthDate: {
      color: theme.palette.grey[600],
      fontWeight: 'inherit',
    },
    eventOverlay: {
      width: '100%',
      marginTop: `calc(1px + ${theme.spacing(headerMarginUnit * 2)}px + ${theme.typography.body2.lineHeight}em)`, // Border, top/bot margin, line-height
    },
  });
});

interface IOwnProps {
  rangeStart: Date,
  events: ICalendarEvent[],
  currDate: Date,
}
type WeekRowProps = IOwnProps;

const WeekRow: React.FC<WeekRowProps> = ({
  rangeStart, events, currDate,
}) => {
  const classes = useStyles();

  const now = new Date();
  const rangeEnd = addDays(rangeStart, 7); // Exlusive
  const eventRenderGrid = getEventsInRange(events, rangeStart, rangeEnd).map((event) => {
    const visibleStart = event.startTime < rangeStart ? rangeStart : event.startTime;
    const startSlotIdx = differenceInCalendarDays(visibleStart, rangeStart);
    const slotCount = (() => {
      const midnightRevision = isMidnight(event.endTime) ? -1 : 0;
      const fullCount = differenceInCalendarDays(event.endTime, visibleStart) + 1 + midnightRevision;
      const maxAvailCount = differenceInCalendarDays(rangeEnd, visibleStart);
      return Math.max(Math.min(fullCount, maxAvailCount), 1);
    })();
    return {
      event,
      startSlotIdx,
      slotCount,
    };
  }).sort((a, b) => {
    // 0. Multiday event wins single day event
    if (a.slotCount > 1 && b.slotCount === 1) return -1;
    if (a.slotCount === 1 && b.slotCount > 1) return 1;
    // Both events have same multiday/singleday parity
    const aEvent = a.event;
    const bEvent = b.event;
    const aStartTime = aEvent.allDay ? startOfDay(aEvent.startTime) : aEvent.startTime;
    const bStartTime = bEvent.allDay ? startOfDay(bEvent.startTime) : bEvent.startTime;
    // 1. Earlier starttime comes first
    if (aStartTime < bStartTime) return -1;
    if (aStartTime > bStartTime) return 1;
    // 2. Tie breaker: Longer event comes first, i.e. later endtime comes first
    const aEndTime = aEvent.allDay ? endOfDay(aEvent.endTime) : aEvent.endTime;
    const bEndTime = bEvent.allDay ? endOfDay(bEvent.endTime) : bEvent.endTime;
    if (aEndTime > bEndTime) return -1;
    if (aEndTime < bEndTime) return 1;
    // 3. Tie breaker: same start/end time. Allday event wins
    if (aEvent.allDay) return -1;
    return 1;
  }).reduce((acc, curr) => {
    const { startSlotIdx, slotCount } = curr;
    const emptySlotIdx = acc.findIndex((row) => row[startSlotIdx] === null);
    const fillRow = (row: (ISingleEventRenderInfo | null)[]) => row.map((value, idx) => {
      if (startSlotIdx === idx) {
        return {
          event: curr.event,
          startSlotIdx,
          slotCount,
        };
      }
      if (startSlotIdx < idx && idx < startSlotIdx + slotCount) {
        return {
          event: curr.event,
          startSlotIdx: -1, // Not render this event. Hold it for context
          slotCount: 0,
        };
      }
      return value;
    });
    if (emptySlotIdx === -1) {
      // No empty slot. Create new row
      const newRow = fillRow(new Array(7).fill(null));
      return [...acc, newRow];
    }
    return acc.map((item, idx) => (idx !== emptySlotIdx ? item : fillRow(item)));
  }, [] as TMonthEventGrid);
  return (
    <div className={classes.row}>
      {/* Cell display */}
      <Box display="flex" position="absolute" width="100%" top={0} left={0} bottom={0}>
        {new Array(7).fill(null).map((_, idx) => {
          const cellDate = addDays(rangeStart, idx);
          const isToday = isSameDay(cellDate, now);
          const isTargetMonth = isSameMonth(cellDate, currDate);
          return (
            <Box key={Math.random()} className={`${classes.cell} ${!isTargetMonth && classes.diffMonthCell}`}>
              <Box display="flex" justifyContent="center">
                <span
                  className={`${isToday ? classes.todayDate : classes.otherDate}
                    ${!isTargetMonth && classes.diffMonthDate}`}
                >
                  {cellDate.getDate()}
                </span>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box display="flex" className={classes.eventOverlay}>
        <WeekEventRow eventRenderGrid={eventRenderGrid} />
      </Box>
    </div>
  );
};

export default WeekRow;
