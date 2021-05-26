import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';

import { FadeTransition } from '@/components/common/Transitions';

import { eventCategoryList } from '@/commonData';
import { getDateString, getObjWithProp } from '@/utils';
import { getRecentlyCreatedEvents, getRecentlyUpdatedEvents, RecentlyReturn } from '@/api';

const useStyles = makeStyles((theme: Theme) => ({
  dialogTitle: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    alignItems: 'center',
  },
  tableHead: {
    fontWeight: 'bolder',
  },
  row: {
    padding: theme.spacing(1),
  },
  dialogContent: {
    paddingBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
}));

interface UpdatesTableProps {
  isLoading: boolean,
  data: RecentlyReturn,
}
const UpdatesTable: React.FC<UpdatesTableProps> = ({
  isLoading, data,
}) => {
  const classes = useStyles();
  if (isLoading) return <CircularProgress />;

  return (
    <TableContainer>
      <Table style={{ whiteSpace: 'nowrap' }}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHead}>제목</TableCell>
            <TableCell className={classes.tableHead}>개요</TableCell>
            <TableCell className={classes.tableHead}>첫 일정 시작</TableCell>
            <TableCell className={classes.tableHead}>분류</TableCell>
            <TableCell className={classes.tableHead}>생성일</TableCell>
            <TableCell className={classes.tableHead}>수정일</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((e) => {
            const { startTime } = e;
            const dateStr = getDateString(startTime);
            const timeStr = `${`0${startTime.getHours()}`.slice(-2)}:${`0${startTime.getMinutes()}`.slice(-2)}`;
            const category = getObjWithProp(eventCategoryList, 'id', e.categoryId);
            return (
              <TableRow key={e.id}>
                <TableCell>
                  <Typography noWrap variant="body2" style={{ width: 200 }}>{e.title}</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap variant="body2" style={{ width: 400 }}>{e.description}</Typography>
                </TableCell>
                <TableCell>{`${dateStr}${e.allDay ? '' : ` ${timeStr}`}`}</TableCell>
                <TableCell>{category?.name ?? 'N/A'}</TableCell>
                <TableCell>{e.createdAt}</TableCell>
                <TableCell>{e.updatedAt}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface OwnProps {
  open: boolean,
  setOpen: (newValue: boolean) => void,
}
export type UpdatesAndNoticesProps = OwnProps;

const UpdatesAndNotices: React.FC<UpdatesAndNoticesProps> = ({
  open, setOpen,
}) => {
  const classes = useStyles();
  const [recentlyCreated, setRecentlyCreated] = React.useState<{
    isLoading: boolean,
    data: RecentlyReturn,
  }>({
    isLoading: false,
    data: [],
  });
  const [recentlyUpdated, setRecentlyUpdated] = React.useState<{
    isLoading: boolean,
    data: RecentlyReturn,
  }>({
    isLoading: false,
    data: [],
  });

  React.useEffect(() => {
    if (open) {
      setRecentlyCreated({
        isLoading: true,
        data: [],
      });
      setRecentlyUpdated({
        isLoading: true,
        data: [],
      });
      getRecentlyCreatedEvents().then((res) => setRecentlyCreated({
        isLoading: false,
        data: res,
      }));
      getRecentlyUpdatedEvents().then((res) => setRecentlyUpdated({
        isLoading: false,
        data: res,
      }));
    }
  }, [open]);

  const onCloseDialog = () => {
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onClose={onCloseDialog}
      scroll="paper"
      TransitionComponent={FadeTransition}
      fullScreen
    >
      <div id="about-dialog-title" className={classes.dialogTitle}>
        <Typography variant="h6">최근 변경 및 공지</Typography>
        <div className={classes.grow} />
        <Tooltip title="닫기">
          <IconButton onClick={onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      <DialogContent className={classes.dialogContent}>
        {/* <div className={classes.row}>
          <Typography variant="h6">
            공지 사항
          </Typography>
          <Typography>
            공지 내용이 여기 들어간다.
          </Typography>
        </div>
        <Divider /> */}
        <div className={classes.row}>
          <Typography variant="h6">
            확인 중인 개인 비정기 방송 (별도 언급 없을시 니코동 방송)
          </Typography>
          {/* eslint-disable react/jsx-one-expression-per-line, max-len */}
          <ul>
            <li>우치다 아야: <a href="https://www.onsen.ag/program/aya-uchida/" target="_blank" rel="noreferrer">内田彩の今夜一献傾けて (온센)</a></li>
            <li>우치다 아야: <a href="https://ch.nicovideo.jp/phonon" target="_blank" rel="noreferrer">魔法笑女マジカル☆うっちー</a></li>
            <li>Pile: <a href="https://ch.nicovideo.jp/Pile" target="_blank" rel="noreferrer">PileちゃんのチャンネルPile</a></li>
            <li>아이다 리카코: <a href="https://ch.nicovideo.jp/rikakoaida-thetv" target="_blank" rel="noreferrer">逢田梨香子×ザテレビジョン「逢いたい！」</a></li>
            <li>코바야시 아이카: <a href="https://ch.nicovideo.jp/kobayashiaikanohamuriha" target="_blank" rel="noreferrer">小林愛香の「公開リハーサル」</a></li>
            <li>후리하타 아이: <a href="https://ch.nicovideo.jp/furirin" target="_blank" rel="noreferrer">ふりりんは文化</a></li>
            <li>사토 히나타: <a href="https://ch.nicovideo.jp/createvoice" target="_blank" rel="noreferrer">佐藤さん家の日向ちゃん</a></li>
            <li>오오니시 아구리: <a href="https://ch.nicovideo.jp/phonon" target="_blank" rel="noreferrer">大西亜玖璃のあなたにアグリー♥</a></li>
            <li>사가라 마유: <a href="https://ch.nicovideo.jp/ikemayu" target="_blank" rel="noreferrer">相良茉優の『いけません！茉優お嬢さま！』</a></li>
            <li>사가라 마유: <a href="https://ch.nicovideo.jp/mayuchigame" target="_blank" rel="noreferrer">まゆちのおそとゲーム</a></li>
            <li>마에다 카오리: <a href="https://ch.nicovideo.jp/kaorin-kokuo" target="_blank" rel="noreferrer">かおりんがゆく〜王国奮闘日誌〜</a></li>
            <li>쿠보타 미유: <a href="https://ch.nicovideo.jp/meatyou" target="_blank" rel="noreferrer">久保田未夢のNice to MEAT you ＆ YOU</a></li>
            <li>무라카미 나츠미: <a href="https://ch.nicovideo.jp/natyaaaaaaan" target="_blank" rel="noreferrer">村上奈津実のなっチャンネル</a></li>
            <li>쿠스노키 토모리: <a href="https://ch.nicovideo.jp/kusunoki-tomori" target="_blank" rel="noreferrer">楠木ともりを灯せていますか？</a></li>
            <li>타나카 치에미: <a href="https://ch.nicovideo.jp/snack-chiemi" target="_blank" rel="noreferrer">田中ちえ美の「スナックちえみ倶楽部」</a></li>
            <li>타나카 치에미: <a href="https://ch.nicovideo.jp/kochimite" target="_blank" rel="noreferrer">吉田有里と田中ちえ美の “仲間になりたそうにこちらを見ている”</a></li>
            <li>코이즈미 모에카: <a href="https://ch.nicovideo.jp/iwata-koizumi" target="_blank" rel="noreferrer">岩田陽葵・小泉萌香 気の向くままに思うがままにっ！</a></li>
            <li>코이즈미 모에카: <a href="https://ch.nicovideo.jp/moe-note" target="_blank" rel="noreferrer">小泉萌香のもえの～と~moe&#39;s note~</a></li>
          </ul>
          {/* eslint-enable react/jsx-one-expression-per-line, max-len */}
        </div>
        <Divider />
        <div className={classes.row}>
          <Typography variant="h6">
            최근 생성된 일정
          </Typography>
          <UpdatesTable
            isLoading={recentlyCreated.isLoading}
            data={recentlyCreated.data}
          />
        </div>
        <Divider />
        <div className={classes.row}>
          <Typography variant="h6">
            최근 수정된 일정
          </Typography>
          <UpdatesTable
            isLoading={recentlyUpdated.isLoading}
            data={recentlyUpdated.data}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatesAndNotices;
