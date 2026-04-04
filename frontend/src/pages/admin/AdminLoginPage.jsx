import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Admin Login - FinanceWise India</title></Helmet>
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">₹</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">FinanceWise Admin</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to manage your blog</p>
          </div>

          <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Username</label>
                <input
                  value={form.username} onChange={e => setForm({...form, username: e.target.value})}
                  placeholder="admin"
                  className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Password</label>
                <input
                  type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  required
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors disabled:opacity-60 text-sm">
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <div className="mt-4 p-3 bg-dark-900 rounded-xl text-xs text-gray-400 leading-relaxed">
              <p className="font-semibold text-gray-300 mb-1">Demo Credentials:</p>
              <p>Username: <code className="text-primary-400">admin</code> | Password: <code className="text-primary-400">Admin@123</code></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
