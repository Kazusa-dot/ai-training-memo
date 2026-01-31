import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Calendar } from './pages/Calendar';
import { RecordWorkout } from './pages/RecordWorkout';
import { Moves } from './pages/Moves';
import { Settings } from './pages/Settings';

const App = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="/record" element={<RecordWorkout />} />
          <Route path="/moves" element={<Moves />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;