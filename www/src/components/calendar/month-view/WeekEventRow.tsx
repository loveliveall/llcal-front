import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import { ICalendarEvent } from '../utils/types';

const useStyles = makeStyles(() => createStyles({
  root: {
    overflow: 'hidden',
  },
}));

interface IOwnProps {
  rangeStart: Date,
  targetEvents: (ICalendarEvent & {
    visibleStart: Date,
    visibleEnd: Date,
  })[],
}
type WeekEventRowProps = IOwnProps;

const WeekEventRow: React.FC<WeekEventRowProps> = ({
  rangeStart, targetEvents,
}) => {
  const classes = useStyles();

  const [offsetHeight, setOffsetHeight] = React.useState(0);
  const [scrollHeight, setScrollHeight] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const resizeHandler = () => {
      const cur = ref.current;
      setOffsetHeight(cur !== null ? cur.offsetHeight : 0);
      setScrollHeight(cur !== null ? cur.scrollHeight : 0);
    };
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);
  return (
    <div ref={ref} className={classes.root}>
      {`${offsetHeight} ${scrollHeight}`}
      <div>Test</div>
      <div>Two</div>
      <div>Test</div>
      <div>Two</div>
      <div>Test</div>
      <div>Two</div>
      {`${rangeStart.getTime()} ${targetEvents}`}
    </div>
  );
};

export default WeekEventRow;
