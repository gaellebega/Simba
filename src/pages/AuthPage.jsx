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
  const { currentUser, signIn, signUp, resetPassword } = useSimba();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState(INITIAL_SIGNUP);
  const [forgotForm, setForgotForm] = useState({ email: '', newPassword: '', confirm: '' });
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('error');
  const [loading, setLoading] = useState(false);

  if (currentUser) {
    return <Navigate to={location.state?.from || '/account'} replace />;
  }

  function setError(msg) { setFeedback(msg); setFeedbackType('error'); }
  function setSuccess(msg) { setFeedback(msg); setFeedbackType('success'); }

  const fillDemo = (account) => {
    setSignInForm({ email: account.email, password: account.password });
    setFeedback('');
    setMode('signin');
  };

  const switchMode = (next) => { setMode(next); setFeedback(''); };

  return (
    <div className="simba-page simba-auth-page">
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🦁</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Simba Supermarket</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            {mode === 'forgot'
              ? 'Reset your password below.'
              : 'Sign in to order, track pickups, and more.'}
          </p>
        </div>

        <div className="simba-panel">
          {mode !== 'forgot' && (
            <div className="simba-auth-toggle" style={{ marginBottom: '24px' }}>
              <button
                type="button"
                className={mode === 'signin' ? 'active' : ''}
                onClick={() => switchMode('signin')}
              >
                Sign in
              </button>
              <button
                type="button"
                className={mode === 'signup' ? 'active' : ''}
                onClick={() => switchMode('signup')}
              >
                Create account
              </button>
            </div>
          )}

          {/* ── SIGN IN ── */}
          {mode === 'signin' && (
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
                    setError(result.message);
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
                  <p className="simba-form-feedback" style={{ color: feedbackType === 'error' ? 'var(--accent-red)' : 'var(--accent-emerald)' }}>
                    {feedback}
                  </p>
                )}
                <button
                  className="simba-primary-button"
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    width: '100%',
                    marginTop: '8px',
                  }}
                >
                  Forgot password?
                </button>
              </form>
            </>
          )}

          {/* ── SIGN UP ── */}
          {mode === 'signup' && (
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
                  setError(result.message);
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
                <p className="simba-form-feedback" style={{ color: feedbackType === 'error' ? 'var(--accent-red)' : 'var(--accent-emerald)' }}>
                  {feedback}
                </p>
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

          {/* ── FORGOT PASSWORD ── */}
          {mode === 'forgot' && (
            <form
              className="simba-form"
              onSubmit={async (e) => {
                e.preventDefault();
                if (forgotForm.newPassword !== forgotForm.confirm) {
                  setError('Passwords do not match.');
                  return;
                }
                if (forgotForm.newPassword.length < 8) {
                  setError('Password must be at least 8 characters.');
                  return;
                }
                setLoading(true);
                setFeedback('');
                const result = await resetPassword(forgotForm.email, forgotForm.newPassword);
                setLoading(false);
                if (result.ok) {
                  setSuccess('Password updated! You can now sign in.');
                  setTimeout(() => switchMode('signin'), 2000);
                } else {
                  setError(result.message);
                }
              }}
            >
              <label>
                <span>Your email address</span>
                <input
                  type="email"
                  required
                  value={forgotForm.email}
                  onChange={(e) => setForgotForm((v) => ({ ...v, email: e.target.value }))}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                <span>New password</span>
                <input
                  type="password"
                  minLength="8"
                  required
                  value={forgotForm.newPassword}
                  onChange={(e) => setForgotForm((v) => ({ ...v, newPassword: e.target.value }))}
                  placeholder="Min. 8 characters"
                />
              </label>
              <label>
                <span>Confirm new password</span>
                <input
                  type="password"
                  minLength="8"
                  required
                  value={forgotForm.confirm}
                  onChange={(e) => setForgotForm((v) => ({ ...v, confirm: e.target.value }))}
                  placeholder="Repeat password"
                />
              </label>
              {feedback && (
                <p className="simba-form-feedback" style={{ color: feedbackType === 'error' ? 'var(--accent-red)' : 'var(--accent-emerald)' }}>
                  {feedback}
                </p>
              )}
              <button
                className="simba-primary-button"
                type="submit"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
              >
                {loading ? 'Updating…' : 'Reset password'}
              </button>
              <button
                type="button"
                onClick={() => switchMode('signin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  width: '100%',
                  marginTop: '8px',
                }}
              >
                ← Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
