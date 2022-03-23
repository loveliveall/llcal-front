import React from 'react';
import addDays from 'date-fns/addDays';
import addMinutes from 'date-fns/addMinutes';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import maxDate from 'date-fns/max';
import minDate from 'date-fns/min';
import startOfDay from 'date-fns/startOfDay';
import subMinutes from 'date-fns/subMinutes';

import { styled } from '@mui/material/styles';

import TimeIndicator from './TimeIndicator';
import FullDayEvent from './FullDayEvent';
import PartDayEvent from './PartDayEvent';
import { getCellHeightCalc, SINGLE_LINE_MINUTE } from './styles';
import { getRenderInfo } from './algorithm';

import { getEventsInRange } from '../utils/utils';
import { ICalendarEvent, IEventInfo } from '../utils/types';

const Root = styled('div')`
  width: 100%;
`;
const Flex = styled('div')`
  display: flex;
  width: 100%;
`;
const TimeIndicatorSpace = styled('div')(({ theme }) => ({
  minWidth: theme.spacing(7),
}));
const FullDayEvents = styled('div')(({ theme }) => ({
  flex: '1 1 100%',
  maxWidth: `calc(100% - ${theme.spacing(7)})`,
}));
const TopGutter = styled('div')(({ theme }) => ({
  height: `calc(${theme.typography.body2.lineHeight}em / 2)`,
}));
const TimeGrid = styled('div')(({ theme }) => ({
  position: 'relative',
  flex: '1 1 100%',
  boxSizing: 'border-box',
  borderTop: `1px solid ${theme.palette.divider}`,
}));
const TimeCell = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  borderBottom: `1px solid ${theme.palette.divider}`,
  height: `calc(${getCellHeightCalc(theme)})`,
  width: '100%',
}));

interface IOwnProps {
  dayStartHour: number,
  events: IEventInfo[],
  onEventClick: (event: ICalendarEvent) => void,
  currDate: Date,
}
type DayViewPorps = IOwnProps;

const DayView: React.FC<DayViewPorps> = ({
  dayStartHour, events, onEventClick, currDate,
}) => {
  const dayStart = startOfDay(currDate);
  const dayEnd = addDays(dayStart, 1); // Exclusive
  const visibleEventsInfo = getEventsInRange(events, dayStart, dayEnd).sort((a, b) => {
    if (a.orig.startTime < b.orig.startTime) return -1;
    if (a.orig.startTime > b.orig.startTime) return 1;
    if (a.orig.endTime > b.orig.endTime) return -1;
    if (a.orig.endTime < b.orig.endTime) return 1;
    return 0;
  }).map((event) => {
    const visibleStartV = maxDate([event.startTimeV, dayStart]);
    const visibleEndV = minDate([event.endTimeV, dayEnd]);
    // Ensure that each event has at least SINGLE_LINE_MINUTE duration of visible instance
    const adjusted = (() => {
      if (differenceInMinutes(visibleEndV, visibleStartV) >= SINGLE_LINE_MINUTE) {
        // Already has longer visible instance
        return {
          start: visibleStartV,
          end: visibleEndV,
        };
      }
      // Shorter visible instance
      // Preserve start as far as possible
      const start = minDate([subMinutes(dayEnd, SINGLE_LINE_MINUTE), visibleStartV]);
      const end = addMinutes(start, SINGLE_LINE_MINUTE);
      return {
        start,
        end,
      };
    })();
    return {
      event,
      fullDay: event.orig.allDay || (event.startTimeV <= dayStart && dayEnd <= event.endTimeV),
      visibleStartV: adjusted.start,
      visibleEndV: adjusted.end,
    };
  });
  const fullDayEventsInfo = visibleEventsInfo.filter((item) => item.fullDay);
  const partDayEventsInfo = visibleEventsInfo.filter((item) => !item.fullDay);
  const partDayRenderInfo = getRenderInfo(partDayEventsInfo);
  return (
    <Root>
      {/* Fullday events view */}
      <Flex>
        {/* Left gutter for spacing time indicator column */}
        <TimeIndicatorSpace />
        {/* Render fullday events. If none, render top gutter */}
        {fullDayEventsInfo.length === 0 ? <TopGutter /> : (
          <FullDayEvents>
            {fullDayEventsInfo.map((item) => (
              <FullDayEvent
                key={item.event.orig.id}
                event={item.event}
                currDate={currDate}
                onEventClick={onEventClick}
              />
            ))}
          </FullDayEvents>
        )}
      </Flex>
      {/* TimeGrid view */}
      <Flex>
        <TimeIndicatorSpace>
          <TimeIndicator dayStartHour={dayStartHour} />
        </TimeIndicatorSpace>
        <TimeGrid>
          {partDayRenderInfo.map((info) => (
            <PartDayEvent
              key={info.event.orig.id}
              thisDayStart={dayStart}
              dayStartHour={dayStartHour}
              event={info.event}
              visibleStartV={info.visibleStartV}
              visibleEndV={info.visibleEndV}
              colIdx={info.colIdx}
              colCount={info.colCount}
              fullColCount={info.fullColCount}
              onEventClick={onEventClick}
            />
          ))}
          {/* Draw time line */}
          {new Array(24).fill(null).map((_, idx) => (
            <TimeCell key={idx} /> // eslint-disable-line react/no-array-index-key
          ))}
        </TimeGrid>
      </Flex>
    </Root>
  );
};

export default DayView;
