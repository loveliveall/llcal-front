import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MuiPaper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AppState } from '@/store';
import { saveToken } from '@/store/auth/actions';
import { tryLogin } from '@/api';

const Root = styled('div')`
  display: flex;
  width: 100%;
  justify-content: center;
`;
const Paper = styled(MuiPaper)(({ theme }) => ({
  flexGrow: 1,
  margin: theme.spacing(3),
  padding: theme.spacing(2),
  maxWidth: theme.breakpoints.values.sm,
}));
const Row = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: theme.spacing(0.5),
  justifyContent: 'center',
}));

const ShipDuck: React.FC = () => {
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
    <Root>
      <Paper>
        <Row>
          <Typography variant="h6">정보 입력</Typography>
        </Row>
        {errMsg !== '' && (
          <Row>
            <Typography variant="body2" sx={{ color: 'red' }}>{errMsg}</Typography>
          </Row>
        )}
        <Row>
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
        </Row>
        <Row>
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
        </Row>
        <Row>
          <Button
            color="primary"
            variant="contained"
            disabled={loading}
            onClick={onLoginClick}
          >
            {loading ? <CircularProgress size="1.75em" /> : 'Login!'}
          </Button>
        </Row>
      </Paper>
    </Root>
  );
};

export default ShipDuck;
