import React from 'react';

import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { ETCCheckState } from '@/types';

const ItemTextSpaced = styled(ListItemText)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
}));

interface IOwnProps {
  checkState: ETCCheckState,
  setCheckState: (newCheckState: ETCCheckState) => void,
}
type ETCCheckListProps = IOwnProps;

const ETCCheckList: React.FC<ETCCheckListProps> = ({
  checkState, setCheckState,
}) => {
  const onToggleIncludeRepeating = () => {
    setCheckState({
      ...checkState,
      includeRepeating: !checkState.includeRepeating,
    });
  };
  const onToggleShowLoveLive = () => {
    setCheckState({
      ...checkState,
      showLoveLive: !checkState.showLoveLive,
    });
  };
  const onToggleShowNonLoveLive = () => {
    setCheckState({
      ...checkState,
      showNonLoveLive: !checkState.showNonLoveLive,
    });
  };
  return (
    <List component="nav" dense>
      <ListItemButton
        onClick={onToggleIncludeRepeating}
      >
        <Checkbox
          color="primary"
          onChange={onToggleIncludeRepeating}
          checked={checkState.includeRepeating}
          edge="start"
          disableRipple
        />
        <ItemTextSpaced
          primary="정기 일정 포함"
          primaryTypographyProps={{
            variant: 'body2',
          }}
        />
      </ListItemButton>
      <ListItemButton
        onClick={onToggleShowLoveLive}
      >
        <Checkbox
          color="primary"
          onChange={onToggleShowLoveLive}
          checked={checkState.showLoveLive}
          edge="start"
          disableRipple
        />
        <ItemTextSpaced
          primary="LoveLive! 관련"
          primaryTypographyProps={{
            variant: 'body2',
          }}
        />
      </ListItemButton>
      <ListItemButton
        onClick={onToggleShowNonLoveLive}
      >
        <Checkbox
          color="primary"
          onChange={onToggleShowNonLoveLive}
          checked={checkState.showNonLoveLive}
          edge="start"
          disableRipple
        />
        <ItemTextSpaced
          primary="LoveLive! 비관련"
          primaryTypographyProps={{
            variant: 'body2',
          }}
        />
      </ListItemButton>
    </List>
  );
};

export default ETCCheckList;
