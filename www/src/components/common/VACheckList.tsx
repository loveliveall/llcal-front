import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { VACheckState } from '@/components/types';
import { isGroupChecked, isGroupIndeterminate } from '@/components/utils';

import { voiceActorList, groupInfoList } from '@/commonData';

const useStyles = makeStyles((theme: Theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  spaced: {
    paddingLeft: theme.spacing(2),
  },
}));

interface IOwnProps {
  checkState: VACheckState,
  setCheckState: (newCheckState: VACheckState) => void,
}
type VACheckListProps = IOwnProps;

type SubListOpenState = {
  [groupId: number]: boolean,
};

const VACheckList: React.FC<VACheckListProps> = ({
  checkState, setCheckState,
}) => {
  const classes = useStyles();

  const [subListOpen, setSubListOpen] = React.useState<SubListOpenState>(groupInfoList.reduce((acc, curr) => ({
    ...acc,
    [curr.id]: false,
  }), {}));

  const onVAToggle = (vaId: number) => {
    setCheckState({
      ...checkState,
      [vaId]: !checkState[vaId],
    });
  };
  const onGroupToggle = (groupId: number) => {
    const groupChecked = isGroupChecked(checkState, groupId);
    setCheckState({
      ...checkState,
      ...voiceActorList.filter((va) => va.groupId === groupId).reduce((acc, curr) => ({
        ...acc,
        [curr.id]: !groupChecked,
      }), {}),
    });
  };
  const onSubListToggle = (groupId: number) => {
    setSubListOpen({
      ...subListOpen,
      [groupId]: !subListOpen[groupId],
    });
  };

  return (
    <List component="nav" dense>
      {groupInfoList.map((groupInfo) => {
        const groupId = groupInfo.id;
        return (
          <React.Fragment key={`group-${groupId}`}>
            <ListItem
              button
              onClick={() => onGroupToggle(groupId)}
            >
              <Checkbox
                onChange={() => onGroupToggle(groupId)}
                checked={isGroupChecked(checkState, groupId)}
                indeterminate={isGroupIndeterminate(checkState, groupId)}
                edge="start"
                disableRipple
                style={{
                  color: groupInfo.colorHex,
                }}
              />
              <ListItemText
                className={classes.spaced}
                primary={groupInfo.name}
                primaryTypographyProps={{
                  variant: 'body2',
                }}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => onSubListToggle(groupId)}>
                  {subListOpen[groupId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {/* SubList */}
            <Collapse in={subListOpen[groupId]} timeout="auto" unmountOnExit>
              <List component="nav" dense disablePadding>
                {voiceActorList.filter((va) => va.groupId === groupId).map((va) => {
                  const vaId = va.id;
                  return (
                    <ListItem
                      key={`va-${vaId}`}
                      className={classes.nested}
                      button
                      onClick={() => onVAToggle(vaId)}
                    >
                      <Checkbox
                        onChange={() => onVAToggle(vaId)}
                        checked={checkState[vaId]}
                        edge="start"
                        disableRipple
                        style={{
                          color: va.colorHex,
                        }}
                      />
                      <ListItemText
                        className={classes.spaced}
                        primary={va.name}
                        primaryTypographyProps={{
                          variant: 'body2',
                        }}
                        secondary={va.character}
                        secondaryTypographyProps={{
                          variant: 'caption',
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default VACheckList;
