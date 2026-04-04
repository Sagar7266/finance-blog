import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { postApi, categoryApi } from '../../utils/api';

const EMPTY = {
  title: '', content: '', excerpt: '', featuredImage: '',
  metaTitle: '', metaDescription: '', metaKeywords: '',
  status: 'DRAFT', featured: false, readTime: 5, categoryId: '', tags: '',
};

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1,2,3,4,false] }],
    ['bold','italic','underline','strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote','code-block'],
    ['link','image'],
    [{ color: [] }, { background: [] }],
    ['clean'],
  ],
};

export default function AdminPostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = !!id;
  const [form, setForm] = useState(EMPTY);
  const [activeTab, setActiveTab] = useState('content');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(r => r.data),
  });

  const { data: post } = useQuery({
    queryKey: ['post-edit', id],
    queryFn: () => postApi.getById(id).then(r => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        featuredImage: post.featuredImage || '',
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        metaKeywords: post.metaKeywords || '',
        status: post.status || 'DRAFT',
        featured: post.featured || false,
        readTime: post.readTime || 5,
        categoryId: post.category?.id || '',
        tags: post.tags || '',
      });
    }
  }, [post]);

  const saveMut = useMutation({
    mutationFn: (data) => isEdit ? postApi.update(id, data) : postApi.create(data),
    onSuccess: () => {
      toast.success(isEdit ? 'Post updated!' : 'Post created!');
      qc.invalidateQueries(['admin-posts']);
      navigate('/admin/posts');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Save failed'),
  });

  const handleSave = (status) => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.content.trim()) { toast.error('Content is required'); return; }
    saveMut.mutate({ ...form, status, categoryId: form.categoryId || null });
  };

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Post' : 'Create New Post'}</h2>
          <p className="text-sm text-gray-500">Fill in the details below</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSave('DRAFT')} disabled={saveMut.isPending}
            className="btn-secondary text-sm disabled:opacity-60">
            Save Draft
          </button>
          <button onClick={() => handleSave('PUBLISHED')} disabled={saveMut.isPending}
            className="btn-primary text-sm disabled:opacity-60">
            {saveMut.isPending ? 'Saving...' : '🚀 Publish'}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="card p-5 mb-4">
        <input
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Post title..."
          className="w-full text-2xl font-bold bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-dark-600"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {['content','settings','seo'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
              activeTab === tab ? 'bg-primary-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
            }`}>
            {tab === 'content' ? '✏️ Content' : tab === 'settings' ? '⚙️ Settings' : '🔍 SEO'}
          </button>
        ))}
      </div>

      {/* Content tab */}
      {activeTab === 'content' && (
        <div className="card p-5 space-y-4">
          <div>
            <label className="label">Featured Image URL</label>
            <input value={form.featuredImage} onChange={e => set('featuredImage', e.target.value)}
              placeholder="https://images.unsplash.com/..." className="input" />
            {form.featuredImage && (
              <img src={form.featuredImage} alt="preview" className="mt-2 h-32 w-full object-cover rounded-xl" />
            )}
          </div>
          <div>
            <label className="label">Excerpt</label>
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
              placeholder="Brief description for SEO and preview cards..."
              className="input min-h-20 resize-none" rows={3} />
          </div>
          <div>
            <label className="label">Content *</label>
            <ReactQuill
              value={form.content}
              onChange={val => set('content', val)}
              modules={QUILL_MODULES}
              theme="snow"
              placeholder="Write your article here..."
            />
          </div>
        </div>
      )}

      {/* Settings tab */}
      {activeTab === 'settings' && (
        <div className="card p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)} className="input">
                <option value="">— Select Category —</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Read Time (minutes)</label>
              <input type="number" min={1} max={60} value={form.readTime} onChange={e => set('readTime', parseInt(e.target.value))} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Tags (comma separated)</label>
            <input value={form.tags} onChange={e => set('tags', e.target.value)}
              placeholder="SIP, Mutual Funds, Investment, India" className="input" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
                className="w-4 h-4 accent-primary-600 rounded" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">⭐ Featured Post</span>
            </label>
          </div>
        </div>
      )}

      {/* SEO tab */}
      {activeTab === 'seo' && (
        <div className="card p-5 space-y-4">
          <div>
            <label className="label">Meta Title</label>
            <input value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)}
              placeholder="SEO title (60 chars recommended)" className="input" maxLength={70} />
            <p className="text-xs text-gray-400 mt-1">{form.metaTitle.length}/70 characters</p>
          </div>
          <div>
            <label className="label">Meta Description</label>
            <textarea value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)}
              placeholder="SEO description (160 chars recommended)" className="input min-h-20 resize-none" rows={3} maxLength={170} />
            <p className="text-xs text-gray-400 mt-1">{form.metaDescription.length}/170 characters</p>
          </div>
          <div>
            <label className="label">Meta Keywords</label>
            <input value={form.metaKeywords} onChange={e => set('metaKeywords', e.target.value)}
              placeholder="keyword1, keyword2, keyword3" className="input" />
          </div>

          {/* SEO Preview */}
          {(form.metaTitle || form.title) && (
            <div className="p-4 bg-gray-50 dark:bg-dark-900 rounded-xl">
              <p className="text-xs font-semibold text-gray-400 mb-2">GOOGLE PREVIEW</p>
              <p className="text-blue-600 text-base font-medium hover:underline cursor-pointer line-clamp-1">
                {form.metaTitle || form.title}
              </p>
              <p className="text-green-700 text-xs mb-1">https://financewise.in/blog/{form.title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}</p>
              <p className="text-gray-600 text-sm line-clamp-2">{form.metaDescription || form.excerpt}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
