import React from 'react';
import { useSelector } from 'react-redux';
import addDays from 'date-fns/addDays';
import subHours from 'date-fns/subHours';
import startOfDay from 'date-fns/startOfDay';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Calendar, { normalizeEvents } from '@/components/calendar';
import { getEventsInRange } from '@/components/calendar/utils/utils';
import SingleEventRow from '@/components/calendar/agenda-view/SingleEventRow';

import useMobileCheck from '@/hooks/useMobileCheck';
import { AppState } from '@/store';
import { filterEvents } from '@/utils';
import {
  ClientEvent,
  VACheckState,
  CategoryCheckState,
  ETCCheckState,
} from '@/types';
import { eventCategoryList } from '@/commonData';

const EXCEPT_ALERTS: CategoryCheckState = {
  ...eventCategoryList.reduce((acc, curr) => ({
    ...acc,
    [curr.id]: true,
  }), {}),
  ...eventCategoryList.filter((e) => e.groupId === 1).reduce((acc, curr) => ({
    ...acc,
    [curr.id]: false,
  }), {}),
};
const ONLY_ALERTS: CategoryCheckState = {
  ...eventCategoryList.reduce((acc, curr) => ({
    ...acc,
    [curr.id]: false,
  }), {}),
  ...eventCategoryList.filter((e) => e.groupId === 1).reduce((acc, curr) => ({
    ...acc,
    [curr.id]: true,
  }), {}),
};

const useStyles = makeStyles((theme) => ({
  center: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(1),
  },
  content: {
    padding: theme.spacing(1),
  },
}));

interface OwnProps {
  isLoading: boolean,
  vaFilter: VACheckState,
  etcFilter: ETCCheckState,
  events: ClientEvent[],
  onEventClick: (event: ClientEvent) => void,
}
type DashboardProps = OwnProps;

const Dashboard: React.FC<DashboardProps> = ({
  isLoading, vaFilter, etcFilter, events, onEventClick,
}) => {
  const classes = useStyles();
  const isMobile = useMobileCheck();
  const dayStartHour = useSelector((state: AppState) => state.settings.dayStartHour);
  const now = subHours(new Date(), dayStartHour);
  const rangeStart = startOfDay(now);
  const nextDay = addDays(rangeStart, 1);
  const rangeEnd = addDays(rangeStart, 7);
  const alerts = normalizeEvents(filterEvents(events, vaFilter, ONLY_ALERTS, etcFilter), dayStartHour);
  const todayAlerts = getEventsInRange(alerts, rangeStart, nextDay);
  const urgentBorder = addDays(now, 5);
  const urgentAlerts = todayAlerts.filter((e) => e.orig.endTime < urgentBorder);
  const otherAlerts = todayAlerts.filter((e) => e.orig.endTime >= urgentBorder);

  return (
    <>
      {urgentAlerts.length !== 0 && (
        <>
          <div className={classes.center}>
            <Typography variant="h6">
              종료 임박 예약/알림
            </Typography>
          </div>
          {urgentAlerts.map((e) => (
            <SingleEventRow
              key={Math.random()}
              isMobile={isMobile}
              dayStartHour={dayStartHour}
              event={e}
              onEventClick={onEventClick as any}
              startOfDay={rangeStart}
              nextDayStart={nextDay}
            />
          ))}
        </>
      )}
      {otherAlerts.length !== 0 && (
        <>
          <div className={classes.center}>
            <Typography variant="h6">
              예약/알림
            </Typography>
          </div>
          {otherAlerts.map((e) => (
            <SingleEventRow
              key={Math.random()}
              isMobile={isMobile}
              dayStartHour={dayStartHour}
              event={e}
              onEventClick={onEventClick as any}
              startOfDay={rangeStart}
              nextDayStart={nextDay}
            />
          ))}
        </>
      )}
      <div className={classes.center}>
        <Typography variant="h6">
          다가오는 일정
        </Typography>
      </div>
      <Calendar
        isLoading={isLoading}
        events={filterEvents(events, vaFilter, EXCEPT_ALERTS, etcFilter)}
        currDate={now} // This will not be used since we specify agenda range
        dayStartHour={dayStartHour}
        view="agenda"
        onEventClick={onEventClick}
        agendaStart={rangeStart}
        agendaEnd={rangeEnd}
      />
    </>
  );
};

export default Dashboard;
