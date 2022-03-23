import React from 'react';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { getCellHeightCalc } from './styles';

const Root = styled('div')`
  display: flex;
  width: 100%;
`;
const LeftGutter = styled('div')`
  flex: 1 1 0%;
`;
const RightGutter = styled('div')(({ theme }) => ({
  width: theme.spacing(1),
}));
const Cell = styled('div')(({ theme }) => ({
  height: `calc(${getCellHeightCalc(theme)})`,
}));
const TimeTextTypo = styled(Typography)(({ theme }) => ({
  position: 'relative',
  top: `calc((-1) * ${theme.typography.body2.lineHeight}em / 2 + 1px)`,
  color: theme.palette.text.disabled,
}));

interface OwnProps {
  dayStartHour: number,
}
type TimeIndicatorProps = OwnProps;

const TimeIndicator: React.FC<TimeIndicatorProps> = ({ dayStartHour }) => {
  return (
    <Root>
      <LeftGutter />
      <div>
        {new Array(24).fill(null).map((_, idx) => {
          const hour = `0${idx + dayStartHour}`.slice(-2);
          return (
            <Cell key={hour}>
              <TimeTextTypo
                variant="body2"
              >
                {`${hour}:00`}
              </TimeTextTypo>
            </Cell>
          );
        })}
        <div>
          <TimeTextTypo
            variant="body2"
          >
            {`${24 + dayStartHour}:00`}
          </TimeTextTypo>
        </div>
      </div>
      <RightGutter />
    </Root>
  );
};

export default TimeIndicator;
