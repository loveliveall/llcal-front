import React from 'react';
import ReactGA from 'react-ga';
import { Route, Routes, useLocation } from 'react-router-dom';

import Main from '@/pages/Main';
import SearchPage from '@/pages/search';
import ShipDuck from '@/pages/ship-duck';

import GlobalSnackbar from '@/components/GlobalSnackbar';
import EventDeleteDialog from '@/components/dialogs/EventDeleteDialog';
import EventDetailDialog from '@/components/dialogs/EventDetailDialog';
import EventDuplicateDialog from '@/components/dialogs/EventDuplicateDialog';
import EventEditDialog from '@/components/dialogs/EventEditDialog';
import ConcertGroupEditDialog from '@/components/dialogs/ConcertGroupEditDialog';
import ConcertGroupDeleteDialog from '@/components/dialogs/ConcertGroupDeleteDialog';

const App: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/ship-duck" element={<ShipDuck />} />
        <Route path="*" element={<Main />} />
      </Routes>
      <EventDeleteDialog />
      <EventDetailDialog />
      <EventDuplicateDialog />
      <EventEditDialog />
      <ConcertGroupEditDialog />
      <ConcertGroupDeleteDialog />
      <GlobalSnackbar />
    </>
  );
};

export default App;
