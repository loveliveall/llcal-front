import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import addMinutes from 'date-fns/addMinutes';
import isEqual from 'date-fns/isEqual';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import { FadeTransition } from '@/components/common/Transitions';
import GridContainer from '@/components/common/GridContainer';
import VACheckList from '@/components/common/VACheckList';

import useMobileCheck from '@/hooks/useMobileCheck';

import {
  addNewEvent,
  editNonRepeatEvent,
  editRepeatEventOnlyThis,
  editRepeatEventAfter,
  editRepeatEventAll,
} from '@/api';
import { voiceActorList } from '@/commonData';
import { AppState } from '@/store';
import { clearToken } from '@/store/auth/actions';
import { closeEventEditDialog } from '@/store/edit-dialog/actions';
import { refreshHash } from '@/store/flags/actions';
import { openSnackbar } from '@/store/snackbar/actions';

import {
  EditRangeEditor, EditRangeEditorProps,
  TitleEditor,
  PlaceEditor,
  DateInfoEditor,
  DescriptionEditor,
  CategoryEditor,
} from './EventEditDialogComp';

const useStyles = makeStyles((theme: Theme) => ({
  dialogTitle: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    alignItems: 'center',
  },
  dialogContent: {
    paddingBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  error: {
    color: 'red',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 10,
    color: '#fff',
  },
}));

const EventEditDialog: React.FC = () => {
  const classes = useStyles();
  const isMobile = useMobileCheck();
  const now = new Date();
  const min = now.getMinutes();
  const initialStart = new Date(
    now.getFullYear(), now.getMonth(), now.getDate(),
    now.getHours(), Math.floor(min / 15) * 15, 0,
  );
  const dispatch = useDispatch();
  const token = useSelector((state: AppState) => state.auth.token);
  const open = useSelector((state: AppState) => state.editDialog.open);
  const origEvent = useSelector((state: AppState) => state.editDialog.event);
  const [loading, setLoading] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const [editRange, setEditRange] = React.useState<EditRangeEditorProps['editRange']>(null);
  const [title, setTitle] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [allDay, setAllDay] = React.useState(false);
  const [start, setStart] = React.useState(initialStart);
  const [end, setEnd] = React.useState(addMinutes(initialStart, 30));
  const [rrule, setRRule] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [categoryId, setCategoryId] = React.useState<number | null>(null);
  const [isLoveLive, setIsLoveLive] = React.useState(false);
  const [isRepeating, setIsRepeating] = React.useState(false);
  const [vaIdList, setVAIdList] = React.useState<number[]>([]);
  const isEditRepeat = origEvent !== null && origEvent.rrule !== '';

  React.useEffect(() => {
    const now2 = new Date();
    const min2 = now2.getMinutes();
    const nowStart = new Date(
      now2.getFullYear(), now2.getMonth(), now2.getDate(),
      now2.getHours(), Math.floor(min2 / 15) * 15, 0,
    );
    setErrMsg('');
    setEditRange(null);
    setTitle(origEvent === null ? '' : origEvent.title);
    setPlace(origEvent === null ? '' : origEvent.place);
    setAllDay(origEvent === null ? false : origEvent.allDay);
    setStart(origEvent === null ? nowStart : origEvent.startTime);
    setEnd(origEvent === null ? addMinutes(nowStart, 30) : origEvent.endTime);
    setRRule(origEvent === null ? '' : origEvent.rrule);
    setDesc(origEvent === null ? '' : origEvent.description);
    setCategoryId(origEvent === null ? null : origEvent.categoryId);
    setIsLoveLive(origEvent === null ? false : origEvent.isLoveLive);
    setIsRepeating(origEvent === null ? false : origEvent.isRepeating);
    setVAIdList(origEvent === null ? [] : origEvent.voiceActorIds);
  }, [open]);

  if (token === null) return null;

  const onCloseDialog = () => {
    dispatch(closeEventEditDialog());
  };
  const onSaveClick = () => {
    if (isEditRepeat && editRange === null) {
      setErrMsg('적절한 수정 범위를 반드시 선택해야 합니다');
    } else if (title === '') {
      setErrMsg('제목이 반드시 필요합니다');
    } else if (start > end) {
      setErrMsg('일정의 끝은 반드시 시작 이후여야 합니다');
    } else if (categoryId === null) {
      setErrMsg('반드시 적절한 분류가 선택되어야 합니다');
    } else if (vaIdList.length === 0) {
      setErrMsg('최소 한 명의 성우가 필요합니다');
    } else {
      setLoading(true);
      (async () => {
        if (origEvent === null) {
          // Add new event
          return addNewEvent(
            token,
            title, place, desc, start, end, allDay, rrule,
            categoryId, vaIdList, isLoveLive, isRepeating,
          );
        }
        const { serverId } = origEvent;
        // Editing event
        if (!isEditRepeat) {
          // Edit non-repeating event
          return editNonRepeatEvent(
            token,
            serverId, title, place, desc, start, end, allDay, rrule,
            categoryId, vaIdList, isLoveLive, isRepeating,
          );
        }
        if (editRange === 'this') {
          // Edit only this instance of repeating event
          return editRepeatEventOnlyThis(
            token, origEvent.startTime,
            serverId, title, place, desc, start, end, allDay,
            categoryId, vaIdList, isLoveLive, isRepeating,
          );
        }
        if (editRange === 'after' && !isEqual(origEvent.dtstart, origEvent.startTime)) {
          // Edit this instance and after of repeating event
          // If dtstart === startTime, then it is same as 'all' editRange
          const origDuration = (origEvent.endTime.getTime() - origEvent.startTime.getTime()) / 1000;
          return editRepeatEventAfter(
            token, origEvent.dtstart, origEvent.rrule, origDuration,
            serverId, title, place, desc, start, end, allDay, rrule,
            categoryId, vaIdList, isLoveLive, isRepeating,
          );
        }
        if (editRange === 'all' || (editRange === 'after' && isEqual(origEvent.dtstart, origEvent.startTime))) {
          // Edit every instance of repeating event
          return editRepeatEventAll(
            token, origEvent.startTime, origEvent.dtstart,
            serverId, title, place, desc, start, end, allDay, rrule,
            categoryId, vaIdList, isLoveLive, isRepeating,
          );
        }
        return false;
      })().then((ok) => {
        setLoading(false);
        if (ok) {
          dispatch(refreshHash());
        } else {
          // Token expired
          dispatch(clearToken());
          dispatch(openSnackbar('토큰이 만료되었습니다. 로그아웃합니다.'));
        }
        dispatch(closeEventEditDialog());
      }).catch((e) => {
        setLoading(false);
        console.error(e);
        dispatch(openSnackbar('API 요청에 문제가 발생했습니다. 관리자에게 문의하세요.'));
      });
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onCloseDialog}
      scroll="paper"
      TransitionComponent={FadeTransition}
      fullScreen={isMobile}
      fullWidth
      disableBackdropClick
    >
      <div id="event-dialog-title" className={classes.dialogTitle}>
        <Typography variant="h6">{origEvent === null ? '새 일정 생성' : '일정 수정'}</Typography>
        <div className={classes.grow} />
        <Tooltip title="저장">
          <IconButton onClick={onSaveClick} disabled={loading}>
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="닫기">
          <IconButton onClick={onCloseDialog} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      <DialogContent className={classes.dialogContent}>
        {errMsg !== '' && (
          <Typography className={classes.error}>{errMsg}</Typography>
        )}
        {/* Edit range */}
        {isEditRepeat && (
          <EditRangeEditor
            editRange={editRange}
            setEditRange={setEditRange}
          />
        )}
        {/* Title */}
        <TitleEditor
          title={title}
          setTitle={setTitle}
        />
        {/* Place */}
        <PlaceEditor
          place={place}
          setPlace={setPlace}
        />
        {/* Date */}
        <DateInfoEditor
          allDay={allDay}
          setAllDay={setAllDay}
          start={start}
          setStart={setStart}
          end={end}
          setEnd={setEnd}
          rrule={rrule}
          setRRule={setRRule}
          setIsRepeating={setIsRepeating}
          isFreqEditDisabled={isEditRepeat}
          isEditOnlyThis={editRange === 'this'}
        />
        {/* Description */}
        <DescriptionEditor
          description={desc}
          setDescription={setDesc}
        />
        {/* Category */}
        <CategoryEditor
          categoryId={categoryId}
          setCategoryId={setCategoryId}
        />
        {/* Is LoveLive */}
        <GridContainer>
          <Grid item xs={2} />
          <Grid item>
            <Typography component="span">러브라이브 관련</Typography>
            <Switch
              checked={isLoveLive}
              onChange={() => setIsLoveLive((prev) => !prev)}
            />
          </Grid>
        </GridContainer>
        {/* Is Repeating */}
        <GridContainer>
          <Grid item xs={2} />
          <Grid item>
            <Typography component="span">정기 일정</Typography>
            <Switch
              checked={isRepeating}
              onChange={() => setIsRepeating((prev) => !prev)}
            />
          </Grid>
        </GridContainer>
        {/* VA Check List */}
        <GridContainer>
          <Grid item xs={2}>
            <Typography>관련 성우</Typography>
          </Grid>
          <Grid item xs>
            <VACheckList
              checkState={voiceActorList.reduce((acc, curr) => ({
                ...acc,
                [curr.id]: vaIdList.includes(curr.id),
              }), {})}
              setCheckState={(newState) => setVAIdList(voiceActorList.filter(
                (va) => newState[va.id],
              ).map((va) => va.id))}
            />
          </Grid>
        </GridContainer>
      </DialogContent>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default EventEditDialog;
