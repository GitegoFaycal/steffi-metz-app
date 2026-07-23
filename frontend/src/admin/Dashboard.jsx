import { useEffect, useState } from 'react';
import {
  Package,
  CalendarDays,
  Image,
  MessageSquare,
  Users,
  ShoppingBag,
  CreditCard,
  Mail,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { getDashboardStats } from '../api/dashboardApi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    boxes: 0,
    events: 0,
    gallery: 0,
    messages: 0,
    users: 0,
    orders: 0,
    payments: 0,
    newsletters: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();

        setStats({
          boxes: data.boxes || 0,
          events: data.events || 0,
          gallery: data.gallery || 0,
          messages: data.messages || 0,
          users: data.users || 0,
          orders: data.orders || 0,
          payments: data.payments || 0,
          newsletters: data.newsletters || 0,
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-olive/10 rounded-xl p-8">
        <p className="text-stone-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Overview
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Website Management
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          Manage homepage content, boxes, events, gallery images, testimonials,
          customer messages, orders, newsletters, users, and settings from one
          dashboard.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Boxes"
          value={stats.boxes}
          icon={Package}
          description="Gourmet boxes and services"
        />

        <StatCard
          title="Events"
          value={stats.events}
          icon={CalendarDays}
          description="Cooking classes and events"
        />

        <StatCard
          title="Gallery"
          value={stats.gallery}
          icon={Image}
          description="Uploaded website images"
        />

        <StatCard
          title="Messages"
          value={stats.messages}
          icon={MessageSquare}
          description="Contact form messages"
        />

        <StatCard
          title="Users"
          value={stats.users}
          icon={Users}
          description="Admin users"
        />

        <StatCard
          title="Orders"
          value={stats.orders}
          icon={ShoppingBag}
          description="Customer orders"
        />

        <StatCard
          title="Payments"
          value={stats.payments}
          icon={CreditCard}
          description="Recorded payments"
        />

        <StatCard
          title="Newsletters"
          value={stats.newsletters}
          icon={Mail}
          description="Newsletter subscribers"
        />
      </div>
    </div>
  );
}