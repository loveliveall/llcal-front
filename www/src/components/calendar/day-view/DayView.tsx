import React from 'react';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';

import { makeStyles, Theme } from '@material-ui/core/styles';

import TimeIndicator from './TimeIndicator';
import FullDayEvent from './FullDayEvent';
import PartDayEvent from './PartDayEvent';
import { getCellHeightCalc } from './styles';
import { getRenderInfo } from './algorithm';

import { getEventsInRange } from '../utils/utils';
import { ICalendarEvent } from '../utils/types';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    overflow: 'auto',
    height: '100%',
  },
  flex: {
    display: 'flex',
    width: '100%',
  },
  timeIndicator: {
    minWidth: theme.spacing(7),
  },
  fullEvent: {
    width: `calc(100% - ${theme.spacing(7)}px)`,
  },
  timeGrid: {
    position: 'relative',
    flex: '1 1 0%',
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  timeCell: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    height: `calc(${getCellHeightCalc(theme)})`,
    width: '100%',
  },
  topGutter: {
    height: `calc(${theme.typography.body2.lineHeight}em / 2)`,
  },
}));

interface IOwnProps {
  events: ICalendarEvent[],
  onEventClick: (event: ICalendarEvent) => void,
  currDate: Date,
}
type DayViewPorps = IOwnProps;

const DayView: React.FC<DayViewPorps> = ({
  events, onEventClick, currDate,
}) => {
  const classes = useStyles();

  const dayStart = startOfDay(currDate);
  const dayEnd = addDays(dayStart, 1); // Exclusive
  const visibleEventsInfo = getEventsInRange(events, dayStart, dayEnd).sort((a, b) => {
    if (a.startTime < b.startTime) return -1;
    if (a.startTime > b.startTime) return 1;
    if (a.endTime > b.endTime) return -1;
    if (a.endTime < b.endTime) return 1;
    return 0;
  }).map((event) => ({
    event,
    fullDay: event.allDay || (event.startTime <= dayStart && dayEnd <= event.endTime),
    visibleStart: event.startTime <= dayStart ? dayStart : event.startTime,
    visibleEnd: dayEnd <= event.endTime ? dayEnd : event.endTime,
  }));
  const fullDayEventsInfo = visibleEventsInfo.filter((item) => item.fullDay);
  const partDayEventsInfo = visibleEventsInfo.filter((item) => !item.fullDay);
  const partDayRenderInfo = getRenderInfo(partDayEventsInfo);
  return (
    <div className={classes.root}>
      {/* Fullday events view */}
      <div className={classes.flex}>
        {/* Left gutter for spacing time indicator column */}
        <div className={classes.timeIndicator} />
        {/* Render fullday events. If none, render top gutter */}
        {fullDayEventsInfo.length === 0 ? <div className={classes.topGutter} /> : (
          <div className={classes.fullEvent}>
            {fullDayEventsInfo.map((item) => (
              <FullDayEvent
                key={JSON.stringify(item)}
                event={item.event}
                currDate={currDate}
                onEventClick={onEventClick}
              />
            ))}
          </div>
        )}
      </div>
      {/* TimeGrid view */}
      <div className={classes.flex}>
        <div className={classes.timeIndicator}>
          <TimeIndicator />
        </div>
        <div className={classes.timeGrid}>
          {partDayRenderInfo.map((info) => (
            <PartDayEvent
              key={`${info.visibleStart}-${info.colIdx}`}
              event={info.event}
              visibleStart={info.visibleStart}
              visibleEnd={info.visibleEnd}
              colIdx={info.colIdx}
              colCount={info.colCount}
              fullColCount={info.fullColCount}
              onEventClick={onEventClick}
            />
          ))}
          {/* Draw time line */}
          {new Array(24).fill(null).map((_, idx) => (
            <div key={idx} className={classes.timeCell} /> // eslint-disable-line react/no-array-index-key
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;
