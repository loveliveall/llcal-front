import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { AppState } from '@/store';
import { saveToken } from '@/store/auth/actions';
import { tryLogin } from '@/api';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  paper: {
    flexGrow: 1,
    margin: theme.spacing(3),
    padding: theme.spacing(2),
    maxWidth: theme.breakpoints.values.sm,
  },
  singleRow: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(0.5),
    justifyContent: 'center',
  },
  error: {
    color: 'red',
  },
}));

const ShipDuck: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const [idText, setIdText] = React.useState('');
  const [tokenText, setTokenText] = React.useState('');
  const authorized = useSelector((state: AppState) => state.auth.token !== null);
  if (authorized) return <Redirect to="/" />;

  const onIDChange = (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setIdText(ev.target.value);
  };
  const onTokenChange = (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setTokenText(ev.target.value);
  };
  const onLoginClick = () => {
    if (idText === '' || tokenText === '') {
      setErrMsg('ID와 Token을 입력해야 합니다');
      return;
    }
    setLoading(true);
    tryLogin(idText, tokenText).then((ok) => {
      setLoading(false);
      if (ok) {
        dispatch(saveToken(tokenText));
      } else {
        setErrMsg('입력 정보가 잘못 되었습니다');
      }
    }).catch(() => {
      setLoading(false);
      setErrMsg('로그인 서버에 문제가 발생하였습니다');
    });
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.singleRow}>
          <Typography variant="h6">정보 입력</Typography>
        </div>
        {errMsg !== '' && (
          <div className={classes.singleRow}>
            <Typography variant="body2" className={classes.error}>{errMsg}</Typography>
          </div>
        )}
        <div className={classes.singleRow}>
          <TextField
            id="id"
            label="ID"
            variant="outlined"
            disabled={loading}
            value={idText}
            onChange={onIDChange}
            fullWidth
            inputProps={{
              autoCapitalize: 'none',
              autoCorrect: 'off',
            }}
          />
        </div>
        <div className={classes.singleRow}>
          <TextField
            id="token"
            label="Token"
            variant="outlined"
            disabled={loading}
            value={tokenText}
            onChange={onTokenChange}
            fullWidth
            inputProps={{
              autoCapitalize: 'none',
              autoCorrect: 'off',
            }}
          />
        </div>
        <div className={classes.singleRow}>
          <Button
            color="primary"
            variant="contained"
            disabled={loading}
            onClick={onLoginClick}
          >
            {loading ? <CircularProgress size="1.75em" /> : 'Login!'}
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default ShipDuck;
