import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { commentApi } from '../../utils/api';
import { formatDateRelative } from '../../utils/helpers';

export default function AdminComments() {
  const [page, setPage] = useState(0);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-comments', page],
    queryFn: () => commentApi.getAllAdmin({ page, size: 20 }).then(r => r.data),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status }) => commentApi.updateStatus(id, status),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries(['admin-comments']); },
    onError: () => toast.error('Failed to update'),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => commentApi.delete(id),
    onSuccess: () => { toast.success('Comment deleted'); qc.invalidateQueries(['admin-comments']); },
    onError: () => toast.error('Failed to delete'),
  });

  const comments = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const statusColor = {
    APPROVED: 'badge-green',
    PENDING:  'badge-gold',
    REJECTED: 'badge-red',
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Comments</h2>
        <p className="text-sm text-gray-500">{data?.totalElements || 0} total comments</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-900">
              <tr>
                {['Author','Comment','Post','Status','Date','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
              {isLoading
                ? [...Array(8)].map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td></tr>
                  ))
                : comments.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                      <td className="px-4 py-3 min-w-[120px]">
                        <p className="font-semibold text-gray-900 dark:text-white text-xs">{c.authorName}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5">{c.authorEmail}</p>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-gray-700 dark:text-gray-300 text-xs line-clamp-2">{c.content}</p>
                      </td>
                      <td className="px-4 py-3 max-w-[140px]">
                        <p className="text-gray-500 text-xs line-clamp-1">{c.postTitle}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-[10px] ${statusColor[c.status]}`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {formatDateRelative(c.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1 min-w-[80px]">
                          {c.status !== 'APPROVED' && (
                            <button
                              onClick={() => statusMut.mutate({ id: c.id, status: 'APPROVED' })}
                              className="text-[10px] text-green-600 hover:underline text-left">
                              ✅ Approve
                            </button>
                          )}
                          {c.status !== 'REJECTED' && (
                            <button
                              onClick={() => statusMut.mutate({ id: c.id, status: 'REJECTED' })}
                              className="text-[10px] text-amber-600 hover:underline text-left">
                              🚫 Reject
                            </button>
                          )}
                          <button
                            onClick={() => window.confirm('Delete this comment?') && deleteMut.mutate(c.id)}
                            className="text-[10px] text-red-500 hover:underline text-left">
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100 dark:border-dark-700">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 0} className="btn-secondary text-xs disabled:opacity-40">← Prev</button>
            <span className="flex items-center text-sm text-gray-500 px-2">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="btn-secondary text-xs disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
