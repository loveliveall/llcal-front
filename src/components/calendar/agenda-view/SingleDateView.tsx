import React from 'react';
import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';
import subHours from 'date-fns/subHours';

import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import SingleEventRow from './SingleEventRow';

import { getEventsInRange, WEEKDAY_SHORT_NAMES } from '../utils/utils';
import { ICalendarEvent, IEventInfo } from '../utils/types';

const Row = styled('div')`
  width: 100%;
`;
const Content = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
}));
const TitleTypo = styled(Typography)(({ theme }) => ({
  paddingBottom: theme.spacing(0.5),
}));

interface IOwnProps {
  isMobile: boolean,
  showFullDate: boolean,
  dayStartHour: number,
  startOfDay: Date,
  events: IEventInfo[],
  onEventClick: (event: ICalendarEvent) => void,
}
type SingleDateViewProps = IOwnProps;

const SingleDateView: React.FC<SingleDateViewProps> = ({
  isMobile, showFullDate, dayStartHour, startOfDay, events, onEventClick,
}) => {
  const now = new Date();
  const rangeEnd = addDays(startOfDay, 1);
  const visibleEvents = getEventsInRange(events, startOfDay, rangeEnd).sort((a, b) => {
    const aFullDay = a.orig.allDay || (a.startTimeV <= startOfDay && rangeEnd <= a.endTimeV);
    const bFullDay = b.orig.allDay || (b.startTimeV <= startOfDay && rangeEnd <= b.endTimeV);
    if (aFullDay && !bFullDay) return -1;
    if (!aFullDay && bFullDay) return 1;
    // Both have same fullday parity
    // Earlier starttime wins
    if (a.orig.startTime < b.orig.startTime) return -1;
    if (a.orig.startTime > b.orig.startTime) return 1;
    // For fullday, longer event wins
    if (aFullDay && bFullDay) {
      if (a.orig.endTime > b.orig.endTime) return -1;
      if (a.orig.endTime < b.orig.endTime) return -1;
    }
    // For non-fullday, shorter event wins
    if (a.orig.endTime < b.orig.endTime) return -1;
    if (a.orig.endTime > b.orig.endTime) return 1;
    return 0;
  });
  if (visibleEvents.length === 0) return <div id={`date-${startOfDay.getTime()}`} />;
  const dateText = (() => {
    const weekday = WEEKDAY_SHORT_NAMES[startOfDay.getDay()];
    if (!showFullDate) {
      return `${startOfDay.getDate()}일 (${weekday})`;
    }
    const year = `0000${startOfDay.getFullYear()}`.slice(-4);
    const month = `00${startOfDay.getMonth() + 1}`.slice(-2);
    const date = `00${startOfDay.getDate()}`.slice(-2);
    return `${year}.${month}.${date}. (${weekday})`;
  })();
  return (
    <Row
      id={`date-${startOfDay.getTime()}`}
      sx={isSameDay(startOfDay, subHours(now, dayStartHour)) ? {
        backgroundColor: 'lightblue',
      } : undefined}
    >
      <Divider />
      <Content>
        <TitleTypo variant="subtitle1">
          {dateText}
        </TitleTypo>
        {visibleEvents.map((event) => (
          <SingleEventRow
            key={Math.random()}
            isMobile={isMobile}
            dayStartHour={dayStartHour}
            event={event}
            onEventClick={onEventClick}
            startOfDay={startOfDay}
            nextDayStart={rangeEnd}
          />
        ))}
      </Content>
    </Row>
  );
};

export default SingleDateView;
