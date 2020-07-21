import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import format from 'date-fns/format';
import koLocale from 'date-fns/locale/ko';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import CssBaseline from '@material-ui/core/CssBaseline';

import DateFnsUtils from '@date-io/date-fns';

import App from '@/App';
import store from '@/store';

ReactGA.initialize('UA-142042916-3');

class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date: Date) {
    return format(date, 'M.dd', { locale: this.locale });
  }

  getDateTimePickerHeaderText(date: Date) {
    return format(date, 'M.dd', { locale: this.locale });
  }

  getHourText(date: Date) {
    return format(date, 'HH', { locale: this.locale });
  }
}

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
  <Provider store={store}>
    <CssBaseline />
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={LocalizedUtils} locale={koLocale}>
          <App />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app'),
);
