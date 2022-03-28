import React from 'react';
import RRule from 'rrule';
import addMinutes from 'date-fns/addMinutes';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import MobileDatePicker from '@mui/lab/MobileDatePicker';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';

import GridContainer from '@/components/common/GridContainer';

import { rruleToText, getNth } from '@/utils';
import { eventCategoryList, categoryGroupList } from '@/commonData';
import RRuleEditModal from './RRuleEditModal';

type EditRange = 'this' | 'after' | 'all';

export type EditRangeEditorProps = {
  editRange: null | EditRange,
  setEditRange: (newValue: null | EditRange) => void,
};
const EditRangeEditorComp: React.FC<EditRangeEditorProps> = ({
  editRange, setEditRange,
}) => (
  <GridContainer pb={1}>
    <Grid item xs={2}>
      <Typography>수정 범위</Typography>
    </Grid>
    <Grid item xs>
      <Select
        variant="standard"
        value={editRange === null ? 'None' : editRange}
        error={editRange === null}
        onChange={(e) => setEditRange(e.target.value as null | EditRange)}
      >
        <MenuItem value="None">선택해 주세요</MenuItem>
        <MenuItem value="this">이 일정만</MenuItem>
        <MenuItem value="after">이 일정 및 향후 일정</MenuItem>
        <MenuItem value="all">모든 반복 일정</MenuItem>
      </Select>
    </Grid>
  </GridContainer>
);
export const EditRangeEditor = EditRangeEditorComp;

export type TitleEditorProps = {
  title: string,
  setTitle: (newValue: string) => void,
};
const TitleEditorComp: React.FC<TitleEditorProps> = ({
  title, setTitle,
}) => (
  <GridContainer pb={1}>
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
);
export const TitleEditor = TitleEditorComp;

export type PlaceEditorProps = {
  place: string,
  setPlace: (newValue: string) => void,
};
const PlaceEditorComp: React.FC<PlaceEditorProps> = ({
  place, setPlace,
}) => (
  <GridContainer pb={1}>
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
);
export const PlaceEditor = PlaceEditorComp;

export type LinkEditorProps = {
  link: string,
  setLink: (newValue: string) => void,
};
const LinkEditorComp: React.FC<LinkEditorProps> = ({
  link, setLink,
}) => (
  <GridContainer pb={1}>
    <Grid item xs={2}>
      <Typography>URL</Typography>
    </Grid>
    <Grid item xs>
      <Input
        id="link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        fullWidth
        inputProps={{
          autoCapitalize: 'none',
          autoCorrect: 'off',
        }}
      />
    </Grid>
  </GridContainer>
);
export const LinkEditor = LinkEditorComp;

const jsDayToWeekday = [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA];
export type DateInfoEditorProps = {
  allDay: boolean,
  setAllDay: (newValue: boolean) => void,
  start: Date,
  setStart: (newValue: Date) => void,
  end: Date,
  setEnd: (newValue: Date) => void,
  rrule: string,
  setRRule: (newValue: string) => void,
  setIsRepeating: (newValue: boolean) => void,
  isFreqEditDisabled: boolean,
  isEditOnlyThis: boolean,
};
const DateInfoEditorComp: React.FC<DateInfoEditorProps> = ({
  allDay, setAllDay, start, setStart, end, setEnd, rrule, setRRule, setIsRepeating, isFreqEditDisabled,
  isEditOnlyThis,
}) => {
  const [rruleModalOpen, setRRuleModalOpen] = React.useState(false);

  const handleStartChange = (date: Date | null) => {
    if (date !== null) {
      const purifiedDate = new Date(
        date.getFullYear(), date.getMonth(), date.getDate(),
        date.getHours(), date.getMinutes(), 0,
      );
      setStart(purifiedDate);
      setEnd(addMinutes(purifiedDate, 30));
      // Update rrule for weekly repeat
      const opt = RRule.parseString(rrule);
      if (opt.freq === RRule.WEEKLY) {
        const match = /BYDAY=(.*?)(;|$)/m.exec(rrule);
        if (match) {
          const weekdayList = match[1].split(','); // Format ex. MO
          if (weekdayList.length === 1) {
            opt.byweekday = [jsDayToWeekday[purifiedDate.getDay()]];
            setRRule(RRule.optionsToString(opt));
          }
        }
      }
      // Update rrule for monthly repeat
      if (opt.freq === RRule.MONTHLY) {
        // Case 1. BYDAY specified
        const match1 = /BYDAY=(.*?)(;|$)/m.exec(rrule);
        if (match1) {
          const match2 = /BYMONTHDAY=(.*?)(;|$)/m.exec(rrule);
          if (match2) {
            // BYDAY with BYMONTHDAY. Update only weekday info
            opt.byweekday = [jsDayToWeekday[purifiedDate.getDay()]];
            setRRule(RRule.optionsToString(opt));
          } else {
            const weekdayList = match1[1].split(','); // Format ex. 4MO
            if (weekdayList.length === 1) {
              // Get nth from existing rrule
              const prevWeekday = weekdayList[0];
              const prevWeekdayNth = Number(prevWeekday.slice(0, prevWeekday.length - 2));
              opt.byweekday = [jsDayToWeekday[purifiedDate.getDay()].nth(getNth(purifiedDate, prevWeekdayNth >= 0))];
              setRRule(RRule.optionsToString(opt));
            }
          }
        } else {
          // Case 2. No BYDAY specified but BYMONTHDAY specified
          const match2 = /BYMONTHDAY=(.*?)(;|$)/m.exec(rrule);
          if (match2) {
            opt.bymonthday = [purifiedDate.getDate()];
            setRRule(RRule.optionsToString(opt));
          }
        }
      }
    }
  };
  const handleEndChange = (date: Date | null) => {
    if (date !== null) {
      const purifiedDate = new Date(
        date.getFullYear(), date.getMonth(), date.getDate(),
        date.getHours(), date.getMinutes(), 0,
      );
      if (purifiedDate < start) {
        setEnd(addMinutes(start, 30));
      } else {
        setEnd(purifiedDate);
      }
    }
  };
  const openRRuleModal = () => {
    setRRuleModalOpen(true);
  };

  return (
    <>
      <GridContainer>
        <Grid item xs={2} />
        <Grid item xs>
          <Typography component="span">하루 종일</Typography>
          <Switch
            checked={allDay}
            onChange={() => setAllDay(!allDay)}
          />
        </Grid>
      </GridContainer>
      <GridContainer pb={1}>
        <Grid item xs={2}>
          <Typography>시작</Typography>
        </Grid>
        <Grid item xs>
          {allDay ? (
            <MobileDatePicker
              renderInput={(props) => <TextField variant="standard" {...props} />}
              value={start}
              onChange={handleStartChange}
            />
          ) : (
            <MobileDateTimePicker
              renderInput={(props) => <TextField variant="standard" {...props} />}
              value={start}
              onChange={handleStartChange}
              ampm={false}
              minutesStep={5}
            />
          )}
        </Grid>
      </GridContainer>
      <GridContainer pb={1}>
        <Grid item xs={2}>
          <Typography>종료</Typography>
        </Grid>
        <Grid item xs>
          {allDay ? (
            <MobileDatePicker
              renderInput={(props) => <TextField variant="standard" {...props} />}
              value={end}
              minDate={start}
              onChange={handleEndChange}
            />
          ) : (
            <MobileDateTimePicker
              renderInput={(props) => <TextField variant="standard" {...props} />}
              value={end}
              minDate={start}
              onChange={handleEndChange}
              ampm={false}
              minutesStep={5}
            />
          )}
        </Grid>
      </GridContainer>
      <GridContainer pb={1}>
        <Grid item xs={2}>
          <Typography>반복</Typography>
        </Grid>
        <Grid item xs>
          {isEditOnlyThis ? (
            <Button color="inherit" variant="outlined" disabled>
              반복 없음
            </Button>
          ) : (
            <Button color="inherit" variant="outlined" onClick={openRRuleModal}>
              {rrule === '' ? '반복 없음' : rruleToText(start, rrule)}
            </Button>
          )}
        </Grid>
      </GridContainer>
      <RRuleEditModal
        open={rruleModalOpen}
        setOpen={(o) => setRRuleModalOpen(o)}
        start={start}
        rrule={rrule}
        setRRule={(r) => {
          setRRule(r);
          setIsRepeating(true);
        }}
        isFreqEditDisabled={isFreqEditDisabled}
      />
    </>
  );
};
export const DateInfoEditor = React.memo(
  DateInfoEditorComp,
  (prev, next) => (prev.allDay === next.allDay
      && prev.start.getTime() === next.start.getTime()
      && prev.end.getTime() === next.end.getTime()
      && prev.rrule === next.rrule
      && prev.isFreqEditDisabled === next.isFreqEditDisabled
      && prev.isEditOnlyThis === next.isEditOnlyThis
  ),
);

export type DescriptionEditorProps = {
  description: string,
  setDescription: (newValue: string) => void,
};
const DescriptionEditorComp: React.FC<DescriptionEditorProps> = ({
  description, setDescription,
}) => (
  <GridContainer pb={1}>
    <Grid item xs={2}>
      <Typography>상세 설명</Typography>
    </Grid>
    <Grid item xs>
      <Input
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        inputProps={{
          autoCapitalize: 'none',
          autoCorrect: 'off',
        }}
      />
    </Grid>
  </GridContainer>
);
export const DescriptionEditor = DescriptionEditorComp;

const editableCategoryList = eventCategoryList.filter((cat) => !cat.frozen);
export type CategoryEditorProps = {
  categoryId: number | null,
  setCategoryId: (newValue: number | null) => void,
};
const CategoryEditorComp: React.FC<CategoryEditorProps> = ({
  categoryId, setCategoryId,
}) => (
  <GridContainer pb={1}>
    <Grid item xs={2}>
      <Typography>분류</Typography>
    </Grid>
    <Grid item xs>
      <Select
        variant="standard"
        value={categoryId === null ? 'None' : categoryId}
        error={categoryId === null}
        onChange={(e) => setCategoryId(e.target.value as number | null)}
      >
        <MenuItem value="None">선택해주세요</MenuItem>
        <ListSubheader>그룹 없음</ListSubheader>
        {editableCategoryList.filter((cat) => cat.groupId === null).map((cat) => (
          <MenuItem key={`category-${cat.id}`} value={cat.id}>{cat.name}</MenuItem>
        ))}
        {categoryGroupList.map((group) => (
          [
            <ListSubheader>{group.name}</ListSubheader>,
            editableCategoryList.filter((cat) => cat.groupId === group.id).map((cat) => (
              <MenuItem key={`category-${cat.id}`} value={cat.id}>{cat.name}</MenuItem>
            )),
          ]
        ))}
      </Select>
    </Grid>
  </GridContainer>
);
export const CategoryEditor = CategoryEditorComp;
