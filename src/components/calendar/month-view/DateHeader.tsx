import React from 'react';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { WEEKDAY_SHORT_NAMES } from '../utils/utils';

const Row = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  boxSizing: 'border-box',
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));
const HeaderCell = styled('div')(({ theme }) => ({
  flex: '1 1 0%',
  boxSizing: 'border-box',
  borderRight: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
}));
const HeaderTextTypo = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  margin: `${theme.spacing(0.25)} 0px ${theme.spacing(0.25)} 0px`,
})) as typeof Typography;

const DateHeader: React.FC = () => {
  return (
    <Row>
      {WEEKDAY_SHORT_NAMES.map((weekdayName) => (
        <HeaderCell key={weekdayName}>
          <HeaderTextTypo
            component="div"
            variant="body2"
          >
            {weekdayName}
          </HeaderTextTypo>
        </HeaderCell>
      ))}
    </Row>
  );
};

export default React.memo(DateHeader);
