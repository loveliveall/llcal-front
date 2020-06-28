import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import SingleEvent from './SingleEvent';
import { useCommonStyles } from './styles';
import { TMonthEventGrid, ICalendarEvent, ISingleEventRenderInfo } from '../utils/types';

const useStyles = makeStyles(() => ({
  root: {
    overflow: 'hidden',
    width: '100%',
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
  const classesCommon = useCommonStyles();

  const [morePopup, setMorePopup] = React.useState<{
    anchorEl: HTMLDivElement | null,
    eventGrid: ISingleEventRenderInfo[],
  }>({
    anchorEl: null,
    eventGrid: [],
  });
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
            return (
              <Box key={Math.random()} width={instance.slotCount / 7}>
                <SingleEvent event={event} isBlock={!isNotBlock} onEventClick={onEventClick} />
              </Box>
            );
          })}
        </Box>
      ))}
      {/* `more` button */}
      <Box display="flex" width={1}>
        {sliceRowAt !== -1 && new Array(7).fill(null).map((_, idx) => {
          const reactKey = `button-wrapper-${idx}`;
          const invisibleCount = eventRenderGrid.slice(sliceRowAt).reduce(
            (acc, curr) => acc + (curr[idx] !== null ? 1 : 0), 0,
          );
          if (invisibleCount === 0) return <Box key={reactKey} width={1 / 7} />;
          const onMoreClick = (event: React.MouseEvent<HTMLDivElement>) => {
            const thisDayEvents = eventRenderGrid.map((r) => r[idx]).filter(
              (i): i is ISingleEventRenderInfo => i !== null,
            );
            setMorePopup({
              anchorEl: event.currentTarget,
              eventGrid: thisDayEvents,
            });
          };
          return (
            <Box key={reactKey} width={1 / 7}>
              <Box
                className={classesCommon.eventInstance}
                onClick={onMoreClick}
              >
                <Typography
                  className={classesCommon.eventText}
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
      {/* `more` popover */}
      <Popover
        open={morePopup.anchorEl !== null}
        anchorEl={morePopup.anchorEl}
        onClose={() => setMorePopup((prev) => ({
          anchorEl: null,
          eventGrid: prev.eventGrid,
        }))}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        style={{
          width: '20%',
        }}
      >
        <Box padding={1}>
          {morePopup.eventGrid.map((instance) => {
            const { event } = instance;
            const isNotBlock = instance.slotCount === 1 && !event.allDay;
            return (
              <SingleEvent
                key={Math.random()}
                event={event}
                isBlock={!isNotBlock}
                onEventClick={onEventClick}
              />
            );
          })}
        </Box>
      </Popover>
    </div>
  );
};

export default WeekEventRow;
