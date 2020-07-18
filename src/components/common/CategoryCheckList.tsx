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

const useStyles = makeStyles((theme: Theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  spaced: {
    paddingLeft: theme.spacing(2),
  },
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
  const classes = useStyles();

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
      <ListItem
        button
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
        <ListItemText
          className={classes.spaced}
          primary="전체 선택"
          primaryTypographyProps={{
            variant: 'body2',
          }}
        />
      </ListItem>
      {categoryGroupList.map((groupInfo) => {
        const groupId = groupInfo.id;
        return (
          <React.Fragment key={`category-group-${groupId}`}>
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
                color="default"
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
                {eventCategoryList.filter((cat) => cat.groupId === groupId).map((cat) => {
                  const categoryId = cat.id;
                  return (
                    <ListItem
                      key={`category-${categoryId}`}
                      className={classes.nested}
                      button
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
                      <ListItemText
                        className={classes.spaced}
                        primary={cat.name}
                        primaryTypographyProps={{
                          variant: 'body2',
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
      <List component="nav" dense disablePadding>
        {eventCategoryList.filter((cat) => cat.groupId === null).map((cat) => {
          const categoryId = cat.id;
          return (
            <ListItem
              key={`category-${categoryId}`}
              button
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
              <ListItemText
                className={classes.spaced}
                primary={cat.name}
                primaryTypographyProps={{
                  variant: 'body2',
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </List>
  );
};

export default CategoryCheckList;
