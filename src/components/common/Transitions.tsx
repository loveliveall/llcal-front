import React from 'react';

import { TransitionProps } from '@mui/material/transitions';
import Fade from '@mui/material/Fade';

export const FadeTransition = React.forwardRef((
  props: TransitionProps & { children: React.ReactElement<any, any>, },
  ref: React.Ref<unknown>,
) => <Fade ref={ref} {...props} />); // eslint-disable-line react/jsx-props-no-spreading
