import React from 'react';
import areEqual from 'fast-deep-equal';

import { styled } from '@mui/material/styles';

import SingleEvent from './SingleEvent';
import { ICalendarEvent, ISingleEventRenderInfo } from '../utils/types';

const SingleRow = styled('div')`
  display: flex;
  width: 100%;
`;
const SingleSlot = styled('div')`
  width: ${100 / 7}%;
`;

interface OwnProps {
  isMobile: boolean,
  dayStartHour: number,
  row: (ISingleEventRenderInfo | null)[],
  onEventClick: (event: ICalendarEvent) => void,
}
type WeekEventSingleRowProps = OwnProps;

const WeekEventSingleRow: React.FC<WeekEventSingleRowProps> = ({
  isMobile, dayStartHour, row, onEventClick,
}) => {
  return (
    <SingleRow>
      {row.map((instance) => {
        if (instance === null) return <SingleSlot key={Math.random()} />; // Render empty slot
        if (instance.startSlotIdx === -1) return null; // Do not render
        const { event } = instance;
        return (
          <div
            key={instance.event.id}
            style={{
              width: `${(100 * instance.slotCount) / 7}%`,
            }}
          >
            <SingleEvent
              isMobile={isMobile}
              dayStartHour={dayStartHour}
              event={event}
              isBlock={instance.isBlock}
              onEventClick={onEventClick}
            />
          </div>
        );
      })}
    </SingleRow>
  );
};

export default React.memo(WeekEventSingleRow, (prevProps, nextProps) => (
  areEqual(prevProps.isMobile, nextProps.isMobile)
  && areEqual(prevProps.dayStartHour, nextProps.dayStartHour)
  && areEqual(prevProps.row, nextProps.row)
));
