import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { useSimba } from '../context/SimbaContext';
import { useTheme } from '../context/ThemeContext';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeBranches = store?.branches.filter((branch) => branch.status === 'active') || [];

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="simba-header">
      <div className="simba-topbar">
        <div className="simba-container simba-topbar-inner">
          <span>Multi-branch Simba Supermarket platform for Kigali and beyond.</span>
          <span>
            Branch:
            {' '}
            <strong>{selectedBranch?.name || 'None'}</strong>
          </span>
        </div>
      </div>

      <div className="simba-container simba-header-main">
        <BrandLogo to="/" className="simba-brand-link" />

        <nav className={`simba-nav${isMenuOpen ? ' open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/catalog" onClick={closeMenu}>Shop</NavLink>
          {currentUser && <NavLink to="/account" onClick={closeMenu}>My Orders</NavLink>}
          {currentUser?.role === 'admin' && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}
        </nav>

        <div className="simba-header-tools">
          <label className="simba-inline-field simba-branch-picker">
            <span>Branch</span>
            <select
              value={selectedBranchId}
              onChange={(event) => setSelectedBranch(event.target.value)}
            >
              {activeBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </label>

          <button className="simba-icon-button" onClick={toggleTheme} type="button">
            {theme === 'dark' ? '☀ Light' : '☾ Dark'}
          </button>

          <button className="simba-cart-pill" type="button" onClick={() => setIsCartOpen(true)}>
            Cart
            <span>{cartSummary.count}</span>
          </button>

          {currentUser ? (
            <div className="simba-user-tools">
              <span className="simba-user-name">{currentUser.name}</span>
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
