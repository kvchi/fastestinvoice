import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';
import ComposerPage from './pages/ComposerPage.jsx';
import CustomersPage from './pages/CustomersPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DocumentDetailPage from './pages/DocumentDetailPage.jsx';
import DocumentsPage from './pages/DocumentsPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PlansPage from './pages/PlansPage.jsx';
import RecipientPage from './pages/RecipientPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="recipient/:id" element={<RecipientPage />} />
      <Route path="app" element={<Layout />}>
        <Route index element={<Navigate replace to="dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="invoices" element={<DocumentsPage type="Invoice" />} />
        <Route path="quotes" element={<DocumentsPage type="Quote" />} />
        <Route path="receipts" element={<DocumentsPage type="Receipt" />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="plans" element={<PlansPage />} />
        <Route path="new" element={<ComposerPage />} />
        <Route path="documents/:id" element={<DocumentDetailPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
