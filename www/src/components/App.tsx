import React from 'react';

import Calendar from '@/components/calendar';

const mockEvents = [
  {
    title: 'Test Event 1',
    allDay: false,
    startTime: new Date(),
    endTime: new Date(2020, 2, 1),
    colorCode: '#ffffff',
  },
  {
    title: 'Test Event 2',
    allDay: true,
    startTime: new Date(),
    endTime: new Date(2020, 2, 1),
    colorCode: '#ffffff',
  },
  {
    title: 'Test Event 3',
    allDay: false,
    startTime: new Date(2020, 2, 1, 14, 0),
    endTime: new Date(2020, 2, 1, 15, 0),
    colorCode: '#000000',
  },
  {
    title: 'Out of range event',
    allDay: false,
    startTime: new Date(2020, 0, 1, 1, 0),
    endTime: new Date(2020, 0, 3, 1, 0),
    colorCode: '#ffffff',
  },
];

const App: React.FC = () => (
  <div style={{ height: '100vh' }}>
    <Calendar events={mockEvents} view="month" currDate={new Date()} />
  </div>
);

export default App;
