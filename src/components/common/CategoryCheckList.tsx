import React from 'react';

import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { CategoryCheckState } from '@/types';
import { eventCategoryList, categoryGroupList } from '@/commonData';

function isGroupChecked(checkState: CategoryCheckState, groupId: number) {
  return eventCategoryList.filter((cat) => cat.groupId === groupId).some((cat) => checkState[cat.id]);
}

function isGroupIndeterminate(checkState: CategoryCheckState, groupId: number): boolean {
  const targetCat = eventCategoryList.filter((cat) => cat.groupId === groupId);
  return !targetCat.every((cat) => checkState[cat.id] === checkState[targetCat[0].id]);
}

function isAllChecked(checkState: CategoryCheckState) {
  return eventCategoryList.some((cat) => checkState[cat.id]);
}

function isAllIndeterminate(checkState: CategoryCheckState) {
  return !eventCategoryList.every((cat) => checkState[cat.id] === checkState[eventCategoryList[0].id]);
}

const NestedItem = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
}));
const ItemTextSpaced = styled(ListItemText)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
}));

interface IOwnProps {
  checkState: CategoryCheckState,
  setCheckState: (newCheckState: CategoryCheckState) => void,
}
type CategoryCheckListProps = IOwnProps;

type SubListOpenState = {
  [groupId: number]: boolean,
};

const CategoryCheckList: React.FC<CategoryCheckListProps> = ({
  checkState, setCheckState,
}) => {
  const [subListOpen, setSubListOpen] = React.useState<SubListOpenState>(categoryGroupList.reduce((acc, curr) => ({
    ...acc,
    [curr.id]: true,
  }), {}));

  const onCategoryToggle = (categoryId: number) => {
    setCheckState({
      ...checkState,
      [categoryId]: !checkState[categoryId],
    });
  };
  const onGroupToggle = (groupId: number) => {
    const groupChecked = isGroupChecked(checkState, groupId);
    setCheckState({
      ...checkState,
      ...eventCategoryList.filter((cat) => cat.groupId === groupId).reduce((acc, curr) => ({
        ...acc,
        [curr.id]: !groupChecked,
      }), {}),
    });
  };
  const onAllToggle = () => {
    const allChecked = isAllChecked(checkState);
    setCheckState(eventCategoryList.reduce((acc, curr) => ({
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
      <List component="nav" dense disablePadding>
        {eventCategoryList.filter((cat) => cat.groupId === null).map((cat) => {
          const categoryId = cat.id;
          return (
            <Tooltip
              key={`category-${categoryId}`}
              title={cat.description}
            >
              <ListItemButton
                onClick={() => onCategoryToggle(categoryId)}
              >
                <Checkbox
                  onChange={() => onCategoryToggle(categoryId)}
                  checked={checkState[categoryId]}
                  edge="start"
                  disableRipple
                  style={{
                    color: cat.colorHex,
                  }}
                />
                <ItemTextSpaced
                  primary={cat.name}
                  primaryTypographyProps={{
                    variant: 'body2',
                  }}
                />
              </ListItemButton>
            </Tooltip>
          );
        })}
        {categoryGroupList.map((groupInfo) => {
          const groupId = groupInfo.id;
          return (
            <React.Fragment key={`category-group-${groupId}`}>
              <ListItemButton
                onClick={() => onGroupToggle(groupId)}
              >
                <Checkbox
                  onChange={() => onGroupToggle(groupId)}
                  checked={isGroupChecked(checkState, groupId)}
                  indeterminate={isGroupIndeterminate(checkState, groupId)}
                  edge="start"
                  disableRipple
                  color="default"
                />
                <ItemTextSpaced
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
              </ListItemButton>
              {/* SubList */}
              <Collapse in={subListOpen[groupId]} timeout="auto" unmountOnExit>
                <List component="nav" dense disablePadding>
                  {eventCategoryList.filter((cat) => cat.groupId === groupId).map((cat) => {
                    const categoryId = cat.id;
                    return (
                      <Tooltip
                        key={`category-${categoryId}`}
                        title={cat.description}
                      >
                        <NestedItem
                          key={`category-${categoryId}`}
                          onClick={() => onCategoryToggle(categoryId)}
                        >
                          <Checkbox
                            onChange={() => onCategoryToggle(categoryId)}
                            checked={checkState[categoryId]}
                            edge="start"
                            disableRipple
                            style={{
                              color: cat.colorHex,
                            }}
                          />
                          <ItemTextSpaced
                            primary={cat.name}
                            primaryTypographyProps={{
                              variant: 'body2',
                            }}
                          />
                        </NestedItem>
                      </Tooltip>
                    );
                  })}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>
    </List>
  );
};

export default CategoryCheckList;
