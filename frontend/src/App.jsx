import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Home from './pages/Home';
import Boxes from './pages/Boxes';
import Events from './pages/Events';
import Loyalty from './pages/Loyalty';
import Community from './pages/Community';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boxes" element={<Boxes />} />
        <Route path="/events" element={<Events />} />
        <Route path="/loyalty" element={<Loyalty />} />
        <Route path="/community" element={<Community />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Layout>
  );
}