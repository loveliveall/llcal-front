import React from 'react';
import ReactGA from 'react-ga';
import { Route, Switch, useHistory } from 'react-router-dom';

import Main from '@/pages/Main';
import SearchPage from '@/pages/search';
import ShipDuck from '@/pages/ship-duck';

import GlobalSnackbar from '@/components/GlobalSnackbar';
import EventDeleteDialog from '@/components/dialogs/EventDeleteDialog';
import EventDetailDialog from '@/components/dialogs/EventDetailDialog';
import EventDuplicateDialog from '@/components/dialogs/EventDuplicateDialog';
import EventEditDialog from '@/components/dialogs/EventEditDialog';

const App: React.FC = () => {
  const history = useHistory();

  React.useEffect(() => history.listen((location) => {
    ReactGA.pageview(location.pathname + location.search);
  }), [history]);
  return (
    <>
      <Switch>
        <Route path="/search" component={SearchPage} />
        <Route exact path="/ship-duck" component={ShipDuck} />
        <Route component={Main} />
      </Switch>
      <EventDeleteDialog />
      <EventDetailDialog />
      <EventDuplicateDialog />
      <EventEditDialog />
      <GlobalSnackbar />
    </>
  );
};

export default App;
