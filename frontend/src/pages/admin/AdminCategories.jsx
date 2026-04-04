import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { categoryApi } from '../../utils/api';

const EMPTY = { name: '', description: '', icon: '📊', color: '#10B981' };

export default function AdminCategories() {
  const qc = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(r => r.data),
  });

  const saveMut = useMutation({
    mutationFn: (data) => editId ? categoryApi.update(editId, data) : categoryApi.create(data),
    onSuccess: () => {
      toast.success(editId ? 'Category updated!' : 'Category created!');
      qc.invalidateQueries(['categories']);
      resetForm();
    },
    onError: e => toast.error(e.response?.data?.message || 'Failed to save'),
  });

  const deleteMut = useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => { toast.success('Category deleted'); qc.invalidateQueries(['categories']); },
    onError: () => toast.error('Cannot delete category with posts'),
  });

  const resetForm = () => { setForm(EMPTY); setEditId(null); setShowForm(false); };

  const startEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '📊', color: cat.color || '#10B981' });
    setEditId(cat.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    saveMut.mutate(form);
  };

  const ICONS = ['📈','🏦','📋','💳','🛡️','💰','🏠','📊','💹','🏧','💵','📉'];
  const COLORS = ['#10B981','#3B82F6','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4','#84CC16'];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Categories</h2>
          <p className="text-sm text-gray-500">{categories?.length || 0} categories</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">+ New Category</button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">{editId ? 'Edit Category' : 'Create Category'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="e.g. Investing" className="input" required />
              </div>
              <div>
                <label className="label">Description</label>
                <input value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Short description" className="input" />
              </div>
            </div>
            <div>
              <label className="label">Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map(icon => (
                  <button key={icon} type="button" onClick={() => setForm({...form, icon})}
                    className={`w-10 h-10 rounded-xl text-xl transition-all ${form.icon === icon ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/30 scale-110' : 'bg-gray-100 dark:bg-dark-700 hover:scale-110'}`}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(color => (
                  <button key={color} type="button" onClick={() => setForm({...form, color})}
                    className={`w-8 h-8 rounded-full transition-all ${form.color === color ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : 'hover:scale-110'}`}
                    style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saveMut.isPending} className="btn-primary text-sm disabled:opacity-60">
                {saveMut.isPending ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? [...Array(6)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)
          : categories?.map(cat => (
              <div key={cat.id} className="card p-5 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: cat.color + '20' }}>
                    {cat.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{cat.name}</p>
                    <p className="text-xs text-gray-500">{cat.postCount} posts · {cat.slug}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{cat.description}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => startEdit(cat)} className="text-xs text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => window.confirm('Delete this category?') && deleteMut.mutate(cat.id)}
                    className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
