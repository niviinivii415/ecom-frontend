import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import '../EthnicEdit.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin, isAdmin, isAdminAuthenticated, adminUser, user } = useAuth();
  const { storeName } = useStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAdmin || isAdminAuthenticated || adminUser?.role === 'admin' || user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, isAdminAuthenticated, adminUser, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await adminLogin(email, password);
      if (res.success) {
        if (res.isCustomer || res.user?.role !== 'admin') {
          navigate('/home', { replace: true });
        } else {
          navigate('/admin/dashboard', { replace: true });
        }
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(111,31,78,0.5), transparent 70%), #12020e',
        padding: '20px',
        color: '#fff'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(160deg, #3a0b2d, #230419)',
          border: '1px solid var(--line)',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          textAlign: 'center'
        }}
      >
        <div style={{ textAlign: 'left', marginBottom: '14px' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--gold2)',
              fontSize: '13px',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #f6dda0, #d4af37)', margin: '0 auto 16px', display: 'grid', placeItems: 'center', color: '#1a0418', fontSize: '24px', fontWeight: 'bold' }}>
          ✦
        </div>

        <h2 style={{ fontSize: '26px', fontFamily: 'var(--font-serif)', color: 'var(--gold2)', letterSpacing: '0.06em', marginBottom: '6px' }}>
          {storeName}
        </h2>
        <span style={{ fontSize: '13px', letterSpacing: '0.08em', color: 'var(--gold)', opacity: 0.9, display: 'block', marginBottom: '28px' }}>
          Admin Portal
        </span>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gold2)', display: 'block', marginBottom: '6px' }}>
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,240,208,0.06)', border: '1px solid var(--line)', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gold2)', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ width: '100%', padding: '12px 42px 12px 16px', borderRadius: '12px', background: 'rgba(255,240,208,0.06)', border: '1px solid var(--line)', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--gold)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg, #f6dda0, #d4af37)',
              color: '#1a0418',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 24px rgba(212,175,55,0.3)',
              transition: 'all 0.3s ease',
              marginTop: '10px'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard →'}
          </button>
        </form>

        <a
          href="/"
          style={{ display: 'inline-block', marginTop: '24px', fontSize: '13px', color: 'var(--gold)', opacity: 0.8, textDecoration: 'none' }}
        >
          ← Return to Customer Storefront
        </a>
      </div>
    </div>
  );
}

