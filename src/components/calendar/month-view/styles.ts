import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const headerMarginUnit = 0.5;

export const EventInstanceDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(0.125),
  marginRight: theme.spacing(0.25),
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(0.125),
  paddingLeft: theme.spacing(0.75),
  paddingRight: theme.spacing(0.75),
  cursor: 'pointer',
  '&:hover': {
    boxShadow: 'inset 0px 0px 0px 1000px rgba(0, 0, 0, 0.1)',
  },
}));
export const EventTextTypo = styled(Typography)(({ theme }) => ({
  display: 'inline-block',
  marginLeft: theme.spacing(0.125),
  fontSize: theme.typography.fontSize,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}));
