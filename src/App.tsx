import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from '@/pages/Main';
import SearchPage from '@/pages/search';

const App: React.FC = () => (
  <Switch>
    <Route path="/search" component={SearchPage} />
    <Route component={Main} />
  </Switch>
);

export default App;
