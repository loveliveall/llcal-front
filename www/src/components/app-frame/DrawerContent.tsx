import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { ViewType } from '@/components/calendar';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
}));

interface IOwnProps {
  currView: ViewType,
  setCurrView: React.Dispatch<React.SetStateAction<ViewType>>,
}
type DrawerContentProps = IOwnProps;

const DrawerContent: React.FC<DrawerContentProps> = ({
  currView, setCurrView,
}) => {
  const classes = useStyles();
  const VIEW_TYPE_MENU_LABEL: Record<ViewType, string> = {
    day: '일',
    month: '월간 일정 보기',
  };

  return (
    <div className={classes.root}>
      <List component="nav">
        {Object.keys(VIEW_TYPE_MENU_LABEL).map((v) => {
          const viewType = v as ViewType;
          return (
            <ListItem
              key={viewType}
              button
              selected={currView === viewType}
              onClick={() => setCurrView(viewType)}
            >
              <ListItemText primary={VIEW_TYPE_MENU_LABEL[viewType]} />
            </ListItem>
          );
        })}
      </List>
      <Divider />
    </div>
  );
};

export default DrawerContent;
