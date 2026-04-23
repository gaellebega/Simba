import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSimba } from '../context/SimbaContext';

const DEMO_ACCOUNTS = [
  { label: 'Admin demo', email: 'admin@simba.rw', password: 'Admin123!' },
  { label: 'Customer demo', email: 'customer@simba.rw', password: 'Customer123!' },
];

const INITIAL_SIGNUP = { name: '', email: '', phone: '', password: '' };

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, signIn, signUp } = useSimba();
  const [mode, setMode] = useState('signin');
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState(INITIAL_SIGNUP);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  if (currentUser) {
    return <Navigate to={location.state?.from || '/account'} replace />;
  }

  const fillDemo = (account) => {
    setSignInForm({ email: account.email, password: account.password });
    setFeedback('');
  };

  return (
    <div className="simba-page simba-auth-page">
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🦁</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Simba Supermarket</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Sign in to order, track pickups, and more.
          </p>
        </div>

        <div className="simba-panel">
          <div className="simba-auth-toggle" style={{ marginBottom: '24px' }}>
            <button
              type="button"
              className={mode === 'signin' ? 'active' : ''}
              onClick={() => { setMode('signin'); setFeedback(''); }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => { setMode('signup'); setFeedback(''); }}
            >
              Create account
            </button>
          </div>

          {mode === 'signin' ? (
            <>
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px',
                padding: '12px',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
              }}>
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => fillDemo(account)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    {account.label}
                  </button>
                ))}
              </div>

              <form
                className="simba-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setFeedback('');
                  const result = await signIn(signInForm.email, signInForm.password);
                  setLoading(false);
                  if (result.ok) {
                    navigate(location.state?.from || '/account');
                  } else {
                    setFeedback(result.message);
                  }
                }}
              >
                <label>
                  <span>Email address</span>
                  <input
                    type="email"
                    required
                    value={signInForm.email}
                    onChange={(e) => setSignInForm((v) => ({ ...v, email: e.target.value }))}
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    required
                    value={signInForm.password}
                    onChange={(e) => setSignInForm((v) => ({ ...v, password: e.target.value }))}
                    placeholder="••••••••"
                  />
                </label>
                {feedback && (
                  <p className="simba-form-feedback" style={{ color: 'var(--accent-red)' }}>{feedback}</p>
                )}
                <button
                  className="simba-primary-button"
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            </>
          ) : (
            <form
              className="simba-form"
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setFeedback('');
                const result = await signUp(signUpForm);
                setLoading(false);
                if (result.ok) {
                  navigate('/account');
                } else {
                  setFeedback(result.message);
                }
              }}
            >
              <label>
                <span>Full name</span>
                <input
                  required
                  value={signUpForm.name}
                  onChange={(e) => setSignUpForm((v) => ({ ...v, name: e.target.value }))}
                  placeholder="Your name"
                />
              </label>
              <label>
                <span>Email address</span>
                <input
                  type="email"
                  required
                  value={signUpForm.email}
                  onChange={(e) => setSignUpForm((v) => ({ ...v, email: e.target.value }))}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                <span>Phone (optional)</span>
                <input
                  type="tel"
                  value={signUpForm.phone}
                  onChange={(e) => setSignUpForm((v) => ({ ...v, phone: e.target.value }))}
                  placeholder="07X XXX XXXX"
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  type="password"
                  minLength="8"
                  required
                  value={signUpForm.password}
                  onChange={(e) => setSignUpForm((v) => ({ ...v, password: e.target.value }))}
                  placeholder="Min. 8 characters"
                />
              </label>
              {feedback && (
                <p className="simba-form-feedback" style={{ color: 'var(--accent-red)' }}>{feedback}</p>
              )}
              <button
                className="simba-primary-button"
                type="submit"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
