import React from 'react';

import Grid from '@material-ui/core/Grid';

const GridContainer: React.FC = ({ children }) => (
  <Grid container alignItems="center" spacing={2}>
    {children}
  </Grid>
);

export default GridContainer;
