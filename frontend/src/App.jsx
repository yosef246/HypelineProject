import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

import Home from './pages/public/Home';
import Events from './pages/public/Events';
import EventDetails from './pages/public/EventDetails';
import GoRedirect from './pages/public/GoRedirect';

import Login from './pages/auth/Login';
import RegisterChoice from './pages/auth/RegisterChoice';
import RegisterProducer from './pages/auth/RegisterProducer';
import RegisterMarketer from './pages/auth/RegisterMarketer';
import RegisterCustomer from './pages/auth/RegisterCustomer';

import ProducerDashboard from './pages/producer/Dashboard';
import CreateEvent from './pages/producer/CreateEvent';
import MyEvents from './pages/producer/MyEvents';
import ProducerCampaigns from './pages/producer/Campaigns';
import ProducerReports from './pages/producer/Reports';

import MarketerDashboard from './pages/marketer/Dashboard';
import AvailableEvents from './pages/marketer/AvailableEvents';
import MyLinks from './pages/marketer/MyLinks';
import Earnings from './pages/marketer/Earnings';
import Profile from './pages/shared/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminPayouts from './pages/admin/Payouts';

import NotFound from './pages/public/NotFound';

const RequireRole = ({ roles, children }) => {
  const { user, hydrated } = useAuthStore();
  if (!hydrated) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  useEffect(() => { hydrate(); }, [hydrate]);

  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterChoice />} />
        <Route path="/register/producer" element={<RegisterProducer />} />
        <Route path="/register/marketer" element={<RegisterMarketer />} />
        <Route path="/register/customer" element={<RegisterCustomer />} />
      </Route>

      {/* Affiliate redirect */}
      <Route path="/go/:slug" element={<GoRedirect />} />

      {/* Producer */}
      <Route element={<RequireRole roles={['producer', 'admin']}><DashboardLayout area="producer" /></RequireRole>}>
        <Route path="/producer" element={<ProducerDashboard />} />
        <Route path="/producer/events" element={<MyEvents />} />
        <Route path="/producer/events/new" element={<CreateEvent />} />
        <Route path="/producer/campaigns" element={<ProducerCampaigns />} />
        <Route path="/producer/reports" element={<ProducerReports />} />
        <Route path="/producer/profile" element={<Profile />} />
      </Route>

      {/* Marketer */}
      <Route element={<RequireRole roles={['marketer', 'admin']}><DashboardLayout area="marketer" /></RequireRole>}>
        <Route path="/marketer" element={<MarketerDashboard />} />
        <Route path="/marketer/available" element={<AvailableEvents />} />
        <Route path="/marketer/links" element={<MyLinks />} />
        <Route path="/marketer/earnings" element={<Earnings />} />
        <Route path="/marketer/profile" element={<Profile />} />
      </Route>

      {/* Admin */}
      <Route element={<RequireRole roles={['admin']}><DashboardLayout area="admin" /></RequireRole>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/payouts" element={<AdminPayouts />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
