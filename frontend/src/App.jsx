import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Boxes from './pages/Boxes';
import Events from './pages/Events';
import Loyalty from './pages/Loyalty';
import Community from './pages/Community';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Newsletter from './pages/Newsletter';

import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import HomepageManager from './admin/HomepageManager';
import AboutManager from './admin/AboutManager';
import BoxesManager from './admin/BoxesManager';
import EventsManager from './admin/EventsManager';
import LoyaltyManager from './admin/LoyaltyManager';
import GalleryManager from './admin/GalleryManager';
import TestimonialsManager from './admin/TestimonialsManager';
import ContactMessages from './admin/ContactMessages';
import OrdersManager from './admin/OrdersManager';
import PaymentsManager from './admin/PaymentsManager';
import NewsletterManager from './admin/NewsletterManager';
import UsersManager from './admin/UsersManager';
import SettingsManager from './admin/SettingsManager';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
      element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      <Route
        path="/boxes"
        element={
          <Layout>
           <Boxes />
          </Layout>        }
      />

      <Route
      path="/events"
        element={
          <Layout>
           <Events />
          </Layout>
       }
      />

      <Route
      path="/loyalty"
        element={
          <Layout>
            <Loyalty />
          </Layout>
        }
      />

      <Route
        path="/community"
        element={
          <Layout>
            <Community />
          </Layout>
        }
      />

      <Route
        path="/checkout"
        element={
          <Layout>
            <Checkout />
          </Layout>
        }
      />

      <Route
        path="/newsletter"
        element={
          <Layout>
            <Newsletter />
          </Layout>
        }
      />

      {/* Public login route */}
      <Route path="/login" element={<Login />} />

      {/* Protected admin routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="homepage" element={<HomepageManager />} />
          <Route path="about" element={<AboutManager />} />
          <Route path="boxes" element={<BoxesManager />} />
          <Route path="events" element={<EventsManager />} />
          <Route path="loyalty" element={<LoyaltyManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
          <Route path="messages" element={<ContactMessages />} />
          <Route path="orders" element={<OrdersManager />} />
          <Route path="payments" element={<PaymentsManager />} />
          <Route path="newsletter" element={<NewsletterManager />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="settings" element={<SettingsManager />} />
        </Route>
      </Route>
    </Routes>
  );
}