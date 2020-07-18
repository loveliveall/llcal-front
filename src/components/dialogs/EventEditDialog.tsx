import React from 'react';
import RRule from 'rrule';
import { useSelector, useDispatch } from 'react-redux';
import addMinutes from 'date-fns/addMinutes';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {
  DatePicker,
  DateTimePicker,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import { SlideUpTransition } from '@/components/common/Transitions';
import GridContainer from '@/components/common/GridContainer';
import VACheckList from '@/components/common/VACheckList';

import useMobileCheck from '@/hooks/useMobileCheck';

import { voiceActorList } from '@/commonData';
import { AppState } from '@/store';
import { closeEventEditDialog } from '@/store/edit-dialog/actions';
import { rruleToText } from '@/utils';

import RRuleEditModal from './RRuleEditModal';

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
}));

const jsDayToWeekday = [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA];

const EventEditDialog: React.FC = () => {
  const classes = useStyles();
  const isMobile = useMobileCheck();
  const initialStart = new Date();
  initialStart.setMinutes(Math.floor(initialStart.getMinutes() / 15) * 15);
  const dispatch = useDispatch();
  const open = useSelector((state: AppState) => state.editDialog.open);
  const origEvent = useSelector((state: AppState) => state.editDialog.event);
  const [editRange, setEditRange] = React.useState<'this' | 'after' | 'all'>('this');
  const [title, setTitle] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [allDay, setAllDay] = React.useState(false);
  const [start, setStart] = React.useState(initialStart);
  const [end, setEnd] = React.useState(addMinutes(initialStart, 30));
  const [rrule, setRRule] = React.useState('');
  const [rruleModalOpen, setRRuleModalOpen] = React.useState(false);
  const [desc, setDesc] = React.useState('');
  const [categoryId, setCategroyId] = React.useState<number>(1);
  const [isLoveLive, setIsLoveLive] = React.useState(false);
  const [isRepeating, setIsRepeating] = React.useState(false);
  const [vaIdList, setVAIdList] = React.useState<number[]>([]);

  React.useEffect(() => {
    const nowStart = new Date();
    nowStart.setMinutes(Math.floor(nowStart.getMinutes() / 15) * 15);
    setEditRange('this');
    setTitle(origEvent === null ? '' : origEvent.title);
    setPlace(origEvent === null ? '' : origEvent.place);
    setAllDay(origEvent === null ? false : origEvent.allDay);
    setStart(origEvent === null ? nowStart : origEvent.startTime);
    setEnd(origEvent === null ? addMinutes(nowStart, 30) : origEvent.endTime);
    setRRule(origEvent === null ? '' : origEvent.rrule);
    setDesc(origEvent === null ? '' : origEvent.description);
    setCategroyId(origEvent === null ? 1 : origEvent.categoryId);
    setIsLoveLive(origEvent === null ? false : origEvent.isLoveLive);
    setIsRepeating(origEvent === null ? false : origEvent.isRepeating);
    setVAIdList(origEvent === null ? [] : origEvent.voiceActorIds);
  }, [open]);

  const onCloseDialog = () => {
    dispatch(closeEventEditDialog());
  };
  const onSaveClick = () => {
    console.log('Save! do here!');
  };
  const handleStartChange = (date: MaterialUiPickersDate) => {
    if (date !== null) {
      setStart(date);
      if (end < date) {
        setEnd(addMinutes(date, 30));
      }
      // Update rrule for weekly repeat
      const opt = RRule.parseString(rrule);
      if (opt.freq === RRule.WEEKLY) {
        const match = /BYDAY=(.*?)(;|$)/m.exec(rrule);
        if (match) {
          const weekdayList = match[1].split(',');
          if (weekdayList.length === 1) {
            opt.byweekday = [jsDayToWeekday[date.getDay()]];
            setRRule(RRule.optionsToString(opt));
          }
        }
      }
    }
  };
  const handleEndChange = (date: MaterialUiPickersDate) => {
    if (date !== null) {
      if (date < start) {
        setEnd(addMinutes(start, 30));
      } else {
        setEnd(date);
      }
    }
  };
  const openRRuleModal = () => {
    setRRuleModalOpen(true);
  };
  return (
    <Dialog
      open={open}
      onClose={onCloseDialog}
      scroll="paper"
      TransitionComponent={SlideUpTransition}
      keepMounted
      fullScreen={isMobile}
      fullWidth
      disableBackdropClick
    >
      <div id="event-dialog-title" className={classes.dialogTitle}>
        <Typography variant="h6">{origEvent === null ? '새 일정 생성' : '일정 수정'}</Typography>
        <div className={classes.grow} />
        <Tooltip title="저장">
          <IconButton onClick={onSaveClick}>
            <SaveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="닫기">
          <IconButton onClick={onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      <DialogContent className={classes.dialogContent}>
        {/* Edit range */}
        {origEvent !== null && origEvent.rrule !== '' && (
          <GridContainer>
            <Grid item xs={2}>
              <Typography>수정 범위</Typography>
            </Grid>
            <Grid item xs>
              <Select
                value={editRange}
                onChange={(e) => setEditRange(e.target.value as 'this' | 'after' | 'all')}
              >
                <MenuItem value="this">이 일정만</MenuItem>
                <MenuItem value="after">이 일정 및 향후 일정</MenuItem>
                <MenuItem value="all">모든 반복 일정</MenuItem>
              </Select>
            </Grid>
          </GridContainer>
        )}
        {/* Title */}
        <GridContainer>
          <Grid item xs={2}>
            <Typography>제목</Typography>
          </Grid>
          <Grid item xs>
            <Input
              id="title"
              value={title}
              error={title === ''}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              inputProps={{
                autoCapitalize: 'none',
                autoCorrect: 'off',
              }}
            />
          </Grid>
        </GridContainer>
        {/* Place */}
        <GridContainer>
          <Grid item xs={2}>
            <Typography>장소</Typography>
          </Grid>
          <Grid item xs>
            <Input
              id="place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              fullWidth
              inputProps={{
                autoCapitalize: 'none',
                autoCorrect: 'off',
              }}
            />
          </Grid>
        </GridContainer>
        {/* Date */}
        <GridContainer>
          <Grid item xs={2} />
          <Grid item xs>
            <Typography component="span">하루 종일</Typography>
            <Switch
              checked={allDay}
              onChange={() => setAllDay((prev) => !prev)}
            />
          </Grid>
        </GridContainer>
        <GridContainer>
          <Grid item xs={2}>
            <Typography>시작</Typography>
          </Grid>
          <Grid item xs>
            {allDay ? (
              <DatePicker
                value={start}
                onChange={handleStartChange}
                format="yyyy/MM/dd"
              />
            ) : (
              <DateTimePicker
                value={start}
                onChange={handleStartChange}
                format="yyyy/MM/dd HH:mm"
                minutesStep={5}
              />
            )}
          </Grid>
        </GridContainer>
        <GridContainer>
          <Grid item xs={2}>
            <Typography>종료</Typography>
          </Grid>
          <Grid item xs>
            {allDay ? (
              <DatePicker
                value={end}
                minDate={start}
                onChange={handleEndChange}
                format="yyyy/MM/dd"
              />
            ) : (
              <DateTimePicker
                value={end}
                minDate={start}
                onChange={handleEndChange}
                format="yyyy/MM/dd HH:mm"
                minutesStep={5}
              />
            )}
          </Grid>
        </GridContainer>
        <GridContainer>
          <Grid item xs={2}>
            <Typography>반복</Typography>
          </Grid>
          <Grid item xs>
            <Button variant="outlined" onClick={openRRuleModal}>
              {rrule === '' ? '반복 없음' : rruleToText(start, rrule)}
            </Button>
          </Grid>
        </GridContainer>
        {/* Description */}
        <GridContainer>
          <Grid item xs={2}>
            <Typography>상세 설명</Typography>
          </Grid>
          <Grid item xs>
            <Input
              id="description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              fullWidth
              multiline
              inputProps={{
                autoCapitalize: 'none',
                autoCorrect: 'off',
              }}
            />
          </Grid>
        </GridContainer>
        {/* Category */}
        <GridContainer>
          <Grid item xs={2}>
            <Typography>분류</Typography>
          </Grid>
          <Grid item xs>
            {categoryId}
          </Grid>
        </GridContainer>
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
      <RRuleEditModal
        open={rruleModalOpen}
        setOpen={(o) => setRRuleModalOpen(o)}
        start={origEvent === null ? new Date() : origEvent.startTime}
        rrule={rrule}
        setRRule={(r) => {
          setRRule(r);
          setIsRepeating(true);
        }}
        isFreqEditDisabled={origEvent !== null && origEvent.rrule !== ''}
      />
    </Dialog>
  );
};

export default EventEditDialog;
