import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MuiDialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';

import { FadeTransition } from '@/components/common/Transitions';

import { VACheckState, CategoryCheckState, ETCCheckState } from '@/types';
import { voiceActorList, eventCategoryList } from '@/commonData';

function getICSFeedLink(vaFilter: VACheckState, catFilter: CategoryCheckState, etcFilter: ETCCheckState) {
  const excludedVAIds = voiceActorList.filter((va) => !vaFilter[va.id]).map((va) => va.id);
  const vaStr = excludedVAIds.length === 0 ? '' : `va-${excludedVAIds.join('.')}`;
  const excludedCatIDs = eventCategoryList.filter((cat) => !catFilter[cat.id]).map((cat) => cat.id);
  const catStr = excludedCatIDs.length === 0 ? '' : `cat-${excludedCatIDs.join('.')}`;
  const isllStr = (() => {
    if (etcFilter.showLoveLive && etcFilter.showNonLoveLive) return '';
    if (etcFilter.showLoveLive && !etcFilter.showNonLoveLive) return 'isll-0';
    if (!etcFilter.showLoveLive && etcFilter.showNonLoveLive) return 'isll-1';
    return 'isll-0.1';
  })();
  const isrepStr = etcFilter.includeRepeating ? '' : 'isrep-1';
  const filterStr = [vaStr, catStr, isllStr, isrepStr].filter((e) => e !== '').join('!');
  return `http://cal-api.llasfans.net/api/ics${filterStr === '' ? '' : `?${filterStr}`}`;
}

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
const PaddedDiv = styled('div')(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

interface OwnProps {
  open: boolean,
  setOpen: (newValue: boolean) => void,
  vaFilter: VACheckState,
  catFilter: CategoryCheckState,
  etcFilter: ETCCheckState,
}
export type ExportDialogProps = OwnProps;

const ExportDialog: React.FC<ExportDialogProps> = ({
  open, setOpen, vaFilter, catFilter, etcFilter,
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const icsFeedLink = getICSFeedLink(vaFilter, catFilter, etcFilter);

  React.useEffect(() => {
    setIsCopied(false);
  }, [open]);

  const onCloseDialog = () => {
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') onCloseDialog();
      }}
      scroll="paper"
      TransitionComponent={FadeTransition}
      fullWidth
      keepMounted
    >
      <DialogTitle id="export-dialog-title">
        <Typography variant="h6">일정 내보내기</Typography>
        <Spacer />
        <Tooltip title="닫기">
          <IconButton onClick={onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          현재 필터 설정으로 캘린더를 내보냅니다. 사용하는 캘린더 앱에서 &#39;URL로 추가&#39;등의 기능에 아래 링크를 붙여 넣으세요.
        </Typography>
        <PaddedDiv>
          <Input
            value={icsFeedLink}
            onFocus={(ev) => ev.target.select()} // Select whole value on focus
            readOnly
            fullWidth
          />
        </PaddedDiv>
        <PaddedDiv
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CopyToClipboard text={icsFeedLink} onCopy={() => setIsCopied(true)}>
            <Button variant="outlined">{isCopied ? '복사됨!' : '링크 복사하기'}</Button>
          </CopyToClipboard>
        </PaddedDiv>
        <Typography variant="body2">
          이 링크는 항상 최신 DB 상태를 반영합니다. 다만, 캘린더 앱의 설정에 따라 갱신 주기가 길어질 수 있습니다.
        </Typography>
        <Typography variant="body2">
          예를 들어, 구글 캘린더의 경우 정보 갱신에 최대 24시간이 소요될 수 있습니다.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
