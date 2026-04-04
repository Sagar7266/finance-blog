import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { label: 'Dashboard', path: '/admin', icon: '📊', exact: true },
  { label: 'Posts',     path: '/admin/posts', icon: '📝' },
  { label: 'Categories',path: '/admin/categories', icon: '🗂️' },
  { label: 'Comments',  path: '/admin/comments', icon: '💬' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-950 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-60'} bg-dark-900 flex flex-col transition-all duration-300 flex-shrink-0`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-dark-700">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">₹</span>
              </div>
              <span className="text-white font-bold text-sm leading-tight">FinanceWise<br/><span className="text-primary-400 text-[10px] font-normal tracking-widest">ADMIN</span></span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            className={`ml-auto text-gray-400 hover:text-white transition-colors ${collapsed ? 'mx-auto' : ''}`}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium
                ${isActive(item)
                  ? 'bg-primary-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'}`}>
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="p-3 border-t border-dark-700">
          <div className={`flex items-center gap-3 px-2 py-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {user?.fullName?.[0] || user?.username?.[0] || 'A'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{user?.fullName || user?.username}</p>
                <p className="text-gray-400 text-[10px]">{user?.role}</p>
              </div>
            )}
          </div>
          <button onClick={handleLogout}
            className={`mt-1 flex items-center gap-2 w-full px-3 py-2 rounded-xl text-red-400 hover:bg-red-900/20 text-xs font-medium transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <span>🚪</span>
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-dark-800 border-b border-gray-100 dark:border-dark-700 flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {NAV.find(n => isActive(n))?.label || 'Admin Panel'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/blog" target="_blank"
              className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 flex items-center gap-1">
              <span>🌐</span> View Site
            </Link>
            <Link to="/admin/posts/new" className="btn-primary text-xs">
              + New Post
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
