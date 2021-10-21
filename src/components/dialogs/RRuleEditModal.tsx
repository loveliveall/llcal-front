import React from 'react';
import RRule, { Frequency, Weekday } from 'rrule';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import { DatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

import GridContainer from '@/components/common/GridContainer';
import { getNth } from '@/utils';

interface RRuleOptions {
  freq?: Frequency,
  interval?: number,
  byweekday?: Weekday[],
  bymonthday?: number[],
  until?: Date,
  count?: number,
}

const strToWeekday = {
  SU: RRule.SU,
  MO: RRule.MO,
  TU: RRule.TU,
  WE: RRule.WE,
  TH: RRule.TH,
  FR: RRule.FR,
  SA: RRule.SA,
};

const jsDayToWeekday = [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA];
const jsDayToKor = ['일', '월', '화', '수', '목', '금', '토'];

function rruleStrToOpts(rruleStr: string): RRuleOptions {
  const rrOpts: RRuleOptions = {
    interval: 1,
  };
  if (rruleStr !== '') {
    const options = RRule.parseString(rruleStr);
    rrOpts.freq = options.freq;
    if (options.interval) rrOpts.interval = options.interval;
    // Weekday
    const match = /BYDAY=(.*?)(;|$)/m.exec(rruleStr);
    if (match) {
      rrOpts.byweekday = match[1].split(',').map((str) => {
        if (str.length === 2) {
          // No nth prefixing
          return strToWeekday[str as keyof typeof strToWeekday];
        }
        // Get nth
        const nth = Number(str.slice(0, str.length - 2));
        const wd = str.slice(-2) as keyof typeof strToWeekday;
        return strToWeekday[wd].nth(nth);
      });
    }
    // Monthday
    const match2 = /BYMONTHDAY=(.*?)(;|$)/m.exec(rruleStr);
    if (match2) {
      rrOpts.bymonthday = match2[1].split(',').map(Number);
    }
    if (options.until) {
      const rruleUntil = options.until;
      const localUntil = new Date(
        rruleUntil.getUTCFullYear(), rruleUntil.getUTCMonth(), rruleUntil.getUTCDate(), 23, 59,
      );
      rrOpts.until = localUntil;
    } else if (options.count) {
      rrOpts.count = options.count;
    }
  }
  return rrOpts;
}

function optsToRRuleStr(options: RRuleOptions): string {
  if (options.freq === undefined) return '';
  const commonOptions: {
    freq: Frequency,
    interval?: number,
    count?: number,
    until?: Date,
  } = {
    freq: options.freq,
    interval: options.interval,
  };
  if (options.count) commonOptions.count = options.count;
  else if (options.until) {
    const localUntil = options.until;
    const rruleUntil = new Date(
      localUntil.getUTCFullYear(), localUntil.getUTCMonth(), localUntil.getUTCDate(), 23, 59,
    );
    commonOptions.until = rruleUntil;
  }

  if (options.freq === RRule.YEARLY) return RRule.optionsToString({ ...commonOptions });
  if (options.freq === RRule.WEEKLY) return RRule.optionsToString({ ...commonOptions, byweekday: options.byweekday });
  if (options.freq === RRule.MONTHLY) {
    return RRule.optionsToString({
      ...commonOptions,
      byweekday: options.byweekday,
      bymonthday: (options.bymonthday ?? []).sort((a, b) => a - b),
    });
  }
  if (options.freq === RRule.DAILY) return RRule.optionsToString({ ...commonOptions });
  return '';
}

function getEndType(rrOpts: RRuleOptions) {
  if (rrOpts.until === undefined && rrOpts.count === undefined) return 'none';
  if (rrOpts.until === undefined && rrOpts.count !== undefined) return 'count';
  if (rrOpts.until !== undefined && rrOpts.count === undefined) return 'until';
  return '';
}

type MonthlyDetail = 'weekday_positive' | 'weekday_negative' | 'weekday_monthday' | 'single_monthday';
function getMonthlyDetail(rrOpts: RRuleOptions): MonthlyDetail | '' {
  if (rrOpts.freq === RRule.MONTHLY) {
    const { byweekday, bymonthday } = rrOpts;
    if (byweekday !== undefined && byweekday.length === 1) {
      if (bymonthday !== undefined) return 'weekday_monthday';
      const { n } = byweekday[0];
      if (n !== undefined && n > 0) return 'weekday_positive';
      if (n !== undefined && n < 0) return 'weekday_negative';
    }
    if (byweekday === undefined || byweekday.length === 0) {
      if (bymonthday !== undefined && bymonthday.length === 1) return 'single_monthday';
    }
    // Handle bymonthday?
  }
  return '';
}

interface OwnProps {
  open: boolean,
  setOpen: (open: boolean) => void,
  start: Date,
  rrule: string,
  setRRule: (rrule: string) => void,
  isFreqEditDisabled: boolean,
}
export type RRuleEditModalProps = OwnProps;

const RRuleEditModal: React.FC<RRuleEditModalProps> = ({
  open, setOpen, start, rrule, setRRule, isFreqEditDisabled,
}) => {
  const [localRRule, setLocalRRule] = React.useState<RRuleOptions>({});
  React.useEffect(() => {
    setLocalRRule(rruleStrToOpts(rrule));
  }, [open]);

  const posNth = getNth(start, true);
  const negNth = getNth(start, false);
  const onChangeInterval = (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setLocalRRule({
      ...localRRule,
      interval: Number(ev.target.value),
    });
  };
  const onEndTypeChange = (ev: React.ChangeEvent<{ value: unknown, }>) => {
    const selected = ev.target.value as 'none' | 'count' | 'until';
    if (selected === 'none') {
      setLocalRRule({
        ...localRRule,
        count: undefined,
        until: undefined,
      });
    } else if (selected === 'count') {
      setLocalRRule({
        ...localRRule,
        count: 1,
        until: undefined,
      });
    } else {
      setLocalRRule({
        ...localRRule,
        count: undefined,
        until: new Date(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59),
      });
    }
  };
  const onUntilChange = (date: MaterialUiPickersDate) => {
    if (date !== null) {
      const parsed = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
      setLocalRRule({
        ...localRRule,
        until: parsed,
      });
    }
  };
  const onSaveClick = () => {
    setRRule(optsToRRuleStr(localRRule));
    setOpen(false);
  };
  const onCloseDialog = () => {
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onClose={onCloseDialog}
      scroll="paper"
      keepMounted
      fullWidth
      disableBackdropClick
    >
      <DialogTitle>반복 설정</DialogTitle>
      <DialogContent>
        {/* Repeat frequency */}
        <GridContainer>
          <Grid item xs={2}>
            <Typography>반복 주기: </Typography>
          </Grid>
          {localRRule.freq !== undefined && (
            <Grid item>
              <Input
                id="interval"
                type="number"
                value={localRRule.interval}
                onChange={onChangeInterval}
                disabled={isFreqEditDisabled}
                style={{ width: 50 }}
              />
            </Grid>
          )}
          <Grid item xs>
            <Select
              value={localRRule.freq ?? 'None'}
              onChange={(e) => {
                const selected = e.target.value === 'None' ? undefined : e.target.value as Frequency;
                if (selected === RRule.WEEKLY) {
                  setLocalRRule({
                    ...localRRule,
                    freq: selected,
                    byweekday: [jsDayToWeekday[start.getDay()]],
                  });
                } else if (selected === RRule.MONTHLY) {
                  setLocalRRule({
                    ...localRRule,
                    freq: selected,
                    byweekday: [jsDayToWeekday[start.getDay()].nth(posNth)],
                    bymonthday: undefined,
                  });
                } else {
                  setLocalRRule({
                    ...localRRule,
                    freq: selected,
                  });
                }
              }}
              disabled={isFreqEditDisabled}
            >
              <MenuItem value="None">없음</MenuItem>
              <MenuItem value={RRule.DAILY}>일</MenuItem>
              <MenuItem value={RRule.WEEKLY}>주</MenuItem>
              <MenuItem value={RRule.MONTHLY}>개월</MenuItem>
              <MenuItem value={RRule.YEARLY}>년</MenuItem>
            </Select>
          </Grid>
        </GridContainer>

        {/* Weekday settings for Monthly freq */}
        {localRRule.freq === RRule.MONTHLY && (
          <>
            <GridContainer>
              <Grid item xs={2}>
                <Typography>세부 설정: </Typography>
              </Grid>
              <Grid item xs>
                <Select
                  value={getMonthlyDetail(localRRule)}
                  onChange={(e) => {
                    const selected = e.target.value as MonthlyDetail;
                    if (selected === 'weekday_positive') {
                      setLocalRRule({
                        ...localRRule,
                        byweekday: [jsDayToWeekday[start.getDay()].nth(posNth)],
                        bymonthday: undefined,
                      });
                    } else if (selected === 'weekday_negative') {
                      setLocalRRule({
                        ...localRRule,
                        byweekday: [jsDayToWeekday[start.getDay()].nth(negNth)],
                        bymonthday: undefined,
                      });
                    } else if (selected === 'weekday_monthday') {
                      setLocalRRule({
                        ...localRRule,
                        byweekday: [jsDayToWeekday[start.getDay()]],
                        bymonthday: [start.getDate()],
                      });
                    } else if (selected === 'single_monthday') {
                      setLocalRRule({
                        ...localRRule,
                        byweekday: undefined,
                        bymonthday: [start.getDate()],
                      });
                    }
                  }}
                  disabled={isFreqEditDisabled}
                >
                  <MenuItem value="weekday_positive">
                    {`${posNth}번째 ${jsDayToKor[start.getDay()]}요일`}
                  </MenuItem>
                  <MenuItem value="weekday_negative">
                    {`${negNth === -1 ? '마지막' : `끝에서 ${Math.abs(negNth)}번째`} ${jsDayToKor[start.getDay()]}요일`}
                  </MenuItem>
                  <MenuItem value="weekday_monthday">
                    {`조건을 만족하는 ${jsDayToKor[start.getDay()]}요일`}
                  </MenuItem>
                  <MenuItem value="single_monthday">
                    {`${start.getDate()}일`}
                  </MenuItem>
                </Select>
              </Grid>
            </GridContainer>
            {getMonthlyDetail(localRRule) === 'weekday_monthday' && (
              new Array(2).fill(null).map((_, typeIdx) => (
                // eslint-disable-next-line react/no-array-index-key
                <GridContainer key={typeIdx}>
                  {new Array(31).fill(null).map((__, dayIdx) => {
                    const day = (typeIdx === 0 ? 1 : -1) * (dayIdx + 1);
                    const { bymonthday } = localRRule;
                    const target = bymonthday ?? [];
                    const isChecked = target.includes(day);
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <Grid key={dayIdx} item xs>
                        <FormControlLabel
                          control={(
                            <Checkbox
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setLocalRRule({
                                    ...localRRule,
                                    bymonthday: target.filter((e) => e !== day),
                                  });
                                } else {
                                  setLocalRRule({
                                    ...localRRule,
                                    bymonthday: [...target, day],
                                  });
                                }
                              }}
                            />
                          )}
                          label={day}
                        />
                      </Grid>
                    );
                  })}
                </GridContainer>
              ))
            )}
          </>
        )}

        {/* Repeat end condition */}
        {localRRule.freq !== undefined && (
          <>
            <GridContainer>
              <Grid item xs={2}>
                <Typography>반복 종료: </Typography>
              </Grid>
              <Grid item xs>
                <Select
                  value={getEndType(localRRule)}
                  onChange={onEndTypeChange}
                >
                  <MenuItem value="none">없음</MenuItem>
                  <MenuItem value="until">날짜</MenuItem>
                  <MenuItem value="count">횟수</MenuItem>
                </Select>
              </Grid>
            </GridContainer>
            {/* Set until */}
            {(localRRule.until !== undefined && localRRule.count === undefined) && (
              <GridContainer>
                <Grid item>
                  <DatePicker
                    format="yyyy/MM/dd"
                    label="종료일"
                    value={localRRule.until}
                    onChange={onUntilChange}
                    minDate={start}
                  />
                </Grid>
              </GridContainer>
            )}
            {/* Set count */}
            {(localRRule.count !== undefined && localRRule.until === undefined) && (
              <GridContainer>
                <Grid item>
                  <Input
                    id="count"
                    type="number"
                    value={localRRule.count}
                    onChange={(e) => setLocalRRule({
                      ...localRRule,
                      count: Number(e.target.value),
                    })}
                  />
                </Grid>
                <Grid item>
                  <Typography>회 반복</Typography>
                </Grid>
              </GridContainer>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onSaveClick}>저장</Button>
        <Button color="primary" onClick={onCloseDialog}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RRuleEditModal;
