import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Linkify, { Props as LinkifyProps } from 'react-linkify';

import { styled } from '@mui/material/styles';
import MuiButton from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MuiDialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import LabelIcon from '@mui/icons-material/Label';
import LinkIcon from '@mui/icons-material/Link';
import NotesIcon from '@mui/icons-material/Notes';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';
import RepeatIcon from '@mui/icons-material/Repeat';

import { FadeTransition } from '@/components/common/Transitions';

import useMobileCheck from '@/hooks/useMobileCheck';

import { AppState } from '@/store';
import { openEventDeleteDialog } from '@/store/delete-dialog/actions';
import { closeEventDetailDialog } from '@/store/detail-dialog/actions';
import { openEventDuplicateDialog } from '@/store/duplicate-dialog/actions';
import { openEventEditDialog } from '@/store/edit-dialog/actions';
import {
  rruleToText,
  getObjWithProp,
  getDateRangeStr,
} from '@/utils';
import { eventCategoryList, voiceActorList, groupInfoList } from '@/commonData';

const linkifyDecorator: LinkifyProps['componentDecorator'] = (href, text, key) => (
  <a href={href} key={key} target="_blank" rel="noreferrer">
    {text}
  </a>
);

const DialogTitle = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  alignItems: 'center',
}));
const DialogContent = styled(MuiDialogContent)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),
}));
const Spacer = styled('div')`
  flex-grow: 1;
`;
const ButtonDiv = styled('div')`
  display: flex;
  width: 100%;
`;
const Button = styled(MuiButton)(({ theme }) => ({
  flexGrow: 1,
  marginLeft: theme.spacing(0.5),
  marginRight: theme.spacing(0.5),
}));

const EventDetailDialog: React.FC = () => {
  const isMobile = useMobileCheck();
  const dispatch = useDispatch();
  const authorized = useSelector((state: AppState) => state.auth.token !== null);
  const open = useSelector((state: AppState) => state.detailDialog.open);
  const event = useSelector((state: AppState) => state.detailDialog.event);
  if (event === null) return null;
  const category = getObjWithProp(eventCategoryList, 'id', event.categoryId);

  const { startTime, endTime } = event;
  const dateRangeStr = getDateRangeStr(startTime, endTime, event.allDay);

  const onDeleteClick = () => {
    dispatch(closeEventDetailDialog());
    dispatch(openEventDeleteDialog(event));
  };
  const onDuplicateClick = () => {
    dispatch(closeEventDetailDialog());
    dispatch(openEventDuplicateDialog(event));
  };
  const onEditClick = () => {
    dispatch(closeEventDetailDialog());
    dispatch(openEventEditDialog(event));
  };
  const onCloseDialog = () => {
    dispatch(closeEventDetailDialog());
  };
  return (
    <Dialog
      open={open}
      onClose={onCloseDialog}
      scroll="paper"
      TransitionComponent={FadeTransition}
      keepMounted
      fullScreen={isMobile}
      fullWidth
    >
      <DialogTitle id="event-dialog-title">
        <Typography variant="h6">{event.title}</Typography>
        <Spacer />
        <Tooltip title="닫기" disableInteractive>
          <IconButton onClick={onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        {authorized && category?.frozen === false && (
          <ButtonDiv>
            <Button
              color="error"
              variant="outlined"
              onClick={onDeleteClick}
              startIcon={<DeleteIcon />}
            >
              삭제
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              onClick={onDuplicateClick}
              startIcon={<FileCopyIcon />}
            >
              복제
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              onClick={onEditClick}
              startIcon={<EditIcon />}
            >
              수정
            </Button>
          </ButtonDiv>
        )}
        <List dense disablePadding>
          {authorized && (
            <ListItem disableGutters>
              <ListItemIcon>
                <Tooltip title="ID" arrow disableInteractive><NotesIcon /></Tooltip>
              </ListItemIcon>
              <ListItemText
                primary={event.serverId}
              />
            </ListItem>
          )}
          {/* Date range */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="시간" arrow disableInteractive><DateRangeIcon /></Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={dateRangeStr}
              secondary={rruleToText(event.startTime, event.rrule)}
            />
          </ListItem>
          {/* Place */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="장소" arrow disableInteractive><PlaceIcon /></Tooltip>
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={(
                <Linkify componentDecorator={linkifyDecorator}>
                  <Typography variant="body2">{event.place}</Typography>
                </Linkify>
              )}
            />
          </ListItem>
          {/* Link */}
          {event.link !== null && event.link !== '' && (
            <ListItem disableGutters>
              <ListItemIcon>
                <Tooltip title="일정 관련 URL" arrow disableInteractive><LinkIcon /></Tooltip>
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={(
                  <Linkify componentDecorator={linkifyDecorator}>
                    <Typography variant="body2">{event.link}</Typography>
                  </Linkify>
                )}
              />
            </ListItem>
          )}
          {/* Description */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="상세 설명" arrow disableInteractive><NotesIcon /></Tooltip>
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={(
                <Linkify componentDecorator={linkifyDecorator}>
                  <Typography
                    variant="body2"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {event.description}
                  </Typography>
                </Linkify>
              )}
            />
          </ListItem>
          {/* Category */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="분류" arrow disableInteractive><LabelIcon /></Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={category?.name}
            />
          </ListItem>
          {/* VA List */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="관련 성우" arrow disableInteractive><PersonIcon /></Tooltip>
            </ListItemIcon>
            <div style={{ maxHeight: 150, overflowY: 'auto', flex: 1 }}>
              <List dense disablePadding>
                {event.voiceActorIds.map((vaId) => {
                  const va = getObjWithProp(voiceActorList, 'id', vaId);
                  if (va === undefined) return null;
                  const group = getObjWithProp(groupInfoList, 'id', va.groupId);
                  if (group === undefined) return null; // We are guaranteed to find group
                  return (
                    <ListItem key={`detail-${vaId}`} disableGutters>
                      <ListItemText
                        primary={`${va.name} (${group.name})`}
                        secondary={va.character}
                        secondaryTypographyProps={{
                          variant: 'caption',
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </ListItem>
          {/* Is LoveLive */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="러브라이브 관련 여부" arrow disableInteractive><FavoriteIcon /></Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={event.isLoveLive ? 'LoveLive! 관련' : 'LoveLive! 비관련'}
            />
          </ListItem>
          {/* Is Repeating */}
          <ListItem disableGutters>
            <ListItemIcon>
              <Tooltip title="정기 일정 여부" arrow disableInteractive><RepeatIcon /></Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={event.isRepeating ? '정기 일정' : '비정기 일정'}
            />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailDialog;
