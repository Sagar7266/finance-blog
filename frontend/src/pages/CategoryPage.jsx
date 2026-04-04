import React from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { postApi, categoryApi } from '../utils/api';
import PostCard from '../components/blog/PostCard';

export function CategoryPage() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const page = parseInt(params.get('page') || '0');

  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryApi.getBySlug(slug).then(r => r.data),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'category', slug, page],
    queryFn: () => postApi.getByCategory(slug, { page, size: 9 }).then(r => r.data),
  });

  const posts = data?.content || [];
  const totalPages = data?.totalPages || 1;

  return (
    <>
      <Helmet>
        <title>{category?.name} Articles - FinanceWise India</title>
        <meta name="description" content={category?.description} />
      </Helmet>

      <div className="page-container py-10">
        {/* Header */}
        {category && (
          <div className="mb-8 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
              style={{ backgroundColor: category.color + '20' }}>
              {category.icon}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{category.name}</h1>
              <p className="text-gray-500 mt-1">{category.description}</p>
              <p className="text-xs text-gray-400 mt-1">{category.postCount} articles</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">{category?.icon || '📰'}</div>
            <p className="text-gray-500">No articles in this category yet.</p>
            <Link to="/blog" className="btn-primary mt-4 inline-flex">Browse All Articles</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => <PostCard key={post.id} post={post} featured />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button onClick={() => setParams({ page: page - 1 })} disabled={page === 0} className="btn-secondary">← Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setParams({ page: i })}
                className={`w-9 h-9 rounded-xl text-sm font-semibold ${i === page ? 'bg-primary-600 text-white' : 'btn-secondary'}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setParams({ page: page + 1 })} disabled={page >= totalPages - 1} className="btn-secondary">Next →</button>
          </div>
        )}
      </div>
    </>
  );
}

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => postApi.search({ q, page: 0, size: 12 }).then(r => r.data),
    enabled: !!q,
  });

  const posts = data?.content || [];

  return (
    <>
      <Helmet>
        <title>Search: {q} - FinanceWise India</title>
      </Helmet>
      <div className="page-container py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Search results for "<span className="text-primary-600">{q}</span>"
          </h1>
          {data && <p className="text-gray-400 mt-1">{data.totalElements} results found</p>}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🔍</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No results found</h2>
            <p className="text-gray-500">Try different keywords or browse all articles.</p>
            <Link to="/blog" className="btn-primary mt-4 inline-flex">Browse All Articles</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => <PostCard key={post.id} post={post} featured />)}
          </div>
        )}
      </div>
    </>
  );
}

export function NotFoundPage() {
  return (
    <div className="page-container py-24 text-center">
      <div className="text-8xl mb-6">💸</div>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">404 - Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Looks like this page went bankrupt. Let's get your finances back on track.
      </p>
      <div className="flex justify-center gap-3">
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/blog" className="btn-secondary">Browse Articles</Link>
      </div>
    </div>
  );
}

export default CategoryPage;
