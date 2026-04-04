import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { postApi, categoryApi } from '../utils/api';
import PostCard from '../components/blog/PostCard';
import { formatDate } from '../utils/helpers';
import { useState } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState('');

  const { data: featuredData } = useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: () => postApi.getFeatured({ page: 0, size: 4 }).then(r => r.data),
  });

  const { data: latestData } = useQuery({
    queryKey: ['posts', 'latest'],
    queryFn: () => postApi.getAll({ page: 0, size: 6 }).then(r => r.data),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(r => r.data),
  });

  const featured = featuredData?.content || [];
  const latest = latestData?.content || [];
  const hero = featured[0];
  const subFeatured = featured.slice(1, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`);
  };

  return (
    <>
      <Helmet>
        <title>FinanceWise India - Smart Money, Better Life</title>
        <meta name="description" content="Expert financial guidance for Indian investors. SIP, mutual funds, tax saving, home loans, credit cards, and more." />
      </Helmet>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}>
        </div>

        <div className="page-container relative py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft"></span>
              Trusted by 50,000+ Indian investors
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Smart Money,<br />
              <span className="text-primary-300">Better Life</span>
            </h1>
            <p className="text-lg text-green-100 leading-relaxed mb-8 max-w-xl mx-auto">
              Expert financial guidance for Indian investors — SIP, tax saving, home loans, credit cards, and more.
            </p>
            <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto">
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search articles, topics, funds..."
                className="flex-1 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-green-200 focus:outline-none focus:bg-white/20 text-sm"
              />
              <button type="submit" className="px-6 py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-green-50 transition-colors text-sm shadow-lg">
                Search
              </button>
            </form>
            <div className="flex flex-wrap justify-center gap-2 mt-5 text-sm">
              {['SIP Returns', 'ITR Filing', 'Best Credit Cards', 'EMI Calculator', 'Home Loan'].map(tag => (
                <button key={tag} onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-xs">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────── */}
      <section className="page-container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-heading">Browse Topics</h2>
          <Link to="/blog" className="text-sm text-primary-600 font-semibold hover:underline">All Articles →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories?.map(cat => (
            <Link key={cat.id} to={`/category/${cat.slug}`}
              className="card-hover p-4 text-center group">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{cat.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{cat.postCount} articles</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Posts ────────────────────────── */}
      {featured.length > 0 && (
        <section className="page-container pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-heading">Featured Articles</h2>
            <Link to="/blog?sort=popular" className="text-sm text-primary-600 font-semibold hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hero post */}
            {hero && (
              <Link to={`/blog/${hero.slug}`} className="group lg:col-span-2 card-hover overflow-hidden block">
                <div className="relative h-72 overflow-hidden rounded-t-2xl">
                  {hero.featuredImage ? (
                    <img src={hero.featuredImage} alt={hero.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full hero-gradient flex items-center justify-center">
                      <span className="text-6xl opacity-40">{hero.category?.icon}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    {hero.category && (
                      <span className="badge bg-primary-500 text-white text-[11px] mb-2">
                        {hero.category.icon} {hero.category.name}
                      </span>
                    )}
                    <h2 className="text-xl font-bold text-white line-clamp-2 leading-snug mb-2">
                      {hero.title}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-gray-300">
                      <span>📅 {formatDate(hero.publishedAt)}</span>
                      <span>⏱ {hero.readTime} min read</span>
                      <span>👁 {hero.viewCount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}
            {/* Sub-featured */}
            <div className="flex flex-col gap-4">
              {subFeatured.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Posts ──────────────────────────── */}
      <section className="bg-gray-50 dark:bg-dark-900/50 py-12">
        <div className="page-container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-heading">Latest Articles</h2>
            <Link to="/blog" className="text-sm text-primary-600 font-semibold hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map(post => <PostCard key={post.id} post={post} featured />)}
          </div>
        </div>
      </section>

      {/* ── Finance Tools CTA ─────────────────────── */}
      <section className="page-container py-16">
        <div className="rounded-3xl hero-gradient p-10 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold mb-3">Free Finance Calculators</h2>
            <p className="text-green-100 mb-8 max-w-md mx-auto">
              Calculate your EMI, plan your SIP, estimate taxes — all in one place.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: '🏠 EMI Calculator', path: '/tools/emi' },
                { label: '📈 SIP Calculator', path: '/tools/sip' },
                { label: '📋 Tax Calculator', path: '/tools/tax' },
                { label: '🏦 FD Calculator', path: '/tools/fd' },
              ].map(t => (
                <Link key={t.path} to={t.path}
                  className="px-5 py-2.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-green-50 transition-colors text-sm shadow">
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
