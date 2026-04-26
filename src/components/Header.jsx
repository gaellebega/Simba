import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, User, LogOut, Menu, X,
  MapPin, ChevronDown, Sun, Moon, Globe, Store,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useSimba } from '../context/SimbaContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const LANG_OPTIONS = [
  { code: 'en', label: 'English',     flag: '🇬🇧' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'fr', label: 'Français',    flag: '🇫🇷' },
];

function useClickOutside(ref, handler) {
  useEffect(() => {
    function listener(e) {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    }
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

function BranchDropdown({ branches, selectedBranchId, onSelect, t }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));
  const current = branches.find((b) => b.id === selectedBranchId);

  return (
    <div className="hdr-dropdown" ref={ref}>
      <button type="button" className="hdr-dropdown-trigger" onClick={() => setOpen((v) => !v)}>
        <MapPin size={13} />
        <span className="hdr-dropdown-label">{current?.name || t('selectBranch')}</span>
        <ChevronDown size={12} className={`hdr-chevron${open ? ' open' : ''}`} />
      </button>
      {open && (
        <div className="hdr-dropdown-menu">
          <div className="hdr-dropdown-header"><MapPin size={11} /> {t('selectBranch')}</div>
          {branches.map((b) => (
            <button key={b.id} type="button"
              className={`hdr-dropdown-item${b.id === selectedBranchId ? ' active' : ''}`}
              onClick={() => { onSelect(b.id); setOpen(false); }}>
              <MapPin size={14} />
              <span className="hdr-dropdown-item-main">
                <strong>{b.name}</strong>
                <small>{b.region}</small>
              </span>
              {b.id === selectedBranchId && <span className="hdr-check-icon">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LangDropdown({ language, setLanguage }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));
  const current = LANG_OPTIONS.find((l) => l.code === language) || LANG_OPTIONS[0];

  return (
    <div className="hdr-dropdown" ref={ref}>
      <button type="button" className="hdr-dropdown-trigger hdr-lang-trigger"
        onClick={() => setOpen((v) => !v)}>
        <Globe size={13} />
        <span className="hdr-dropdown-label">{current.code.toUpperCase()}</span>
        <ChevronDown size={12} className={`hdr-chevron${open ? ' open' : ''}`} />
      </button>
      {open && (
        <div className="hdr-dropdown-menu hdr-lang-menu">
          {LANG_OPTIONS.map((lang) => (
            <button key={lang.code} type="button"
              className={`hdr-dropdown-item${lang.code === language ? ' active' : ''}`}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}>
              <span>{lang.flag}</span>
              <span className="hdr-dropdown-item-main">
                <strong>{lang.label}</strong>
              </span>
              {lang.code === language && <span className="hdr-check-icon">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const {
    currentUser, selectedBranchId, setSelectedBranch,
    store, signOut, cartSummary, setIsCartOpen,
  } = useSimba();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeBranches = store?.branches.filter((b) => b.status === 'active') || [];

  function closeMenu() { setIsMenuOpen(false); }

  function handleSearch(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/category/all?search=${encodeURIComponent(q)}`);
      setSearchQuery('');
      closeMenu();
    }
  }

  const navCls = ({ isActive }) => `nb-nav-link${isActive ? ' active' : ''}`;

  return (
    <header className="simba-header">

      {/* ════ Topbar ════ */}
      <div className="hdr-topbar">
        <div className="simba-container hdr-topbar-inner">
          <div className="hdr-topbar-left">
            <span className="hdr-topbar-brand"><Store size={13} /> {t('brandTagline')}</span>
            <span className="hdr-topbar-divider">|</span>
            <span className="hdr-topbar-support">{t('supportLine')}</span>
          </div>
          <div className="hdr-topbar-right">
            {activeBranches.length > 0 && (
              <BranchDropdown
                branches={activeBranches}
                selectedBranchId={selectedBranchId}
                onSelect={setSelectedBranch}
                t={t}
              />
            )}
            <LangDropdown language={language} setLanguage={setLanguage} />
            <button className="hdr-theme-btn" onClick={toggleTheme} type="button"
              title={t('darkMode')} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* ════ Main bar — 3-zone grid ════ */}
      <div className="simba-container nb-bar">

        {/* ── Zone 1: Logo ── */}
        <div className="nb-logo-zone">
          <BrandLogo to="/" />
        </div>

        {/* ── Zone 2: Search ── */}
        <form className="nb-search" onSubmit={handleSearch} role="search">
          <div className="nb-search-inner">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="nb-search-input"
              aria-label={t('search')}
            />
            <button type="submit" className="nb-search-btn" aria-label={t('searchBtn')}>
              <Search size={16} />
            </button>
          </div>
        </form>

        {/* ── Zone 3: Nav + Actions ── */}
        <div className="nb-tools">

          {/* Desktop nav links */}
          <nav className="nb-nav" aria-label="Main navigation">
            <NavLink to="/" end className={navCls} onClick={closeMenu}>{t('navHome')}</NavLink>
            <NavLink to="/catalog" className={navCls} onClick={closeMenu}>{t('navShop')}</NavLink>
            {currentUser && (
              <NavLink to="/account" className={navCls} onClick={closeMenu}>{t('navMyOrders')}</NavLink>
            )}
            {currentUser?.role === 'admin' && (
              <NavLink to="/admin" className={navCls} onClick={closeMenu}>{t('navAdmin')}</NavLink>
            )}
            {currentUser && (
              <NavLink to="/branch-dashboard" className={navCls} onClick={closeMenu}>{t('navBranchDash')}</NavLink>
            )}
          </nav>

          {/* Divider between nav and action icons */}
          <span className="nb-sep" aria-hidden="true" />

          {/* Cart */}
          <button className="nb-icon-btn" type="button"
            onClick={() => setIsCartOpen(true)} aria-label="Open cart">
            <ShoppingCart size={18} />
            {cartSummary.count > 0 && (
              <span className="nb-cart-dot">{cartSummary.count}</span>
            )}
          </button>

          {/* Signed-in user pill */}
          {currentUser ? (
            <div className="nb-user">
              <span className="nb-user-avatar" title={currentUser.name}>
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
              <span className="nb-user-name">{currentUser.name.split(' ')[0]}</span>
              <button className="nb-signout" type="button" title={t('signOut')}
                onClick={() => { signOut(); closeMenu(); navigate('/'); }}>
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link className="nb-signin" to="/auth" onClick={closeMenu}>
              <User size={15} />
              <span>{t('signIn')}</span>
            </Link>
          )}

          {/* Hamburger (mobile only) */}
          <button className="nb-burger" type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu" aria-expanded={isMenuOpen}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>

      {/* ════ Mobile full-screen nav overlay ════ */}
      <nav className={`nb-mobile-nav${isMenuOpen ? ' open' : ''}`} aria-hidden={!isMenuOpen}>
        <button className="nb-mobile-close" type="button" onClick={closeMenu} aria-label="Close menu">
          <X size={20} />
        </button>
        <NavLink to="/" end className={navCls} onClick={closeMenu}>{t('navHome')}</NavLink>
        <NavLink to="/catalog" className={navCls} onClick={closeMenu}>{t('navShop')}</NavLink>
        {currentUser && (
          <NavLink to="/account" className={navCls} onClick={closeMenu}>{t('navMyOrders')}</NavLink>
        )}
        {currentUser?.role === 'admin' && (
          <NavLink to="/admin" className={navCls} onClick={closeMenu}>{t('navAdmin')}</NavLink>
        )}
        {currentUser && (
          <NavLink to="/branch-dashboard" className={navCls} onClick={closeMenu}>{t('navBranchDash')}</NavLink>
        )}
      </nav>

    </header>
  );
}
