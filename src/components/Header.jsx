import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { useSimba } from '../context/SimbaContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const navigate = useNavigate();
  const {
    currentUser,
    selectedBranchId,
    selectedBranch,
    setSelectedBranch,
    store,
    signOut,
    cartSummary,
    setIsCartOpen,
  } = useSimba();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeBranches = store?.branches.filter((branch) => branch.status === 'active') || [];

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleSearch(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/category/all?search=${encodeURIComponent(q)}`);
      setSearchQuery('');
      closeMenu();
    }
  }

  return (
    <header className="simba-header">
      <div className="simba-topbar">
        <div className="simba-container simba-topbar-inner">
          <span>🦁 Rwanda's trusted supermarket — {activeBranches.length} branches in Kigali &amp; beyond</span>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label className="simba-inline-field simba-branch-picker" style={{ flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>📍 Branch:</span>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranch(e.target.value)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  maxWidth: '160px',
                }}
              >
                {activeBranches.map((branch) => (
                  <option key={branch.id} value={branch.id} style={{ color: '#000' }}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              <option value="en" style={{ color: '#000' }}>🇬🇧 EN</option>
              <option value="rw" style={{ color: '#000' }}>🇷🇼 RW</option>
              <option value="fr" style={{ color: '#000' }}>🇫🇷 FR</option>
            </select>
          </div>
        </div>
      </div>

      <div className="simba-container simba-header-main">
        <BrandLogo to="/" className="simba-brand-link" />

        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '480px' }}>
          <div style={{
            display: 'flex',
            border: '2px solid var(--border-color)',
            borderRadius: '14px',
            overflow: 'hidden',
            transition: 'border-color 150ms',
          }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, categories…"
              style={{
                flex: 1,
                padding: '10px 16px',
                border: 'none',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.9rem',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 18px',
                background: 'var(--primary)',
                color: '#fff',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              🔍
            </button>
          </div>
        </form>

        <nav className={`simba-nav${isMenuOpen ? ' open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/catalog" onClick={closeMenu}>Shop</NavLink>
          {currentUser && <NavLink to="/account" onClick={closeMenu}>My Orders</NavLink>}
          {currentUser?.role === 'admin' && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}
        </nav>

        <div className="simba-header-tools">
          <button className="simba-icon-button" onClick={toggleTheme} type="button" title="Toggle theme">
            {theme === 'dark' ? '☀' : '☾'}
          </button>

          <button className="simba-cart-pill" type="button" onClick={() => setIsCartOpen(true)}>
            Cart
            <span>{cartSummary.count}</span>
          </button>

          {currentUser ? (
            <div className="simba-user-tools">
              <span className="simba-user-name">{currentUser.name.split(' ')[0]}</span>
              <button
                className="simba-secondary-button"
                type="button"
                onClick={() => {
                  signOut();
                  closeMenu();
                  navigate('/');
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link className="simba-primary-button" to="/auth" onClick={closeMenu}>
              Sign in
            </Link>
          )}

          <button
            className="simba-hamburger"
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span className={isMenuOpen ? 'open' : ''} />
            <span className={isMenuOpen ? 'open' : ''} />
            <span className={isMenuOpen ? 'open' : ''} />
          </button>
        </div>
      </div>
    </header>
  );
}
