import React from 'react';

import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { TMonthEventGrid, ICalendarEvent } from '../utils/types';
import { getTimeString } from '../utils/utils';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    overflow: 'hidden',
    width: '100%',
  },
  eventInstance: {
    display: 'flex',
    alignItems: 'center',
    margin: '1px',
    marginRight: '2px',
    borderRadius: theme.spacing(0.5),
    padding: '1px',
    paddingLeft: theme.spacing(0.75),
    paddingRight: theme.spacing(0.75),
    cursor: 'pointer',
    '&:hover': {
      boxShadow: 'inset 0px 0px 0px 1000px rgba(0, 0, 0, 0.1)',
    },
  },
  eventCircle: {
    display: 'inline-block',
    borderRadius: theme.spacing(1),
    border: `${theme.spacing(0.5)}px solid`,
    marginRight: theme.spacing(0.25),
  },
  eventText: {
    display: 'inline-block',
    marginLeft: '1px',
  },
}));

interface IOwnProps {
  eventRenderGrid: TMonthEventGrid,
  onEventClick: (event: ICalendarEvent) => void,
}
type WeekEventRowProps = IOwnProps;

const WeekEventRow: React.FC<WeekEventRowProps> = ({
  eventRenderGrid, onEventClick,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  // Async setState does not be batched. Merge into one state for batch updating
  const [heightInfo, setHeightInfo] = React.useState({
    offset: 0,
    item: 0, // This value will be calculated on overflow
  });
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const resizeHandler = () => {
      // Clear previous timeout
      clearTimeout(timeoutId);
      // Add new timeout that fires state mutation
      timeoutId = setTimeout(() => {
        const cur = ref.current;
        if (cur === null) {
          setHeightInfo({
            offset: 0,
            item: 0,
          });
        } else {
          const { offsetHeight, scrollHeight } = cur;
          const rowCount = eventRenderGrid.length;
          const itemHeight = rowCount !== 0 && offsetHeight < scrollHeight ? scrollHeight / rowCount : 0;
          setHeightInfo((prev) => ({
            offset: offsetHeight,
            item: prev.item === 0 ? itemHeight : prev.item,
          }));
        }
      }, 150);
    };
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);
  const sliceRowAt = (() => {
    const { offset, item } = heightInfo;
    if (item === 0) return -1;
    const visibleCount = Math.floor(offset / item);
    const totalRow = eventRenderGrid.length;
    return visibleCount >= totalRow ? totalRow : Math.max(visibleCount - 1, 0);
  })();
  return (
    <div ref={ref} className={classes.root}>
      {(sliceRowAt === -1 ? eventRenderGrid : eventRenderGrid.slice(0, sliceRowAt)).map((row) => (
        <Box key={Math.random()} display="flex" width={1}>
          {row.map((instance) => {
            if (instance === null) return <Box key={Math.random()} width={1 / 7} />; // Render empty slot
            if (instance.startSlotIdx === -1) return null; // Do not render
            const { event } = instance;
            const isNotBlock = instance.slotCount === 1 && !event.allDay;
            const eventPrefix = !event.allDay ? `${getTimeString(event.startTime)} ` : '';
            const eventText = `${eventPrefix}${event.title}`;
            return (
              <Box key={Math.random()} width={instance.slotCount / 7}>
                <Box
                  className={classes.eventInstance}
                  style={{ backgroundColor: isNotBlock ? 'transparent' : event.colorCode }}
                  onClick={() => onEventClick(event)}
                >
                  {isNotBlock && (
                    <div
                      className={classes.eventCircle}
                      style={{ borderColor: event.colorCode }}
                    />
                  )}
                  <Typography
                    className={classes.eventText}
                    variant="body2"
                    style={isNotBlock ? undefined : {
                      color: theme.palette.getContrastText(event.colorCode),
                    }}
                    noWrap
                  >
                    {eventText}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      ))}
      <Box display="flex" width={1}>
        {sliceRowAt !== -1 && new Array(7).fill(null).map((_, idx) => {
          const invisibleCount = eventRenderGrid.slice(sliceRowAt).reduce(
            (acc, curr) => acc + (curr[idx] !== null ? 1 : 0), 0,
          );
          if (invisibleCount === 0) return <Box key={Math.random()} width={1 / 7} />;
          return (
            <Box key={Math.random()} width={1 / 7}>
              <Box className={classes.eventInstance}>
                <Typography
                  className={classes.eventText}
                  variant="body2"
                  noWrap
                >
                  {`+${invisibleCount} more`}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </div>
  );
};

export default WeekEventRow;
