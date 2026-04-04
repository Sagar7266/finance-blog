import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatNumber } from '../../utils/helpers';

export default function PostCard({ post, featured = false }) {
  const categoryColors = {
    'investing':       'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    'loans':           'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    'tax':             'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    'credit-cards':    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    'insurance':       'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
    'personal-finance':'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400',
  };
  const catClass = categoryColors[post.category?.slug] || 'bg-gray-100 text-gray-700';

  if (featured) {
    return (
      <Link to={`/blog/${post.slug}`} className="group block card-hover overflow-hidden">
        <div className="relative h-52 overflow-hidden rounded-t-2xl">
          {post.featuredImage ? (
            <img src={post.featuredImage} alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full hero-gradient flex items-center justify-center">
              <span className="text-5xl opacity-50">{post.category?.icon || '📰'}</span>
            </div>
          )}
          {post.featured && (
            <span className="absolute top-3 left-3 badge bg-gold-500 text-white text-[10px] font-bold uppercase tracking-wider">
              ⭐ Featured
            </span>
          )}
        </div>
        <div className="p-5">
          {post.category && (
            <span className={`badge text-[11px] mb-2 ${catClass}`}>
              {post.category.icon} {post.category.name}
            </span>
          )}
          <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug mb-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <span>📅 {formatDate(post.publishedAt || post.createdAt)}</span>
              <span>⏱ {post.readTime} min</span>
            </div>
            <span>👁 {formatNumber(post.viewCount)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`} className="group flex gap-4 p-4 card-hover rounded-2xl">
      {post.featuredImage && (
        <div className="flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden">
          <img src={post.featuredImage} alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        {post.category && (
          <span className={`badge text-[10px] mb-1 ${catClass}`}>
            {post.category.icon} {post.category.name}
          </span>
        )}
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug mb-1">
          {post.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          <span>·</span>
          <span>{post.readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
