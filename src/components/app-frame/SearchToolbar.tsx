import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) => ({
  padded: {
    flexGrow: 1,
  },
  maxSm: {
    maxWidth: theme.breakpoints.values.sm,
  },
}));

interface IOwnProps {
  onSearchTrigger: (searchText: string) => void,
}
export type SearchToolbarProps = IOwnProps;

const SearchToolbar: React.FC<SearchToolbarProps & RouteComponentProps> = ({
  onSearchTrigger, history,
}) => {
  const classes = useStyles();
  const [text, setText] = React.useState('');
  const onBackClick = () => {
    history.goBack();
  };
  const onTextChange = (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setText(ev.target.value);
  };
  const onSearchClick = () => {
    onSearchTrigger(text);
  };
  const onTextKeyUp = (ev: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      onSearchTrigger(text);
    }
  };

  return (
    <Toolbar>
      <Tooltip title="뒤로 가기">
        <IconButton
          color="inherit"
          aria-label="back to calendar"
          edge="start"
          onClick={onBackClick}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Tooltip>
      <div className={classes.padded} />
      <Input
        className={classes.maxSm}
        name="search"
        type="search"
        placeholder="검색어"
        value={text}
        onChange={onTextChange}
        onKeyUp={onTextKeyUp}
        inputProps={{
          'aria-label': 'search text',
        }}
        autoFocus
        fullWidth
      />
      <Tooltip title="검색">
        <IconButton
          color="inherit"
          aria-label="trigger search"
          onClick={onSearchClick}
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>
      <div className={classes.padded} />
    </Toolbar>
  );
};

export default withRouter(SearchToolbar);
