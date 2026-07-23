import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAdminUser, logoutAdmin } from '../api/authApi';

export default function AdminTopbar({ title = 'Dashboard', onMenuClick }) {
  const navigate = useNavigate();
  const admin = getAdminUser();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-olive/10">
      <div className="h-20 px-5 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden text-olive-dark"
          >
            <Menu size={26} />
          </button>

          <div>
            <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
              Admin
            </p>
            <h2 className="font-serif text-3xl text-olive-dark">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm text-olive-dark font-medium">
              {admin?.name || 'Admin User'}
            </p>
            <p className="text-xs text-stone-500">
              {admin?.email || 'admin@steffi.com'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-bordeaux text-white px-4 py-2 rounded text-xs uppercase tracking-wider hover:bg-[#b03358] transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}