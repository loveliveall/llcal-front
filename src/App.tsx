import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from '@/pages/Main';
import SearchPage from '@/pages/search';
import ShipDuck from '@/pages/ship-duck';

import EventDetailDialog from '@/components/dialogs/EventDetailDialog';

const App: React.FC = () => (
  <>
    <Switch>
      <Route path="/search" component={SearchPage} />
      <Route exact path="/ship-duck" component={ShipDuck} />
      <Route component={Main} />
    </Switch>
    <EventDetailDialog />
  </>
);

export default App;
