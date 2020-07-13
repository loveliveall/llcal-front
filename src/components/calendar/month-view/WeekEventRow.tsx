import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import SingleEvent from './SingleEvent';
import { useCommonStyles } from './styles';
import { TMonthEventGrid, ICalendarEvent, ISingleEventRenderInfo } from '../utils/types';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    overflow: 'hidden',
    width: '100%',
    zIndex: 0,
  },
  singleRow: {
    display: 'flex',
    width: '100%',
  },
  singleSlot: {
    width: `${100 / 7}%`,
  },
  pad: {
    padding: theme.spacing(1),
  },
}));

interface IOwnProps {
  isMobile: boolean,
  eventRenderGrid: TMonthEventGrid,
  onEventClick: (event: ICalendarEvent) => void,
}
type WeekEventRowProps = IOwnProps;

const WeekEventRow: React.FC<WeekEventRowProps> = ({
  isMobile, eventRenderGrid, onEventClick,
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
    setHeightInfo({
      offset: 0,
      item: 0,
    });
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
    window.dispatchEvent(new Event('resize'));
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [isMobile, eventRenderGrid.length]);
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
        <div key={JSON.stringify(row)} className={classes.singleRow}>
          {row.map((instance) => {
            if (instance === null) return <div key={Math.random()} className={classes.singleSlot} />; // Render empty slot
            if (instance.startSlotIdx === -1) return null; // Do not render
            const { event } = instance;
            return (
              <div
                key={JSON.stringify(instance)}
                style={{
                  width: `${(100 * instance.slotCount) / 7}%`,
                }}
              >
                <SingleEvent
                  isMobile={isMobile}
                  event={event}
                  isBlock={instance.isBlock}
                  onEventClick={onEventClick}
                />
              </div>
            );
          })}
        </div>
      ))}
      {/* `more` button */}
      <div className={classes.singleRow}>
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
            <div key={reactKey} className={classes.singleSlot}>
              <Box
                className={classesCommon.eventInstance}
                onClick={onMoreClick}
              >
                <Typography
                  className={classesCommon.eventText}
                  variant="body2"
                >
                  {`+${invisibleCount} more`}
                </Typography>
              </Box>
            </div>
          );
        })}
      </div>
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
        <div className={classes.pad}>
          {morePopup.eventGrid.map((instance) => {
            const { event } = instance;
            return (
              <SingleEvent
                key={JSON.stringify(instance)}
                isMobile={isMobile}
                event={event}
                isBlock={instance.isBlock}
                onEventClick={onEventClick}
              />
            );
          })}
        </div>
      </Popover>
    </div>
  );
};

export default WeekEventRow;
