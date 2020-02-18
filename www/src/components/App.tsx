import React from 'react';

import Calendar from '@/components/calendar';

import { mockEvents } from './tmp';

const App: React.FC = () => (
  <div style={{ height: '100vh' }}>
    <Calendar events={mockEvents} view="month" currDate={new Date(2020, 1, 19)} />
  </div>
);

export default App;
