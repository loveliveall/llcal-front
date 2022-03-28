import React from 'react';

import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { VACheckState } from '@/types';
import {
  isGroupChecked,
  isGroupIndeterminate,
  isAllChecked,
  isAllIndeterminate,
} from '@/utils';

import { voiceActorList, groupInfoList } from '@/commonData';

const NestedItem = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
}));
const ItemTextSpaced = styled(ListItemText)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
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
  const onAllToggle = () => {
    const allChecked = isAllChecked(checkState);
    setCheckState(voiceActorList.reduce((acc, curr) => ({
      ...acc,
      [curr.id]: !allChecked,
    }), {}));
  };
  const onSubListToggle = (groupId: number) => {
    setSubListOpen({
      ...subListOpen,
      [groupId]: !subListOpen[groupId],
    });
  };

  return (
    <List component="nav" dense>
      <ListItemButton
        onClick={onAllToggle}
      >
        <Checkbox
          color="primary"
          onChange={onAllToggle}
          checked={isAllChecked(checkState)}
          indeterminate={isAllIndeterminate(checkState)}
          edge="start"
          disableRipple
        />
        <ItemTextSpaced
          primary="전체 선택"
          primaryTypographyProps={{
            variant: 'body2',
          }}
        />
      </ListItemButton>
      {groupInfoList.map((groupInfo) => {
        const groupId = groupInfo.id;
        return (
          <React.Fragment key={`group-${groupId}`}>
            <ListItem
              secondaryAction={
                <IconButton onClick={() => onSubListToggle(groupId)}>
                  {subListOpen[groupId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton
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
                <ItemTextSpaced
                  primary={groupInfo.name}
                  primaryTypographyProps={{
                    variant: 'body2',
                  }}
                />
              </ListItemButton>
            </ListItem>
            {/* SubList */}
            <Collapse in={subListOpen[groupId]} timeout="auto" unmountOnExit>
              <List component="nav" dense disablePadding>
                {voiceActorList.filter((va) => va.groupId === groupId).map((va) => {
                  const vaId = va.id;
                  return (
                    <NestedItem
                      key={`va-${vaId}`}
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
                      <ItemTextSpaced
                        primary={va.name}
                        primaryTypographyProps={{
                          variant: 'body2',
                        }}
                        secondary={va.character}
                        secondaryTypographyProps={{
                          variant: 'caption',
                        }}
                      />
                    </NestedItem>
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
