import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import '../EthnicEdit.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const { register } = useAuth();
  const { storeName } = useStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Delay unlocking inputs briefly so Chrome/Chromium autofill heuristics skip them
    const timer = setTimeout(() => {
      setFormReady(true);
      // Neutralize any browser autofill that slipped through
      setFormData(prev => ({
        ...prev,
        email: prev.email.toLowerCase().includes('admin') ? '' : prev.email,
        password: prev.email.toLowerCase().includes('admin') ? '' : prev.password,
        confirmPassword: prev.email.toLowerCase().includes('admin') ? '' : prev.confirmPassword
      }));
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: '#f87171' };
    if (score <= 4) return { score: 2, label: 'Moderate', color: '#facc15' };
    return { score: 3, label: 'Strong', color: '#4ade80' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify your confirm password.');
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address
      });

      if (res.success) {
        setSuccess(`Registration successful! Redirecting to ${storeName} store...`);
        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(111,31,78,0.5), transparent 70%), #12020e',
        padding: '24px',
        color: '#fff',
        position: 'relative'
      }}
    >
      {/* Back Arrow button at Top Left */}
      <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,240,208,0.08)',
            border: '1px solid var(--line)',
            color: 'var(--gold2)',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title="Go Back"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'linear-gradient(160deg, #3a0b2d, #230419)',
          border: '1px solid var(--line)',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          textAlign: 'center',
          marginTop: '20px'
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #f6dda0, #d4af37)', margin: '0 auto 16px', display: 'grid', placeItems: 'center', color: '#1a0418', fontSize: '24px', fontWeight: 'bold' }}>
            ✦
          </div>
          <h2 style={{ fontSize: '26px', fontFamily: 'var(--font-serif)', color: 'var(--gold2)', letterSpacing: '0.06em', margin: 0 }}>
            {storeName}
          </h2>
          <span style={{ fontSize: '13px', letterSpacing: '0.06em', color: 'var(--gold)', opacity: 0.85, display: 'block', marginTop: '4px', marginBottom: '24px' }}>
            Create Patron Account · Imitation Jewellery
          </span>
        </Link>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', textAlign: 'left' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid #22c55e', color: '#86efac', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          autoComplete="off"
          style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}
        >
          {/* Decoy trap inputs to prevent browser password managers from auto-populating saved admin credentials */}
          <div style={{ position: 'absolute', opacity: 0, height: 0, width: 0, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden="true" tabIndex={-1}>
            <input type="text" name="fake_patron_user" id="fake_patron_user" tabIndex={-1} autoComplete="off" defaultValue="" />
            <input type="password" name="fake_patron_pass" id="fake_patron_pass" tabIndex={-1} autoComplete="new-password" defaultValue="" />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gold2)', display: 'block', marginBottom: '6px' }}>
              Full Name *
            </label>
            <input
              type="text"
              name="patron_registration_name"
              id="patron_registration_name"
              autoComplete="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,240,208,0.06)', border: '1px solid var(--line)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gold2)', display: 'block', marginBottom: '6px' }}>
              Email Address *
            </label>
            <input
              type="email"
              name="patron_registration_email"
              id="patron_registration_email"
              autoComplete="off"
              readOnly={!formReady}
              onFocus={(e) => e.target.removeAttribute('readonly')}
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,240,208,0.06)', border: '1px solid var(--line)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gold2)', display: 'block', marginBottom: '6px' }}>
              Phone Number *
            </label>
            <input
              type="tel"
              name="patron_registration_phone"
              id="patron_registration_phone"
              autoComplete="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter 10-digit mobile number"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,240,208,0.06)', border: '1px solid var(--line)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Password with Eye Icon */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gold2)' }}>
                Password *
              </label>
              {strength.label && (
                <span style={{ fontSize: '11px', color: strength.color, fontWeight: 500 }}>
                  Strength: {strength.label}
                </span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="patron_registration_pwd"
                id="patron_registration_pwd"
                autoComplete="new-password"
                readOnly={!formReady}
                onFocus={(e) => e.target.removeAttribute('readonly')}
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters"
                style={{ width: '100%', padding: '10px 42px 10px 14px', borderRadius: '12px', background: 'rgba(255,240,208,0.06)', border: '1px solid var(--line)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
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

          {/* Confirm Password with Eye Icon */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gold2)', display: 'block', marginBottom: '6px' }}>
              Confirm Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="patron_registration_confirm_pwd"
                id="patron_registration_confirm_pwd"
                autoComplete="new-password"
                readOnly={!formReady}
                onFocus={(e) => e.target.removeAttribute('readonly')}
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
                style={{
                  width: '100%',
                  padding: '10px 42px 10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255,240,208,0.06)',
                  border: formData.confirmPassword && formData.password !== formData.confirmPassword ? '1px solid #ef4444' : '1px solid var(--line)',
                  color: '#fff',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
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
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gold2)', display: 'block', marginBottom: '6px' }}>
              Delivery Address (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="House/Flat No., Street, City, State & PIN code"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,240,208,0.06)', border: '1px solid var(--line)', color: '#fff', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            className="gbtn"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '14px', fontSize: '14px' }}
          >
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '13px', opacity: 0.85 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--gold2)', textDecoration: 'underline', fontWeight: 500 }}>
            Login here
          </Link>
        </div>

        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(212,175,55,0.15)', textAlign: 'center', fontSize: '12px' }}>
          <Link to="/" style={{ color: 'var(--gold)', opacity: 0.8, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={13} /> Return to Store
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', opacity: 0.6 }}>
        Powered by{' '}
        <a href="https://www.aminoid.in/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold2)', textDecoration: 'none' }}>
          Aminoid
        </a>
      </div>
    </div>
  );
}
