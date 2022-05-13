import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga4';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import koLocale from 'date-fns/locale/ko';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CssBaseline from '@mui/material/CssBaseline';

import App from '@/App';
import store from '@/store';

ReactGA.initialize('G-V833VTTB6G');

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffa400',
    },
    secondary: {
      main: '#ff7f32',
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <CssBaseline />
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={koLocale}>
          <App />
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app'),
);
