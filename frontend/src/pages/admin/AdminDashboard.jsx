import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, postApi } from '../../utils/api';
import { formatDate } from '../../utils/helpers';

function StatCard({ icon, label, value, color, to }) {
  const inner = (
    <div className={`card p-5 flex items-center gap-4 hover:shadow-md transition-shadow ${to ? 'cursor-pointer' : ''}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value ?? '—'}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats().then(r => r.data),
  });

  const { data: latestPosts } = useQuery({
    queryKey: ['admin-posts-recent'],
    queryFn: () => postApi.getAllAdmin({ page: 0, size: 5 }).then(r => r.data),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Dashboard Overview</h2>
        <p className="text-sm text-gray-500">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📝" label="Total Posts"      value={stats?.totalPosts}       color="bg-blue-100 dark:bg-blue-900/30"    to="/admin/posts" />
        <StatCard icon="✅" label="Published"         value={stats?.publishedPosts}    color="bg-green-100 dark:bg-green-900/30"  to="/admin/posts" />
        <StatCard icon="📋" label="Draft Posts"       value={stats?.draftPosts}        color="bg-amber-100 dark:bg-amber-900/30"  to="/admin/posts" />
        <StatCard icon="💬" label="Pending Comments"  value={stats?.pendingComments}   color="bg-red-100 dark:bg-red-900/30"      to="/admin/comments" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon="🗂️" label="Categories"       value={stats?.totalCategories}   color="bg-purple-100 dark:bg-purple-900/30" to="/admin/categories" />
        <StatCard icon="💬" label="Total Comments"    value={stats?.totalComments}     color="bg-pink-100 dark:bg-pink-900/30"    to="/admin/comments" />
        <StatCard icon="👥" label="Users"             value={stats?.totalUsers}        color="bg-cyan-100 dark:bg-cyan-900/30" />
      </div>

      {/* Quick actions */}
      <div className="card p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/posts/new" className="btn-primary">+ New Post</Link>
          <Link to="/admin/categories" className="btn-secondary">Manage Categories</Link>
          <Link to="/admin/comments" className="btn-secondary">Review Comments</Link>
          <Link to="/blog" target="_blank" className="btn-secondary">View Site 🔗</Link>
        </div>
      </div>

      {/* Recent posts table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-700">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Posts</h3>
          <Link to="/admin/posts" className="text-sm text-primary-600 hover:underline font-semibold">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-900">
              <tr>
                {['Title','Category','Status','Date','Views'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
              {latestPosts?.content?.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                  <td className="px-5 py-3">
                    <Link to={`/admin/posts/edit/${post.id}`}
                      className="font-medium text-gray-900 dark:text-white hover:text-primary-600 line-clamp-1 max-w-xs block">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{post.category?.name || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`badge text-[10px] ${
                      post.status === 'PUBLISHED' ? 'badge-green' :
                      post.status === 'DRAFT' ? 'badge-gold' : 'badge-red'
                    }`}>{post.status}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{formatDate(post.createdAt)}</td>
                  <td className="px-5 py-3 text-gray-500">{post.viewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
