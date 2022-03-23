import React from 'react';
import areEqual from 'fast-deep-equal';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import { styled } from '@mui/material/styles';

import {
  ICalendarEvent,
  IEventInfo,
  TMonthEventGrid,
  ISingleEventRenderInfo,
} from '../utils/types';
import { getEventsInRange } from '../utils/utils';
import { headerMarginUnit } from './styles';

import WeekCellFrame from './WeekCellFrame';
import WeekEventRow from './WeekEventRow';

const isMidnight = (date: Date) => date.getHours() === 0 && date.getMinutes() === 0;

const Row = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  overflow: 'hidden',
  flex: '1 1 0%',
  boxSizing: 'border-box',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));
const CellFrame = styled('div')`
  display: flex;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
`;
const EventOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  fontSize: theme.typography.body2.fontSize, // Let line-height em work correctly
  marginTop: `calc(1px + ${theme.spacing(headerMarginUnit * 2)} + ${theme.typography.body2.lineHeight}em)`, // Border, top/bot margin, line-height
}));

interface IOwnProps {
  isMobile: boolean,
  dayStartHour: number,
  rangeStart: Date,
  events: IEventInfo[],
  onEventClick: (event: ICalendarEvent) => void,
  onMonthDateClick: (date: Date) => void,
  currDate: Date,
}
type WeekRowProps = IOwnProps;

const WeekRow: React.FC<WeekRowProps> = ({
  isMobile, dayStartHour, rangeStart, events, currDate, onEventClick, onMonthDateClick,
}) => {
  const rangeEnd = addDays(rangeStart, 7); // Exlusive
  const eventRenderGrid = getEventsInRange(events, rangeStart, rangeEnd).map((event) => {
    const visibleStartV = event.startTimeV < rangeStart ? rangeStart : event.startTimeV;
    const startSlotIdx = differenceInCalendarDays(visibleStartV, rangeStart);
    const slotCount = (() => {
      const midnightRevision = isMidnight(event.endTimeV) ? -1 : 0;
      const fullCount = differenceInCalendarDays(event.endTimeV, visibleStartV) + 1 + midnightRevision;
      const maxAvailCount = differenceInCalendarDays(rangeEnd, visibleStartV);
      return Math.max(Math.min(fullCount, maxAvailCount), 1);
    })();
    const dayDiff = differenceInCalendarDays(event.endTimeV, event.startTimeV);
    // Event is not block if a) it is not allday event and b) it resides in 00:00 - 24:00 in a same day
    const isNotBlock = !event.orig.allDay && (dayDiff === 0 || (dayDiff === 1 && isMidnight(event.endTimeV)));
    return {
      event,
      startSlotIdx,
      slotCount,
      isBlock: !isNotBlock,
    };
  }).sort((a, b) => {
    // 0. Block style event wins non-block style event
    if (a.isBlock && !b.isBlock) return -1;
    if (!a.isBlock && b.isBlock) return 1;
    // Both events have same block/non-block parity
    // 1. If visible segment starts first, it wins
    if (a.startSlotIdx < b.startSlotIdx) return -1;
    if (a.startSlotIdx > b.startSlotIdx) return 1;
    // 2. Tie breaker: Longer visible segment wins
    if (a.slotCount > b.slotCount) return -1;
    if (a.slotCount < b.slotCount) return 1;
    // Now from here, two events visually occupies the same dates
    const aEvent = a.event.orig;
    const bEvent = b.event.orig;
    const aStartTime = aEvent.allDay ? startOfDay(aEvent.startTime) : aEvent.startTime;
    const bStartTime = bEvent.allDay ? startOfDay(bEvent.startTime) : bEvent.startTime;
    // 3. Tie breaker: Earlier starttime comes first
    if (aStartTime < bStartTime) return -1;
    if (aStartTime > bStartTime) return 1;
    // 4. Tie breaker: Longer event comes first, i.e. later endtime comes first
    const aEndTime = aEvent.allDay ? startOfDay(addDays(aEvent.endTime, 1)) : aEvent.endTime;
    const bEndTime = bEvent.allDay ? startOfDay(addDays(aEvent.endTime, 1)) : bEvent.endTime;
    if (aEndTime > bEndTime) return -1;
    if (aEndTime < bEndTime) return 1;
    // 5. Tie breaker: same start/end time. Allday event wins
    if (aEvent.allDay) return -1;
    return 1;
  }).reduce((acc, curr) => {
    const { startSlotIdx, slotCount, isBlock } = curr;
    const emptySlotIdx = acc.findIndex((row) => row[startSlotIdx] === null);
    const fillRow = (row: (ISingleEventRenderInfo | null)[]) => row.map((value, idx) => {
      if (startSlotIdx === idx) {
        return {
          event: curr.event.orig,
          startSlotIdx,
          slotCount,
          isBlock,
        };
      }
      if (startSlotIdx < idx && idx < startSlotIdx + slotCount) {
        return {
          event: curr.event.orig,
          startSlotIdx: -1, // Not render this event. Hold it for context
          slotCount: 0,
          isBlock,
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
    <Row>
      {/* Cell display */}
      <WeekCellFrame
        dayStartHour={dayStartHour}
        currDate={currDate}
        rangeStart={rangeStart}
        onMonthDateClick={onMonthDateClick}
      />
      {/* Dummy overlay for mobile click */}
      {isMobile && (
        <CellFrame sx={{ zIndex: 1 }}>
          {new Array(7).fill(null).map((_, idx) => {
            const cellDate = addDays(rangeStart, idx);
            const onClick = () => onMonthDateClick(cellDate);
            const onKeyUp = (ev: React.KeyboardEvent<HTMLDivElement>) => {
              if (ev.key === 'Enter') {
                onMonthDateClick(cellDate);
              }
            };
            return (
              // eslint-disable-next-line jsx-a11y/control-has-associated-label
              <div
                key={cellDate.toISOString()}
                role="button"
                tabIndex={0}
                onClick={onClick}
                onKeyUp={onKeyUp}
                style={{
                  width: `${100 / 7}%`,
                  cursor: 'pointer',
                }}
              />
            );
          })}
        </CellFrame>
      )}
      <EventOverlay>
        <WeekEventRow
          isMobile={isMobile}
          dayStartHour={dayStartHour}
          eventRenderGrid={eventRenderGrid}
          onEventClick={onEventClick}
        />
      </EventOverlay>
    </Row>
  );
};

export default React.memo(WeekRow, (prevProps, nextProps) => (
  areEqual(prevProps.isMobile, nextProps.isMobile)
  && areEqual(prevProps.dayStartHour, nextProps.dayStartHour)
  && areEqual(prevProps.rangeStart, nextProps.rangeStart)
  && areEqual(prevProps.events, nextProps.events)
  && areEqual(prevProps.currDate, nextProps.currDate)
));
