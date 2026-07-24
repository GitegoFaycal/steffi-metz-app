import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Info,
  Package,
  CalendarDays,
  BadgePercent,
  Image,
  MessageSquareQuote,
  Mail,
  ShoppingBag,
  CreditCard,
  Newspaper,
  Users,
  Settings,
  ScrollText,
} from 'lucide-react';

const menuItems = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Homepage',
    path: '/admin/homepage',
    icon: Home,
  },
  {
  label: 'Marquee',
  path: '/admin/marquee',
  icon: ScrollText,
},
  {
    label: 'About',
    path: '/admin/about',
    icon: Info,
  },
  {
    label: 'Boxes',
    path: '/admin/boxes',
    icon: Package,
  },
  {
    label: 'Events',
    path: '/admin/events',
    icon: CalendarDays,
  },
  {
    label: 'Loyalty',
    path: '/admin/loyalty',
    icon: BadgePercent,
  },
  {
    label: 'Gallery',
    path: '/admin/gallery',
    icon: Image,
  },
  {
    label: 'Testimonials',
    path: '/admin/testimonials',
    icon: MessageSquareQuote,
  },
  {
    label: 'Messages',
    path: '/admin/messages',
    icon: Mail,
  },
  {
    label: 'Orders',
    path: '/admin/orders',
    icon: ShoppingBag,
  },
  {
    label: 'Payments',
    path: '/admin/payments',
    icon: CreditCard,
  },
  {
    label: 'Newsletter',
    path: '/admin/newsletter',
    icon: Newspaper,
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: Users,
  },
  {
    label: 'Settings',
    path: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-olive-dark text-white z-50 hidden lg:flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <div>
          <h1 className="font-serif text-2xl">Steffi Metz</h1>
          <p className="text-xs text-white/40 uppercase tracking-widest">
            Admin Panel
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-bordeaux text-white'
                    : 'text-white/65 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/40 leading-5">
          Manage homepage, boxes, events, loyalty, gallery, orders, users, and
          website settings.
        </p>
      </div>
    </aside>
  );
}