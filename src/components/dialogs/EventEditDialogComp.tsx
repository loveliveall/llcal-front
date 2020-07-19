import React from 'react';
import RRule from 'rrule';
import addMinutes from 'date-fns/addMinutes';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import ListSubheader from '@material-ui/core/ListSubheader';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import { DatePicker, DateTimePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import GridContainer from '@/components/common/GridContainer';

import { rruleToText } from '@/utils';
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
  <GridContainer>
    <Grid item xs={2}>
      <Typography>수정 범위</Typography>
    </Grid>
    <Grid item xs>
      <Select
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
);
export const TitleEditor = TitleEditorComp;

export type PlaceEditorProps = {
  place: string,
  setPlace: (newValue: string) => void,
};
const PlaceEditorComp: React.FC<PlaceEditorProps> = ({
  place, setPlace,
}) => (
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
);
export const PlaceEditor = PlaceEditorComp;

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

  const handleStartChange = (date: MaterialUiPickersDate) => {
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
          const weekdayList = match[1].split(',');
          if (weekdayList.length === 1) {
            opt.byweekday = [jsDayToWeekday[purifiedDate.getDay()]];
            setRRule(RRule.optionsToString(opt));
          }
        }
      }
    }
  };
  const handleEndChange = (date: MaterialUiPickersDate) => {
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
          {isEditOnlyThis ? (
            <Button variant="outlined" disabled>
              반복 없음
            </Button>
          ) : (
            <Button variant="outlined" onClick={openRRuleModal}>
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
  <GridContainer>
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
  <GridContainer>
    <Grid item xs={2}>
      <Typography>분류</Typography>
    </Grid>
    <Grid item xs>
      <Select
        value={categoryId === null ? 'None' : categoryId}
        error={categoryId === null}
        onChange={(e) => setCategoryId(e.target.value as number | null)}
      >
        <MenuItem value="None">선택해주세요</MenuItem>
        {categoryGroupList.map((group) => (
          [
            <ListSubheader>{group.name}</ListSubheader>,
            editableCategoryList.filter((cat) => cat.groupId === group.id).map((cat) => (
              <MenuItem key={`category-${cat.id}`} value={cat.id}>{cat.name}</MenuItem>
            )),
          ]
        ))}
        <ListSubheader>그룹 없음</ListSubheader>
        {editableCategoryList.filter((cat) => cat.groupId === null).map((cat) => (
          <MenuItem key={`category-${cat.id}`} value={cat.id}>{cat.name}</MenuItem>
        ))}
      </Select>
    </Grid>
  </GridContainer>
);
export const CategoryEditor = CategoryEditorComp;
