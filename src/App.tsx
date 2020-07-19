import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from '@/pages/Main';
import SearchPage from '@/pages/search';
import ShipDuck from '@/pages/ship-duck';

import EventDeleteDialog from '@/components/dialogs/EventDeleteDialog';
import EventDetailDialog from '@/components/dialogs/EventDetailDialog';
import EventEditDialog from '@/components/dialogs/EventEditDialog';

const App: React.FC = () => (
  <>
    <Switch>
      <Route path="/search" component={SearchPage} />
      <Route exact path="/ship-duck" component={ShipDuck} />
      <Route component={Main} />
    </Switch>
    <EventDeleteDialog />
    <EventDetailDialog />
    <EventEditDialog />
  </>
);

export default App;
