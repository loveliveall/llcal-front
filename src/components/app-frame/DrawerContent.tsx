import React from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import areEqual from 'fast-deep-equal';

import { styled, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HelpIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import LocalATMIcon from '@mui/icons-material/LocalAtm';
import PaidIcon from '@mui/icons-material/Paid';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

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

const Root = styled('div')`
  width: 100%;
`;
const DenseListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: theme.spacing(5),
}));
const sectionHeaderTextStyle: SxProps = {
  fontWeight: 'bold',
};
const Center = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
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
    <Root>
      <List component="nav">
        <ListItemButton
          onClick={onAboutClick}
        >
          <DenseListItemIcon>
            <HelpIcon />
          </DenseListItemIcon>
          <ListItemText
            primary="캘린더에 대해"
            primaryTypographyProps={{
              variant: 'body2',
            }}
          />
        </ListItemButton>
        {authorized && (
          <>
            <ListItemButton
              onClick={onLogoutClick}
            >
              <DenseListItemIcon>
                <ExitToAppIcon />
              </DenseListItemIcon>
              <ListItemText
                primary="로그아웃"
                primaryTypographyProps={{
                  variant: 'body2',
                }}
              />
            </ListItemButton>
            <ListItemButton
              onClick={onNewEventClick}
            >
              <DenseListItemIcon>
                <AddIcon />
              </DenseListItemIcon>
              <ListItemText
                primary="새 일정 추가"
                primaryTypographyProps={{
                  variant: 'body2',
                }}
              />
            </ListItemButton>
          </>
        )}
        <ListItemButton
          onClick={onNoticeClick}
        >
          <DenseListItemIcon>
            <InfoIcon />
          </DenseListItemIcon>
          <ListItemText
            primary="최근 변경 및 공지"
            primaryTypographyProps={{
              variant: 'body2',
            }}
          />
        </ListItemButton>
        {Object.keys(VIEW_TYPE_MENU).map((v) => {
          const viewType = v as AppViewType;
          const { icon: Icon, label } = VIEW_TYPE_MENU[viewType];
          const onClick = () => {
            setCurrView(viewType);
            setMobileDrawerOpen(false); // Close mobile drawer on view selection
          };
          return (
            <ListItemButton
              key={viewType}
              selected={currView === viewType}
              onClick={onClick}
            >
              <DenseListItemIcon>
                <Icon />
              </DenseListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  variant: 'body2',
                }}
              />
            </ListItemButton>
          );
        })}
        <ListItemButton component={Link} to="/search">
          <DenseListItemIcon>
            <SearchIcon />
          </DenseListItemIcon>
          <ListItemText
            primary="검색"
            primaryTypographyProps={{
              variant: 'body2',
            }}
          />
        </ListItemButton>
        <ListItemButton
          onClick={onReportClick}
        >
          <DenseListItemIcon>
            <SendIcon />
          </DenseListItemIcon>
          <ListItemText
            primary="일정 추가 요청 보내기"
            primaryTypographyProps={{
              variant: 'body2',
            }}
          />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            const newWindow = window.open('https://toss.me/llcal', '_blank', 'noopener,noreferrer');
            if (newWindow) newWindow.opener = null;
          }}
        >
          <DenseListItemIcon>
            <PaidIcon />
          </DenseListItemIcon>
          <ListItemText
            primary="제작자 후원하기"
            primaryTypographyProps={{
              variant: 'body2',
            }}
          />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            const newWindow = window.open('https://llct.sochiru.pw/', '_blank', 'noopener,noreferrer');
            if (newWindow) newWindow.opener = null;
          }}
        >
          <DenseListItemIcon>
            <LinkIcon />
          </DenseListItemIcon>
          <ListItemText
            primary="러브라이브! 콜표"
            primaryTypographyProps={{
              variant: 'body2',
            }}
          />
        </ListItemButton>
        <Divider />
        <ListItemButton
          onClick={() => setDayStartDialogOpen(true)}
        >
          <DenseListItemIcon>
            <AccessTimeIcon />
          </DenseListItemIcon>
          <ListItemText
            primary={`하루 범위: ${`0${dayStartHour}`.slice(-2)}:00 - ${dayStartHour + 24}:00`}
            primaryTypographyProps={{
              variant: 'body2',
            }}
          />
        </ListItemButton>
        <Divider />
        <ListItemButton
          onClick={() => setOpenVAFilter(!openVAFilter)}
        >
          <DenseListItemIcon>
            {openVAFilter ? <ExpandLess /> : <ExpandMore />}
          </DenseListItemIcon>
          <ListItemText
            primary="성우/캐릭터 필터"
            primaryTypographyProps={{
              sx: sectionHeaderTextStyle,
              variant: 'body2',
            }}
          />
        </ListItemButton>
        <Collapse in={openVAFilter} timeout="auto" unmountOnExit>
          <VACheckList
            checkState={vaFilter}
            setCheckState={setVAFilter}
          />
        </Collapse>
        <Divider />
        <ListItemButton
          onClick={() => setOpenCategoryFilter(!openCategoryFilter)}
        >
          <DenseListItemIcon>
            {openCategoryFilter ? <ExpandLess /> : <ExpandMore />}
          </DenseListItemIcon>
          <ListItemText
            primary="분류 필터"
            primaryTypographyProps={{
              sx: sectionHeaderTextStyle,
              variant: 'body2',
            }}
          />
        </ListItemButton>
        <Collapse in={openCategoryFilter} timeout="auto" unmountOnExit>
          <CategoryCheckList
            checkState={categoryFilter}
            setCheckState={setCategoryFilter}
          />
        </Collapse>
        <Divider />
        <ListItemButton
          onClick={() => setOpenETCFilter(!openETCFilter)}
        >
          <DenseListItemIcon>
            {openETCFilter ? <ExpandLess /> : <ExpandMore />}
          </DenseListItemIcon>
          <ListItemText
            primary="기타 필터"
            primaryTypographyProps={{
              sx: sectionHeaderTextStyle,
              variant: 'body2',
            }}
          />
        </ListItemButton>
        <Collapse in={openETCFilter} timeout="auto" unmountOnExit>
          <ETCCheckList
            checkState={etcFilter}
            setCheckState={setETCFilter}
          />
        </Collapse>
        <Center>
          <Button onClick={onSaveSettingsClick} variant="outlined" color="inherit">
            캘린더 설정 저장
          </Button>
        </Center>
        <Center>
          <Button onClick={onExportClick} variant="outlined" color="primary">
            캘린더 내보내기
          </Button>
        </Center>
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
    </Root>
  );
};

export default React.memo(DrawerContent, (prevProps, nextProps) => (
  areEqual(prevProps.currView, nextProps.currView)
  && areEqual(prevProps.vaFilter, nextProps.vaFilter)
  && areEqual(prevProps.categoryFilter, nextProps.categoryFilter)
  && areEqual(prevProps.etcFilter, nextProps.etcFilter)
));
