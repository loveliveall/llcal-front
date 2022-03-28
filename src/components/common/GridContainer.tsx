import React from 'react';

import Grid, { GridProps } from '@mui/material/Grid';

const GridContainer: React.FC<GridProps> = ({ children, ...props }) => (
  <Grid container {...props} alignItems="center" spacing={2}>
    {children}
  </Grid>
);

export default GridContainer;
