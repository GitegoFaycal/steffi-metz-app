import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linen">
      <AdminSidebar />

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
          />

          <div className="relative z-[80] w-64 h-full bg-olive-dark">
            <AdminSidebar />
          </div>
        </div>
      )}

      <div className="lg:ml-64 min-h-screen">
        <AdminTopbar
          title="Admin Dashboard"
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}