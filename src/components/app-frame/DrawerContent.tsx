import React from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import areEqual from 'fast-deep-equal';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AddIcon from '@material-ui/icons/Add';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HelpIcon from '@material-ui/icons/HelpOutline';
import InfoIcon from '@material-ui/icons/Info';
import LocalATMIcon from '@material-ui/icons/LocalAtm';
import SearchIcon from '@material-ui/icons/Search';
import SendIcon from '@material-ui/icons/Send';
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

import ETCCheckList from '@/components/common/ETCCheckList';
import VACheckList from '@/components/common/VACheckList';
import CategoryCheckList from '@/components/common/CategoryCheckList';
import AboutDialog from '@/components/dialogs/AboutDialog';
import DayStartHourDialog from '@/components/dialogs/DayStartHourDialog';
import ReportDialog from '@/components/dialogs/ReportDialog';
import ExportDialog from '@/components/dialogs/ExportDialog';
import UpdatesAndNotices from '@/components/dialogs/UpdatesAndNotices';

import { AppState, DAY_START_HOUR_KEY } from '@/store';
import { clearToken } from '@/store/auth/actions';
import { openEventEditDialog } from '@/store/edit-dialog/actions';
import { openSnackbar } from '@/store/snackbar/actions';
import {
  VA_KEY,
  CATEGORY_KEY,
  ETC_KEY,
  VIEW_TYPE_KEY,
} from '@/defaults';
import { saveLocalStorage } from '@/utils';
import {
  VACheckState,
  CategoryCheckState,
  ETCCheckState,
  AppViewType,
} from '@/types';

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
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
}));

interface IOwnProps {
  currView: AppViewType,
  setCurrView: (viewType: AppViewType) => void,
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
  const dayStartHour = useSelector((state: AppState) => state.settings.dayStartHour);
  const [noticesOpen, setNoticesOpen] = React.useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = React.useState(false);
  const [reportDialogOpen, setReportDialogOpen] = React.useState(false);
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const [dayStartDialogOpen, setDayStartDialogOpen] = React.useState(false);
  const [openVAFilter, setOpenVAFilter] = React.useState(false);
  const [openCategoryFilter, setOpenCategoryFilter] = React.useState(false);
  const [openETCFilter, setOpenETCFilter] = React.useState(false);
  const VIEW_TYPE_MENU: Record<AppViewType, {
    label: string,
    icon: typeof ViewDayIcon,
  }> = {
    dashboard: {
      label: '대시보드',
      icon: DashboardIcon,
    },
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
    concert: {
      label: '이벤트 정보 모음',
      icon: LocalATMIcon,
    },
  };
  const onAboutClick = () => {
    ReactGA.event({
      category: 'DrawerContent',
      action: 'Open about dialog',
    });
    setAboutDialogOpen(true);
  };
  const onLogoutClick = () => {
    dispatch(clearToken());
    dispatch(openSnackbar('로그아웃 성공'));
  };
  const onNewEventClick = () => {
    setMobileDrawerOpen(false); // Close mobile drawer on view selection
    dispatch(openEventEditDialog(null));
  };
  const onNoticeClick = () => {
    ReactGA.event({
      category: 'DrawerContent',
      action: 'Open updates & notices',
    });
    setNoticesOpen(true);
  };
  const onReportClick = () => {
    ReactGA.event({
      category: 'DrawerContent',
      action: 'Open report dialog',
    });
    setReportDialogOpen(true);
  };
  const onSaveSettingsClick = () => {
    ReactGA.event({
      category: 'DrawerContent',
      action: 'Save settings',
    });
    saveLocalStorage(VA_KEY, vaFilter);
    saveLocalStorage(CATEGORY_KEY, categoryFilter);
    saveLocalStorage(ETC_KEY, etcFilter);
    localStorage.setItem(DAY_START_HOUR_KEY, `${dayStartHour}`);
    localStorage.setItem(VIEW_TYPE_KEY, currView);
    dispatch(openSnackbar('저장 완료'));
  };
  const onExportClick = () => {
    ReactGA.event({
      category: 'DrawerContent',
      action: 'Export calendar',
    });
    setExportDialogOpen(true);
  };

  return (
    <div className={classes.root}>
      <List component="nav">
        <ListItem
          button
          onClick={onAboutClick}
        >
          <ListItemIcon className={classes.denseIcon}>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText
            primary="캘린더에 대해"
            primaryTypographyProps={{
              variant: 'body2',
            }}
          />
        </ListItem>
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
        <ListItem
          button
          onClick={onNoticeClick}
        >
          <ListItemIcon className={classes.denseIcon}>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText
            primary="최근 변경 및 공지"
            primaryTypographyProps={{
              variant: 'body2',
            }}
          />
        </ListItem>
        {Object.keys(VIEW_TYPE_MENU).map((v) => {
          const viewType = v as AppViewType;
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
          onClick={() => setDayStartDialogOpen(true)}
        >
          <ListItemIcon className={classes.denseIcon}>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText
            primary={`하루 범위: ${`0${dayStartHour}`.slice(-2)}:00 - ${dayStartHour + 24}:00`}
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
          <Button onClick={onSaveSettingsClick} variant="outlined">
            캘린더 설정 저장
          </Button>
        </div>
        <div className={classes.center}>
          <Button onClick={onExportClick} variant="outlined" color="primary">
            캘린더 내보내기
          </Button>
        </div>
      </List>
      <AboutDialog
        open={aboutDialogOpen}
        setOpen={setAboutDialogOpen}
      />
      <ReportDialog
        open={reportDialogOpen}
        setOpen={setReportDialogOpen}
      />
      <ExportDialog
        open={exportDialogOpen}
        setOpen={setExportDialogOpen}
        vaFilter={vaFilter}
        catFilter={categoryFilter}
        etcFilter={etcFilter}
      />
      <DayStartHourDialog
        open={dayStartDialogOpen}
        setOpen={setDayStartDialogOpen}
      />
      <UpdatesAndNotices
        open={noticesOpen}
        setOpen={setNoticesOpen}
      />
    </div>
  );
};

export default React.memo(DrawerContent, (prevProps, nextProps) => (
  areEqual(prevProps.currView, nextProps.currView)
  && areEqual(prevProps.vaFilter, nextProps.vaFilter)
  && areEqual(prevProps.categoryFilter, nextProps.categoryFilter)
  && areEqual(prevProps.etcFilter, nextProps.etcFilter)
));
