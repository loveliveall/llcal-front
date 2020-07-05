import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ViewDayIcon from '@material-ui/icons/ViewDay';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

import { ViewType } from '@/components/calendar';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  denseIcon: {
    minWidth: theme.spacing(5),
  },
}));

interface IOwnProps {
  currView: ViewType,
  setCurrView: React.Dispatch<React.SetStateAction<ViewType>>,
  setMobileDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
}
type DrawerContentProps = IOwnProps;

const DrawerContent: React.FC<DrawerContentProps> = ({
  currView, setCurrView, setMobileDrawerOpen,
}) => {
  const classes = useStyles();
  const VIEW_TYPE_MENU: Record<ViewType, {
    label: string,
    icon: typeof ViewDayIcon,
  }> = {
    day: {
      label: '일간 일정 보기',
      icon: ViewDayIcon,
    },
    month: {
      label: '월간 일정 보기',
      icon: ViewModuleIcon,
    },
  };

  return (
    <div className={classes.root}>
      <List component="nav">
        {Object.keys(VIEW_TYPE_MENU).map((v) => {
          const viewType = v as ViewType;
          const { icon: Icon, label } = VIEW_TYPE_MENU[viewType];
          const onClick = () => {
            setCurrView(viewType);
            setMobileDrawerOpen(false); // Close mobile drawer on view selection
          };
          return (
            <ListItem
              key={viewType}
              button
              selected={currView === viewType}
              onClick={onClick}
            >
              <ListItemIcon className={classes.denseIcon}>
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  variant: 'body2',
                }}
              />
            </ListItem>
          );
        })}
      </List>
      <Divider />
    </div>
  );
};

export default DrawerContent;
