import { makeStyles, createStyles } from '@material-ui/core/styles';

export const useCommonStyles = makeStyles((theme) => createStyles({
  eventInstance: {
    display: 'flex',
    alignItems: 'center',
    margin: `${1}px`,
    marginRight: `${2}px`,
    borderRadius: theme.spacing(0.5),
    padding: `${1}px`,
    paddingLeft: theme.spacing(0.75),
    paddingRight: theme.spacing(0.75),
    cursor: 'pointer',
    '&:hover': {
      boxShadow: 'inset 0px 0px 0px 1000px rgba(0, 0, 0, 0.1)',
    },
  },
  eventText: {
    display: 'inline-block',
    marginLeft: `${1}px`,
    fontSize: theme.typography.fontSize,
  },
}));
