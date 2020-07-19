import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { ETCCheckState } from '@/types';

const useStyles = makeStyles((theme: Theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  spaced: {
    paddingLeft: theme.spacing(2),
  },
}));

interface IOwnProps {
  checkState: ETCCheckState,
  setCheckState: (newCheckState: ETCCheckState) => void,
}
type ETCCheckListProps = IOwnProps;

const ETCCheckList: React.FC<ETCCheckListProps> = ({
  checkState, setCheckState,
}) => {
  const classes = useStyles();
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
      <ListItem
        button
        onClick={onToggleIncludeRepeating}
      >
        <Checkbox
          color="primary"
          onChange={onToggleIncludeRepeating}
          checked={checkState.includeRepeating}
          edge="start"
          disableRipple
        />
        <ListItemText
          className={classes.spaced}
          primary="정기 일정 포함"
          primaryTypographyProps={{
            variant: 'body2',
          }}
        />
      </ListItem>
      <ListItem
        button
        onClick={onToggleShowLoveLive}
      >
        <Checkbox
          color="primary"
          onChange={onToggleShowLoveLive}
          checked={checkState.showLoveLive}
          edge="start"
          disableRipple
        />
        <ListItemText
          className={classes.spaced}
          primary="LoveLive! 관련"
          primaryTypographyProps={{
            variant: 'body2',
          }}
        />
      </ListItem>
      <ListItem
        button
        onClick={onToggleShowNonLoveLive}
      >
        <Checkbox
          color="primary"
          onChange={onToggleShowNonLoveLive}
          checked={checkState.showNonLoveLive}
          edge="start"
          disableRipple
        />
        <ListItemText
          className={classes.spaced}
          primary="LoveLive! 비관련"
          primaryTypographyProps={{
            variant: 'body2',
          }}
        />
      </ListItem>
    </List>
  );
};

export default ETCCheckList;
