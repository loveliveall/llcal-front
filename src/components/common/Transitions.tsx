import React from 'react';

import { TransitionProps } from '@material-ui/core/transitions';
import Fade from '@material-ui/core/Fade';

export const FadeTransition = React.forwardRef((
  props: TransitionProps & { children?: React.ReactElement<any, any>, },
  ref: React.Ref<unknown>,
) => <Fade ref={ref} {...props} />); // eslint-disable-line react/jsx-props-no-spreading
