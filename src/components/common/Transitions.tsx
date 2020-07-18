import React from 'react';

import { TransitionProps } from '@material-ui/core/transitions';
import Slide from '@material-ui/core/Slide';

export const SlideUpTransition = React.forwardRef((
  props: TransitionProps & { children?: React.ReactElement<any, any>, },
  ref: React.Ref<unknown>,
) => <Slide direction="up" ref={ref} {...props} />); // eslint-disable-line react/jsx-props-no-spreading
