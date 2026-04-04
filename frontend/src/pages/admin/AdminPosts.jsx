import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { postApi } from '../../utils/api';
import { formatDate } from '../../utils/helpers';

export default function AdminPosts() {
  const [page, setPage] = useState(0);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts', page],
    queryFn: () => postApi.getAllAdmin({ page, size: 10 }).then(r => r.data),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => postApi.delete(id),
    onSuccess: () => { toast.success('Post deleted'); qc.invalidateQueries(['admin-posts']); },
    onError: () => toast.error('Failed to delete post'),
  });

  const handleDelete = (post) => {
    if (window.confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      deleteMut.mutate(post.id);
    }
  };

  const posts = data?.content || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Posts</h2>
          <p className="text-sm text-gray-500">{data?.totalElements || 0} total posts</p>
        </div>
        <Link to="/admin/posts/new" className="btn-primary">+ New Post</Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-900">
              <tr>
                {['Title','Category','Status','Views','Date','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td></tr>
                  ))
                : posts.map(post => (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{post.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{post.slug}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{post.category?.name || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`badge text-[10px] ${
                          post.status === 'PUBLISHED' ? 'badge-green' :
                          post.status === 'DRAFT' ? 'badge-gold' : 'badge-red'
                        }`}>{post.status}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{post.viewCount?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(post.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link to={`/blog/${post.slug}`} target="_blank"
                            className="text-xs text-gray-400 hover:text-primary-600 transition-colors px-2 py-1 rounded hover:bg-primary-50 dark:hover:bg-primary-900/20">
                            View
                          </Link>
                          <Link to={`/admin/posts/edit/${post.id}`}
                            className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            Edit
                          </Link>
                          <button onClick={() => handleDelete(post)}
                            className="text-xs text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100 dark:border-dark-700">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 0} className="btn-secondary text-xs disabled:opacity-40">← Prev</button>
            <span className="flex items-center text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="btn-secondary text-xs disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
