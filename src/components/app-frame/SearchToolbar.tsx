import React from 'react';
import { useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SearchIcon from '@mui/icons-material/Search';

const PaddedDiv = styled('div')`
  flex-grow: 1;
`;
const MaxSMForm = styled('form')(({ theme }) => ({
  width: '100%',
  maxWidth: theme.breakpoints.values.sm,
}));

interface IOwnProps {
  onSearchTrigger: (searchText: string) => void,
}
export type SearchToolbarProps = IOwnProps;

const SearchToolbar: React.FC<SearchToolbarProps> = ({
  onSearchTrigger,
}) => {
  const navigate = useNavigate();
  const [text, setText] = React.useState('');
  const onBackClick = () => {
    navigate(-1);
  };
  const onTextChange = (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setText(ev.target.value);
  };
  const onSearchClick = () => {
    onSearchTrigger(text);
  };
  const onFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    onSearchTrigger(text);
  };

  return (
    <Toolbar>
      <Tooltip title="뒤로 가기" disableInteractive>
        <IconButton
          color="inherit"
          aria-label="back to calendar"
          edge="start"
          onClick={onBackClick}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Tooltip>
      <PaddedDiv />
      <MaxSMForm action="." onSubmit={onFormSubmit}>
        <Input
          name="search"
          type="search"
          placeholder="검색어"
          value={text}
          onChange={onTextChange}
          inputProps={{
            'aria-label': 'search text',
            autoCapitalize: 'none',
            autoCorrect: 'off',
          }}
          autoFocus
          fullWidth
        />
      </MaxSMForm>
      <Tooltip title="검색" disableInteractive>
        <IconButton
          color="inherit"
          aria-label="trigger search"
          onClick={onSearchClick}
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>
      <PaddedDiv />
    </Toolbar>
  );
};

export default SearchToolbar;
