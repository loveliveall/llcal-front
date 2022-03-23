import React from 'react';

import Grid from '@mui/material/Grid';

const GridContainer: React.FC = ({ children }) => (
  <Grid container alignItems="center" spacing={2}>
    {children}
  </Grid>
);

export default GridContainer;
