import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';

import { FadeTransition } from '@/components/common/Transitions';

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
  paragraph: {
    padding: theme.spacing(0.25),
    wordBreak: 'keep-all',
  },
  grow: {
    flexGrow: 1,
  },
}));

interface OwnProps {
  open: boolean,
  setOpen: (newValue: boolean) => void,
}
export type AboutDialogProps = OwnProps;

const AboutDialog: React.FC<AboutDialogProps> = ({
  open, setOpen,
}) => {
  const classes = useStyles();

  const onCloseDialog = () => {
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onClose={onCloseDialog}
      scroll="paper"
      TransitionComponent={FadeTransition}
      fullWidth
    >
      <div id="about-dialog-title" className={classes.dialogTitle}>
        <Typography variant="h6">LLCalendar에 관하여</Typography>
        <div className={classes.grow} />
        <Tooltip title="닫기">
          <IconButton onClick={onCloseDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      <DialogContent className={classes.dialogContent}>
        <Typography className={classes.paragraph}>
          이 캘린더는 러브 라이브! 시리즈의 성우 및 캐릭터와 관련된 일정을 정리하는 캘린더입니다.
        </Typography>
        <Typography className={classes.paragraph}>
          수동으로 관리되고 있기 때문에 정보가 부족하거나 변경된 정보가 제대로 반영되지 않을 수 있습니다.
        </Typography>
        <Typography className={classes.paragraph}>
          추가나 수정을 요청하기 위해서는 &#39;일정 추가 요청 보내기&#39; 기능을 이용해주세요
        </Typography>
        <Typography className={classes.paragraph} variant="body2" color="textSecondary">
          현재 버전의 &#39;일정 추가 요청 보내기&#39;는 베타입니다. 개선이 예정되어 있습니다.
        </Typography>
        <Typography className={classes.paragraph}>
          캘린더에 대한 건의 사항은&nbsp;
          <a href="https://github.com/loveliveall/llcal-front/issues" target="_blank" rel="noreferrer">
            GitHub 이슈 페이지
          </a>
          &nbsp;혹은 lovelivefam@gmail.com 이메일을 이용해주세요.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;
