import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { getCellHeightCalc } from './styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    width: '100%',
  },
  leftGutter: {
    flex: '1 1 0%',
  },
  rightGutter: {
    width: theme.spacing(1),
  },
  cellHeight: {
    height: `calc(${getCellHeightCalc(theme)})`,
  },
  timeText: {
    position: 'relative',
    top: `calc((-1) * ${theme.typography.body2.lineHeight}em / 2 + 1px)`,
    color: theme.palette.text.hint,
  },
}));

const TimeIndicator: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.leftGutter} />
      <div>
        {new Array(24).fill(null).map((_, idx) => {
          const hour = `0${idx}`.slice(-2);
          return (
            <div key={hour} className={classes.cellHeight}>
              <Typography
                className={classes.timeText}
                variant="body2"
              >
                {`${hour}:00`}
              </Typography>
            </div>
          );
        })}
        <div>
          <Typography
            className={classes.timeText}
            variant="body2"
          >
            24:00
          </Typography>
        </div>
      </div>
      <div className={classes.rightGutter} />
    </div>
  );
};

export default TimeIndicator;
