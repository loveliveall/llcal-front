import React from 'react';

import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { TMonthEventGrid } from '../utils/types';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    overflow: 'hidden',
    width: '100%',
  },
  eventInstance: {
    margin: '1px 3px 1px 2px',
    borderRadius: theme.spacing(0.5),
    padding: '1px',
    paddingLeft: theme.spacing(0.75),
    paddingRight: theme.spacing(0.75),
  },
}));

interface IOwnProps {
  eventRenderGrid: TMonthEventGrid,
}
type WeekEventRowProps = IOwnProps;

const WeekEventRow: React.FC<WeekEventRowProps> = ({
  eventRenderGrid,
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
  console.log(heightInfo);
  console.log(sliceRowAt);
  return (
    <div ref={ref} className={classes.root}>
      {(sliceRowAt === -1 ? eventRenderGrid : eventRenderGrid.slice(0, sliceRowAt)).map((row) => (
        <Box key={Math.random()} display="flex" width={1}>
          {row.map((instance) => {
            if (instance === null) return <Box key={Math.random()} width={1 / 7} />; // Render empty slot
            if (instance.startSlotIdx === -1) return null; // Do not render
            const { event } = instance;
            return (
              <Box key={Math.random()} width={instance.slotCount / 7}>
                <Box className={classes.eventInstance} style={{ backgroundColor: event.colorCode }}>
                  <Typography
                    noWrap
                    variant="body2"
                    style={{ color: theme.palette.getContrastText(event.colorCode) }}
                  >
                    {event.title}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          {/* Need truncation indicator */}
        </Box>
      ))}
    </div>
  );
};

export default WeekEventRow;
