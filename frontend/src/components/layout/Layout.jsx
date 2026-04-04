import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';

function Navbar({ categories }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchQ('');
      setShowSearch(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 dark:bg-dark-900/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-dark-700' : 'bg-transparent'
    }`}>
      {/* Top ticker */}
      <div className="bg-primary-700 text-white text-xs py-1 overflow-hidden hidden sm:block">
        <div className="ticker-wrap">
          <span className="ticker-move">
            📈 Sensex: 74,248 &nbsp;+0.42% &nbsp;&nbsp;|&nbsp;&nbsp; 💹 Nifty 50: 22,513 &nbsp;+0.38% &nbsp;&nbsp;|&nbsp;&nbsp;
            💰 Gold: ₹62,450/10g &nbsp;+0.2% &nbsp;&nbsp;|&nbsp;&nbsp; 💵 USD/INR: ₹83.42 &nbsp;&nbsp;|&nbsp;&nbsp;
            📊 FD Rate: SBI 7.1% &nbsp;&nbsp;|&nbsp;&nbsp; 🏠 Repo Rate: 6.5% &nbsp;&nbsp;|&nbsp;&nbsp;
            📈 Sensex: 74,248 &nbsp;+0.42% &nbsp;&nbsp;|&nbsp;&nbsp; 💹 Nifty 50: 22,513 &nbsp;+0.38% &nbsp;&nbsp;|&nbsp;&nbsp;
            💰 Gold: ₹62,450/10g &nbsp;+0.2% &nbsp;&nbsp;|&nbsp;&nbsp; 💵 USD/INR: ₹83.42 &nbsp;&nbsp;|&nbsp;&nbsp;
            📊 FD Rate: SBI 7.1% &nbsp;&nbsp;|&nbsp;&nbsp; 🏠 Repo Rate: 6.5%
          </span>
        </div>
      </div>

      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary-700 transition-colors">
              <span className="text-white font-bold text-lg">₹</span>
            </div>
            <div>
              <span className="font-extrabold text-lg text-gray-900 dark:text-white leading-none">FinanceWise</span>
              <span className="block text-[10px] text-primary-600 font-semibold leading-none tracking-wider uppercase">India</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/blog">Blog</NavLink>
            <div className="relative group">
              <button className="btn-ghost">
                Categories <span className="text-xs">▾</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-dark-800 rounded-2xl shadow-xl border border-gray-100 dark:border-dark-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2">
                {categories?.map(cat => (
                  <Link key={cat.id} to={`/category/${cat.slug}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                    <span className="text-xl">{cat.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{cat.name}</div>
                      <div className="text-xs text-gray-500">{cat.postCount} articles</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <NavLink to="/tools">Finance Tools</NavLink>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  autoFocus
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search articles..."
                  className="input w-48 sm:w-64 py-2 text-sm"
                />
                <button type="button" onClick={() => setShowSearch(false)}
                  className="text-gray-400 hover:text-gray-600 p-1">✕</button>
              </form>
            ) : (
              <button onClick={() => setShowSearch(true)} className="btn-ghost p-2" aria-label="Search">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            <button onClick={toggle} className="btn-ghost p-2" aria-label="Toggle theme">
              {dark ? '☀️' : '🌙'}
            </button>

            <Link to="/admin" className="btn-primary hidden sm:inline-flex">
              Admin
            </Link>

            {/* Mobile menu button */}
            <button onClick={() => setOpen(!open)} className="lg:hidden btn-ghost p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-gray-100 dark:border-dark-700 py-4 space-y-1 animate-fade-up">
            <MobileNavLink to="/">🏠 Home</MobileNavLink>
            <MobileNavLink to="/blog">📰 All Articles</MobileNavLink>
            <MobileNavLink to="/tools">🧮 Finance Tools</MobileNavLink>
            <div className="pt-2 border-t border-gray-100 dark:border-dark-700">
              <p className="text-xs font-semibold text-gray-400 uppercase px-3 pb-1">Categories</p>
              {categories?.map(cat => (
                <MobileNavLink key={cat.id} to={`/category/${cat.slug}`}>
                  {cat.icon} {cat.name}
                </MobileNavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  const { pathname } = useLocation();
  const active = pathname === to || (to !== '/' && pathname.startsWith(to));
  return (
    <Link to={to} className={`btn-ghost font-semibold ${active ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : ''}`}>
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children }) {
  return (
    <Link to={to} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 text-sm font-medium transition-colors">
      {children}
    </Link>
  );
}

function Footer({ categories }) {
  return (
    <footer className="bg-dark-950 text-gray-300 mt-20">
      <div className="page-container py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <div>
                <div className="font-extrabold text-white text-lg leading-none">FinanceWise</div>
                <div className="text-[10px] text-primary-400 font-semibold leading-none tracking-wider uppercase">India</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Expert financial guidance for Indian investors. Making personal finance simple, accessible, and actionable.
            </p>
            <div className="flex gap-3 mt-5">
              {['Twitter','Facebook','YouTube','Telegram'].map(s => (
                <a key={s} href="#" className="w-8 h-8 bg-dark-800 hover:bg-primary-700 rounded-lg flex items-center justify-center text-xs transition-colors" title={s}>
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories?.map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                    <span>{cat.icon}</span>{cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Finance Tools</h4>
            <ul className="space-y-2">
              {[
                ['EMI Calculator', '/tools/emi'],
                ['SIP Calculator', '/tools/sip'],
                ['Tax Calculator', '/tools/tax'],
                ['FD Calculator', '/tools/fd'],
                ['PPF Calculator', '/tools/ppf'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-3">Get weekly finance tips straight to your inbox.</p>
            <form className="flex flex-col gap-2" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.com"
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <button className="btn-primary justify-center">Subscribe Free</button>
            </form>
            <p className="text-xs text-gray-500 mt-2">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-dark-800">
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} FinanceWise India. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            ⚠️ Disclaimer: This blog is for educational purposes only. Consult a SEBI-registered advisor before investing.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then(r => r.data),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar categories={catData} />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer categories={catData} />
    </div>
  );
}
