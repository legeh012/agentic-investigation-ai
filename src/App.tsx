import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NewInvestigation from './pages/NewInvestigation';
import InvestigationDetail from './pages/InvestigationDetail';
import RunInvestigation from './pages/RunInvestigation';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/new" element={<NewInvestigation />} />
      <Route path="/investigation/:id" element={<InvestigationDetail />} />
      <Route path="/investigation/:id/run" element={<RunInvestigation />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
