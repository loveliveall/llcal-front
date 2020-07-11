import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';

import SearchToolbar, { SearchToolbarProps } from '@/components/app-frame/SearchToolbar';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    flex: '1 1 100%',
    maxWidth: '100%',
  },
  toolbar: theme.mixins.toolbar,
  resultWrapper: {
    margin: 'auto',
    maxWidth: theme.breakpoints.values.md,
  },
}));

const SearchPage: React.FC = () => {
  const classes = useStyles();

  const onSearchTrigger: SearchToolbarProps['onSearchTrigger'] = (text) => {
    console.log(text);
  };

  return (
    <div className={classes.root}>
      <AppBar color="default" elevation={0} position="fixed" className={classes.appBar}>
        <SearchToolbar onSearchTrigger={onSearchTrigger} />
      </AppBar>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.resultWrapper} />
      </main>
    </div>
  );
};

export default SearchPage;
