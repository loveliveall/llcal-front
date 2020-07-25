import React from 'react';
import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';
import isSameMonth from 'date-fns/isSameMonth';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { headerMarginUnit } from './styles';

const useStyles = makeStyles((theme) => {
  const circleDiameter = `calc(${theme.spacing(headerMarginUnit / 2)}px + ${theme.typography.body2.lineHeight}em)`;
  return {
    cellFrame: {
      display: 'flex',
      position: 'absolute',
      width: '100%',
      top: 0,
      left: 0,
      bottom: 0,
    },
    cell: {
      flex: '1 1 0%',
      boxSizing: 'border-box',
      borderRight: `1px solid ${theme.palette.divider}`,
      textAlign: 'center',
    },
    diffMonthCell: {
      backgroundColor: theme.palette.grey[300],
    },
    cellWrap: {
      display: 'flex',
      justifyContent: 'center',
    },
    todayDate: {
      borderRadius: '50%',
      width: circleDiameter,
      height: circleDiameter,
      color: theme.palette.getContrastText(theme.palette.primary.main),
      backgroundColor: theme.palette.primary.main,
      lineHeight: circleDiameter,
      margin: `${theme.spacing(headerMarginUnit / 2)}px 0px ${theme.spacing(headerMarginUnit / 2)}px 0px`,
      fontWeight: 'bold',
    },
    otherDate: {
      margin: `${theme.spacing(headerMarginUnit)}px 0px ${theme.spacing(headerMarginUnit)}px 0px`,
      fontWeight: 'bold',
    },
    diffMonthDate: {
      color: theme.palette.grey[600],
      fontWeight: 'inherit',
    },
  };
});

interface OwnProps {
  currDate: Date,
  rangeStart: Date,
  onMonthDateClick: (date: Date) => void,
}
type WeekCellFrameProps = OwnProps;

const WeekCellFrame: React.FC<WeekCellFrameProps> = ({
  currDate, rangeStart, onMonthDateClick,
}) => {
  const classes = useStyles();
  const now = new Date();

  return (
    <div className={classes.cellFrame}>
      {new Array(7).fill(null).map((_, idx) => {
        const cellDate = addDays(rangeStart, idx);
        const isToday = isSameDay(cellDate, now);
        const isTargetMonth = isSameMonth(cellDate, currDate);
        const onClick = () => onMonthDateClick(cellDate);
        return (
          <div key={cellDate.toISOString()} className={`${classes.cell} ${!isTargetMonth && classes.diffMonthCell}`}>
            <div className={classes.cellWrap}>
              <Typography
                className={`${isToday ? classes.todayDate : classes.otherDate}
                  ${!isTargetMonth && classes.diffMonthDate}`}
                style={{
                  cursor: 'pointer',
                }}
                component="span"
                variant="body2"
                onClick={onClick}
              >
                {cellDate.getDate()}
              </Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekCellFrame;
