import React from 'react';

import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import MuiDialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';

import { FadeTransition } from '@/components/common/Transitions';

import { eventCategoryList } from '@/commonData';
import { getDateString, getObjWithProp } from '@/utils';
import { getRecentlyCreatedEvents, getRecentlyUpdatedEvents, RecentlyReturn } from '@/api';

const DialogTitle = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  alignItems: 'center',
}));
const DialogContent = styled(MuiDialogContent)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
}));
const Spacer = styled('div')`
  flex-grow: 1;
`;
const Row = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
}));
const TableHeadCell = styled(TableCell)`
  font-weight: bolder;
`;

interface UpdatesTableProps {
  isLoading: boolean,
  data: RecentlyReturn,
}
const UpdatesTable: React.FC<UpdatesTableProps> = ({
  isLoading, data,
}) => {
  if (isLoading) return <CircularProgress />;

  return (
    <TableContainer>
      <Table style={{ whiteSpace: 'nowrap' }}>
        <TableHead>
          <TableRow>
            <TableHeadCell>제목</TableHeadCell>
            <TableHeadCell>개요</TableHeadCell>
            <TableHeadCell>첫 일정 시작</TableHeadCell>
            <TableHeadCell>분류</TableHeadCell>
            <TableHeadCell>생성일</TableHeadCell>
            <TableHeadCell>수정일</TableHeadCell>
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
      <DialogTitle id="about-dialog-title">
        <Typography variant="h6">최근 변경 및 공지</Typography>
        <Spacer />
        <Tooltip title="닫기" disableInteractive>
          <IconButton onClick={onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        {/* <Row>
          <Typography variant="h6">
            공지 사항
          </Typography>
          <Typography>
            공지 내용이 여기 들어간다.
          </Typography>
        </Row>
        <Divider /> */}
        <Row>
          <Typography variant="h6">
            확인 중인 개인 비정기 방송
          </Typography>
          {/* eslint-disable react/jsx-one-expression-per-line, max-len */}
          <MuiLink
            href="https://codemore.notion.site/9611f798f3594fec89425f4ac3ff78d6?v=ce49be2338da4936bc740ec110ffadc9"
            target="_blank"
            rel="noopener noreferrer"
          >
            여기서 확인하실 수 있습니다.
          </MuiLink>
          {/* eslint-enable react/jsx-one-expression-per-line, max-len */}
        </Row>
        <Divider />
        <Row>
          <Typography variant="h6">
            최근 생성된 일정
          </Typography>
          <UpdatesTable
            isLoading={recentlyCreated.isLoading}
            data={recentlyCreated.data}
          />
        </Row>
        <Divider />
        <Row>
          <Typography variant="h6">
            최근 수정된 일정
          </Typography>
          <UpdatesTable
            isLoading={recentlyUpdated.isLoading}
            data={recentlyUpdated.data}
          />
        </Row>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatesAndNotices;
