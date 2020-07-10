import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from '@/pages/Main';

const App: React.FC = () => (
  <Switch>
    <Route component={Main} />
  </Switch>
);

export default App;
