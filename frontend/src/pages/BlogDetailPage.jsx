import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { postApi, commentApi } from '../utils/api';
import { formatDate, formatDateRelative } from '../utils/helpers';
import PostCard from '../components/blog/PostCard';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const qc = useQueryClient();
  const [comment, setComment] = useState({ authorName: '', authorEmail: '', content: '' });

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => postApi.getBySlug(slug).then(r => r.data),
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', post?.id],
    queryFn: () => commentApi.getByPost(post.id).then(r => r.data),
    enabled: !!post?.id,
  });

  const { data: related } = useQuery({
    queryKey: ['related', post?.id],
    queryFn: () => postApi.getRelated(post.id, post.category?.id).then(r => r.data),
    enabled: !!post?.id && !!post?.category?.id,
  });

  const submitComment = useMutation({
    mutationFn: (data) => commentApi.add(post.id, data),
    onSuccess: () => {
      toast.success('Comment submitted! Awaiting approval.');
      setComment({ authorName: '', authorEmail: '', content: '' });
      qc.invalidateQueries(['comments', post?.id]);
    },
    onError: () => toast.error('Failed to submit comment.'),
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.content.trim() || !comment.authorName.trim() || !comment.authorEmail.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    submitComment.mutate(comment);
  };

  if (isLoading) return (
    <div className="page-container py-10">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-80 rounded-2xl" />
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-4 rounded" />)}
      </div>
    </div>
  );

  if (error || !post) return (
    <div className="page-container py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article Not Found</h1>
      <p className="text-gray-500 mb-6">The article you're looking for doesn't exist.</p>
      <Link to="/blog" className="btn-primary">← Back to Blog</Link>
    </div>
  );

  const tags = post.tags ? post.tags.split(',').map(t => t.trim()) : [];

  return (
    <>
      <Helmet>
        <title>{post.metaTitle || post.title} - FinanceWise India</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        {post.metaKeywords && <meta name="keywords" content={post.metaKeywords} />}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
        <meta property="og:type" content="article" />
      </Helmet>

      <article className="page-container py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Link to="/" className="hover:text-primary-600">Home</Link>
                <span>/</span>
                <Link to="/blog" className="hover:text-primary-600">Blog</Link>
                {post.category && <>
                  <span>/</span>
                  <Link to={`/category/${post.category.slug}`} className="hover:text-primary-600">
                    {post.category.name}
                  </Link>
                </>}
              </nav>

              {/* Category badge */}
              {post.category && (
                <Link to={`/category/${post.category.slug}`} className="badge badge-green mb-3 inline-flex">
                  {post.category.icon} {post.category.name}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100 dark:border-dark-700">
                {post.author && (
                  <span className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {post.author.fullName?.[0] || post.author.username?.[0] || 'A'}
                    </div>
                    {post.author.fullName || post.author.username}
                  </span>
                )}
                <span>📅 {formatDate(post.publishedAt || post.createdAt)}</span>
                <span>⏱ {post.readTime} min read</span>
                <span>👁 {post.viewCount?.toLocaleString('en-IN')} views</span>
                <span>💬 {post.commentCount || 0} comments</span>
              </div>

              {/* Featured image */}
              {post.featuredImage && (
                <div className="relative rounded-2xl overflow-hidden mb-8 aspect-video">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Content */}
              <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.content }} />

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100 dark:border-dark-700">
                  <span className="text-sm font-semibold text-gray-500">Tags:</span>
                  {tags.map(tag => (
                    <Link key={tag} to={`/search?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 rounded-full text-xs hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 transition-colors">
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Author box */}
              {post.author && (
                <div className="mt-8 p-6 card flex gap-4">
                  <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {post.author.fullName?.[0] || 'A'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{post.author.fullName}</p>
                    <p className="text-xs text-primary-600 font-semibold mb-2">Financial Expert</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{post.author.bio || 'Finance writer and investment advisor.'}</p>
                  </div>
                </div>
              )}

              {/* Comments */}
              <section className="mt-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  💬 Comments ({comments?.length || 0})
                </h2>

                {/* Comment list */}
                {comments?.length > 0 && (
                  <div className="space-y-4 mb-8">
                    {comments.map(c => (
                      <div key={c.id} className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 bg-gray-200 dark:bg-dark-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold text-sm">
                            {c.authorName?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{c.authorName}</p>
                            <p className="text-xs text-gray-400">{formatDateRelative(c.createdAt)}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment form */}
                <div className="card p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Leave a Comment</h3>
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Name *</label>
                        <input value={comment.authorName} onChange={e => setComment({...comment, authorName: e.target.value})}
                          placeholder="Your name" className="input" required />
                      </div>
                      <div>
                        <label className="label">Email *</label>
                        <input type="email" value={comment.authorEmail} onChange={e => setComment({...comment, authorEmail: e.target.value})}
                          placeholder="your@email.com" className="input" required />
                      </div>
                    </div>
                    <div>
                      <label className="label">Comment *</label>
                      <textarea value={comment.content} onChange={e => setComment({...comment, content: e.target.value})}
                        placeholder="Share your thoughts..." className="input min-h-28 resize-none" rows={4} required />
                    </div>
                    <button type="submit" disabled={submitComment.isPending} className="btn-primary">
                      {submitComment.isPending ? 'Submitting...' : 'Post Comment →'}
                    </button>
                    <p className="text-xs text-gray-400">Your comment will appear after moderation.</p>
                  </form>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
              {related?.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">📖 Related Articles</h3>
                  <div className="space-y-3">
                    {related.map(p => (
                      <PostCard key={p.id} post={p} />
                    ))}
                  </div>
                </div>
              )}
              <div className="card p-5 hero-gradient text-white">
                <p className="text-sm font-bold mb-1">🧮 Free Tools</p>
                <p className="text-xs text-green-100 mb-3">Calculate EMI, SIP, Tax instantly</p>
                <div className="grid grid-cols-2 gap-2">
                  {[['EMI','/tools/emi'],['SIP','/tools/sip'],['Tax','/tools/tax'],['FD','/tools/fd']].map(([l,p]) => (
                    <Link key={p} to={p} className="text-center py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold transition-colors">{l}</Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
