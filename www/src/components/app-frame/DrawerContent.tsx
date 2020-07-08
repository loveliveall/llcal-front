import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import SearchIcon from '@material-ui/icons/Search';
import SendIcon from '@material-ui/icons/Send';
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

import VACheckList from '@/components/common/VACheckList';
import { ViewType } from '@/components/calendar';

import { VACheckState } from '../types';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  denseIcon: {
    minWidth: theme.spacing(5),
  },
  sectionHeader: {
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}));

interface IOwnProps {
  currView: ViewType,
  setCurrView: React.Dispatch<React.SetStateAction<ViewType>>,
  vaFilter: VACheckState,
  setVAFilter: (newFilter: VACheckState) => void,
  setMobileDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
}
type DrawerContentProps = IOwnProps;

const DrawerContent: React.FC<DrawerContentProps> = ({
  currView, setCurrView, vaFilter, setVAFilter, setMobileDrawerOpen,
}) => {
  const classes = useStyles();
  const VIEW_TYPE_MENU: Record<ViewType, {
    label: string,
    icon: typeof ViewDayIcon,
  }> = {
    agenda: {
      label: '일정 목록 보기',
      icon: ViewAgendaIcon,
    },
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
        <ListItem
          button
          // TODO: Add onClick handler
        >
          <ListItemIcon className={classes.denseIcon}>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText
            primary="검색"
            primaryTypographyProps={{
              variant: 'body2',
            }}
          />
        </ListItem>
        <ListItem
          button
          // TODO: Add onClick handler
        >
          <ListItemIcon className={classes.denseIcon}>
            <SendIcon />
          </ListItemIcon>
          <ListItemText
            primary="일정 추가 요청 보내기"
            primaryTypographyProps={{
              variant: 'body2',
            }}
          />
        </ListItem>
      </List>
      <Divider />
      <Typography
        className={classes.sectionHeader}
        color="inherit"
        variant="h6"
      >
        성우/캐릭터 필터
      </Typography>
      <VACheckList
        checkState={vaFilter}
        setCheckState={setVAFilter}
      />
    </div>
  );
};

export default DrawerContent;
