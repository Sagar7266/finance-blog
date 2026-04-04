import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { postApi, categoryApi } from '../utils/api';
import PostCard from '../components/blog/PostCard';

export default function BlogListPage() {
  const [params, setParams] = useSearchParams();
  const page = parseInt(params.get('page') || '0');
  const sort = params.get('sort') || 'latest';

  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'all', page, sort],
    queryFn: () => postApi.getAll({ page, size: 9, sort }).then(r => r.data),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(r => r.data),
  });

  const posts = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const setPage = (p) => setParams({ page: p, sort });
  const setSort = (s) => setParams({ page: 0, sort: s });

  return (
    <>
      <Helmet>
        <title>All Articles - FinanceWise India</title>
        <meta name="description" content="Browse all finance articles — investing, loans, tax, credit cards, and more for Indian readers." />
      </Helmet>

      <div className="page-container py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">All Articles</h1>
          <p className="text-gray-500">Expert financial insights for Indian investors</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex items-center gap-2 mb-6">
              {[['latest','🕐 Latest'],['popular','🔥 Popular']].map(([val, label]) => (
                <button key={val} onClick={() => setSort(val)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    sort === val ? 'bg-primary-600 text-white' : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-700 hover:border-primary-300'
                  }`}>
                  {label}
                </button>
              ))}
              {data && <span className="text-sm text-gray-400 ml-auto">{data.totalElements} articles</span>}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="skeleton h-48 rounded-t-2xl rounded-b-none" />
                    <div className="p-5 space-y-3">
                      <div className="skeleton h-3 w-20 rounded" />
                      <div className="skeleton h-4 rounded" />
                      <div className="skeleton h-4 w-3/4 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => <PostCard key={post.id} post={post} featured />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button onClick={() => setPage(page - 1)} disabled={page === 0}
                  className="btn-secondary disabled:opacity-40 text-sm">← Prev</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                      i === page ? 'bg-primary-600 text-white' : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-700 hover:border-primary-300'
                    }`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1}
                  className="btn-secondary disabled:opacity-40 text-sm">Next →</button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-6 flex-shrink-0">
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">📂 Categories</h3>
              <div className="space-y-1">
                {categories?.map(cat => (
                  <Link key={cat.id} to={`/category/${cat.slug}`}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span>{cat.icon}</span>{cat.name}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-dark-700 px-2 py-0.5 rounded-full">{cat.postCount}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="card p-5 hero-gradient text-white">
              <h3 className="font-bold mb-2">📬 Newsletter</h3>
              <p className="text-sm text-green-100 mb-4">Get weekly finance tips in your inbox</p>
              <input placeholder="your@email.com" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-green-200 text-sm mb-2 focus:outline-none focus:bg-white/20" />
              <button className="w-full py-2 bg-white text-primary-700 font-bold rounded-lg text-sm hover:bg-green-50 transition-colors">
                Subscribe Free →
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
