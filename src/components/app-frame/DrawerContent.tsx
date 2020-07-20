import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import SendIcon from '@material-ui/icons/Send';
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

import ETCCheckList from '@/components/common/ETCCheckList';
import VACheckList from '@/components/common/VACheckList';
import CategoryCheckList from '@/components/common/CategoryCheckList';
import ReportDialog from '@/components/dialogs/ReportDialog';
import { ViewType } from '@/components/calendar';

import { AppState } from '@/store';
import { clearToken } from '@/store/auth/actions';
import { openEventEditDialog } from '@/store/edit-dialog/actions';
import { openSnackbar } from '@/store/snackbar/actions';
import { VA_KEY, CATEGORY_KEY, ETC_KEY } from '@/defaults';
import { saveLocalStorage } from '@/utils';
import { VACheckState, CategoryCheckState, ETCCheckState } from '@/types';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  denseIcon: {
    minWidth: theme.spacing(5),
  },
  sectionHeaderText: {
    fontWeight: 'bold',
  },
  spaced: {
    paddingLeft: theme.spacing(2),
  },
  center: {
    paddingBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

interface IOwnProps {
  currView: ViewType,
  setCurrView: (viewType: ViewType) => void,
  etcFilter: ETCCheckState,
  setETCFilter: (newFilter: ETCCheckState) => void,
  vaFilter: VACheckState,
  setVAFilter: (newFilter: VACheckState) => void,
  categoryFilter: CategoryCheckState,
  setCategoryFilter: (newFilter: CategoryCheckState) => void,
  setMobileDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
}
type DrawerContentProps = IOwnProps;

const DrawerContent: React.FC<DrawerContentProps> = ({
  currView, setCurrView, etcFilter, setETCFilter,
  vaFilter, setVAFilter, categoryFilter, setCategoryFilter, setMobileDrawerOpen,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const authorized = useSelector((state: AppState) => state.auth.token !== null);
  const [reportDialogOpen, setReportDialogOpen] = React.useState(false);
  const [openVAFilter, setOpenVAFilter] = React.useState(false);
  const [openCategoryFilter, setOpenCategoryFilter] = React.useState(false);
  const [openETCFilter, setOpenETCFilter] = React.useState(false);
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
  const onLogoutClick = () => {
    dispatch(clearToken());
    dispatch(openSnackbar('로그아웃 성공'));
  };
  const onNewEventClick = () => {
    dispatch(openEventEditDialog(null));
  };
  const onReportClick = () => {
    setReportDialogOpen(true);
  };
  const onSaveFilterClick = () => {
    saveLocalStorage(VA_KEY, vaFilter);
    saveLocalStorage(CATEGORY_KEY, categoryFilter);
    saveLocalStorage(ETC_KEY, etcFilter);
    dispatch(openSnackbar('저장 완료'));
  };

  return (
    <div className={classes.root}>
      <List component="nav">
        {authorized && (
          <>
            <ListItem
              button
              onClick={onLogoutClick}
            >
              <ListItemIcon className={classes.denseIcon}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText
                primary="로그아웃"
                primaryTypographyProps={{
                  variant: 'body2',
                }}
              />
            </ListItem>
            <ListItem
              button
              onClick={onNewEventClick}
            >
              <ListItemIcon className={classes.denseIcon}>
                <AddIcon />
              </ListItemIcon>
              <ListItemText
                primary="새 일정 추가"
                primaryTypographyProps={{
                  variant: 'body2',
                }}
              />
            </ListItem>
          </>
        )}
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
        <ListItem button component={Link} to="/search">
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
          onClick={onReportClick}
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
        <Divider />
        <ListItem
          button
          onClick={() => setOpenVAFilter(!openVAFilter)}
        >
          <ListItemIcon className={classes.denseIcon}>
            {openVAFilter ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
          <ListItemText
            primary="성우/캐릭터 필터"
            primaryTypographyProps={{
              className: classes.sectionHeaderText,
              variant: 'body2',
            }}
          />
        </ListItem>
        <Collapse in={openVAFilter} timeout="auto" unmountOnExit>
          <VACheckList
            checkState={vaFilter}
            setCheckState={setVAFilter}
          />
        </Collapse>
        <Divider />
        <ListItem
          button
          onClick={() => setOpenCategoryFilter(!openCategoryFilter)}
        >
          <ListItemIcon className={classes.denseIcon}>
            {openCategoryFilter ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
          <ListItemText
            primary="분류 필터"
            primaryTypographyProps={{
              className: classes.sectionHeaderText,
              variant: 'body2',
            }}
          />
        </ListItem>
        <Collapse in={openCategoryFilter} timeout="auto" unmountOnExit>
          <CategoryCheckList
            checkState={categoryFilter}
            setCheckState={setCategoryFilter}
          />
        </Collapse>
        <Divider />
        <ListItem
          button
          onClick={() => setOpenETCFilter(!openETCFilter)}
        >
          <ListItemIcon className={classes.denseIcon}>
            {openETCFilter ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
          <ListItemText
            primary="기타 필터"
            primaryTypographyProps={{
              className: classes.sectionHeaderText,
              variant: 'body2',
            }}
          />
        </ListItem>
        <Collapse in={openETCFilter} timeout="auto" unmountOnExit>
          <ETCCheckList
            checkState={etcFilter}
            setCheckState={setETCFilter}
          />
        </Collapse>
        <div className={classes.center}>
          <Button onClick={onSaveFilterClick} variant="outlined">
            필터 설정 저장
          </Button>
        </div>
      </List>
      <ReportDialog
        open={reportDialogOpen}
        setOpen={setReportDialogOpen}
      />
    </div>
  );
};

export default DrawerContent;
