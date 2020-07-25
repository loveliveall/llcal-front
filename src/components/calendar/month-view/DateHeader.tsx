import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { WEEKDAY_SHORT_NAMES } from '../utils/utils';

const useStyles = makeStyles((theme: Theme) => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    boxSizing: 'border-box',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  headerCell: {
    flex: '1 1 0%',
    boxSizing: 'border-box',
    borderRight: `1px solid ${theme.palette.divider}`,
    textAlign: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    margin: `${theme.spacing(0.25)}px 0px ${theme.spacing(0.25)}px 0px`,
  },
}));

const DateHeader: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.row}>
      {WEEKDAY_SHORT_NAMES.map((weekdayName) => (
        <div key={weekdayName} className={classes.headerCell}>
          <Typography
            className={classes.headerText}
            component="div"
            variant="body2"
          >
            {weekdayName}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default React.memo(DateHeader);
