import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import App from '@/App';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ffa400',
    },
    secondary: {
      main: '#ff7f32',
    },
  },
});

ReactDOM.render(
  <>
    <CssBaseline />
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </>,
  document.getElementById('app'),
);
