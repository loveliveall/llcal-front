import React from 'react';
import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';
import isSameMonth from 'date-fns/isSameMonth';
import subHours from 'date-fns/subHours';

import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { headerMarginUnit } from './styles';

const CellFrame = styled('div')`
  display: flex;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
`;
const Cell = styled('div')(({ theme }) => ({
  flex: '1 1 0%',
  boxSizing: 'border-box',
  borderRight: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
}));
const DiffMonthCell = styled(Cell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
}));
const CellWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

interface OwnProps {
  dayStartHour: number,
  currDate: Date,
  rangeStart: Date,
  onMonthDateClick: (date: Date) => void,
}
type WeekCellFrameProps = OwnProps;

const WeekCellFrame: React.FC<WeekCellFrameProps> = ({
  dayStartHour, currDate, rangeStart, onMonthDateClick,
}) => {
  const theme = useTheme();
  const now = new Date();
  const circleDiameter = `calc(${theme.spacing(headerMarginUnit / 2)} + ${theme.typography.body2.lineHeight}em)`;

  return (
    <CellFrame>
      {new Array(7).fill(null).map((_, idx) => {
        const cellDate = addDays(rangeStart, idx);
        const isToday = isSameDay(cellDate, subHours(now, dayStartHour));
        const isTargetMonth = isSameMonth(cellDate, currDate);
        const onClick = () => onMonthDateClick(cellDate);
        const CellComp = isTargetMonth ? Cell : DiffMonthCell;
        return (
          <CellComp key={cellDate.toISOString()}>
            <CellWrapper>
              <Typography
                sx={{
                  ...(isToday ? {
                    borderRadius: '50%',
                    width: circleDiameter,
                    height: circleDiameter,
                    color: theme.palette.getContrastText(theme.palette.primary.main),
                    backgroundColor: theme.palette.primary.main,
                    lineHeight: circleDiameter,
                    margin: `${theme.spacing(headerMarginUnit / 2)} 0px ${theme.spacing(headerMarginUnit / 2)} 0px`,
                    fontWeight: 'bold',
                  } : {
                    margin: `${theme.spacing(headerMarginUnit)} 0px ${theme.spacing(headerMarginUnit)} 0px`,
                    fontWeight: 'bold',
                  }),
                  ...(!isTargetMonth && {
                    color: theme.palette.grey[600],
                    fontWeight: 'inherit',
                  }),
                  cursor: 'pointer',
                }}
                component="span"
                variant="body2"
                onClick={onClick}
              >
                {cellDate.getDate()}
              </Typography>
            </CellWrapper>
          </CellComp>
        );
      })}
    </CellFrame>
  );
};

export default WeekCellFrame;
