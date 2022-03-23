import React from 'react';
import addDays from 'date-fns/addDays';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import SingleDateView from './SingleDateView';
import { getEventsInRange } from '../utils/utils';
import { ICalendarEvent, IEventInfo } from '../utils/types';

const Root = styled('div')`
  width: 100%;
`;
const InnerBoxDiv = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}));

interface IOwnProps {
  isLoading: boolean,
  isMobile: boolean,
  dayStartHour: number,
  rangeStart: Date,
  rangeEnd: Date,
  events: IEventInfo[],
  onEventClick: (event: ICalendarEvent) => void,
}
type AgendaViewProps = IOwnProps;

const AgendaView: React.FC<AgendaViewProps> = ({
  isLoading, isMobile, dayStartHour, events, rangeStart, rangeEnd, onEventClick,
}) => {
  const eventsInRange = getEventsInRange(events, rangeStart, rangeEnd);
  return (
    <Root>
      {isLoading && (
        <InnerBoxDiv>
          <HourglassEmptyIcon fontSize="large" color="inherit" />
          <Typography variant="h6">
            일정을 불러오는 중입니다.
          </Typography>
        </InnerBoxDiv>
      )}
      {!isLoading && (eventsInRange.length === 0 ? (
        <InnerBoxDiv>
          <EventAvailableIcon fontSize="large" color="inherit" />
          <Typography variant="h6">
            기간 내에 일정이 없습니다.
          </Typography>
        </InnerBoxDiv>
      ) : (
        new Array(differenceInCalendarDays(rangeEnd, rangeStart)).fill(null).map((_, idx) => {
          const targetDate = addDays(rangeStart, idx);
          return (
            <SingleDateView
              key={targetDate.getTime()}
              isMobile={isMobile}
              dayStartHour={dayStartHour}
              showFullDate
              startOfDay={targetDate}
              events={events}
              onEventClick={onEventClick}
            />
          );
        })
      ))}
    </Root>
  );
};

export default AgendaView;
