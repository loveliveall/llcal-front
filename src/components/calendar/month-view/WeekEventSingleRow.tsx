import React from 'react';
import areEqual from 'fast-deep-equal';

import { makeStyles } from '@material-ui/core/styles';

import SingleEvent from './SingleEvent';
import { ICalendarEvent, ISingleEventRenderInfo } from '../utils/types';

const useStyles = makeStyles(() => ({
  singleRow: {
    display: 'flex',
    width: '100%',
  },
  singleSlot: {
    width: `${100 / 7}%`,
  },
}));

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
  const classes = useStyles();

  return (
    <div className={classes.singleRow}>
      {row.map((instance) => {
        if (instance === null) return <div key={Math.random()} className={classes.singleSlot} />; // Render empty slot
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
    </div>
  );
};

export default React.memo(WeekEventSingleRow, (prevProps, nextProps) => (
  areEqual(prevProps.isMobile, nextProps.isMobile)
  && areEqual(prevProps.dayStartHour, nextProps.dayStartHour)
  && areEqual(prevProps.row, nextProps.row)
));
