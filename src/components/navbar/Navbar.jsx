import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, User, LogOut, Settings, Menu, X, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';

export default function Navbar({ showBack = false, backTo = '/', backLabel = 'Back' }) {
  const { cartCount, wishlistCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const { storeSettings, storeName } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleConfirmLogout = () => {
    logout();
    setShowSignOutModal(false);
    navigate('/', { replace: true });
  };

  const linkStyle = (path) => ({
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    fontWeight: isActive(path) ? 600 : 500,
    color: isActive(path) ? 'var(--gold2)' : 'var(--cream)',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    borderBottom: isActive(path) ? '2px solid var(--gold2)' : '2px solid transparent',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap'
  });

  return (
    <>
      <header
        className="nav sc"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(38, 5, 29, 0.96)',
          borderBottom: '1px solid var(--line)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Left: Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {showBack && (
            <button
              onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,240,208,0.06)',
                border: '1px solid var(--line)',
                color: 'var(--gold2)',
                padding: '6px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Go Back"
            >
              <ArrowLeft size={14} /> {backLabel}
            </button>
          )}

          <Link
            className="brand"
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            aria-label={`${storeName} Home`}
          >
            <span className="logo" style={{ width: '38px', height: '38px', flexShrink: 0 }}></span>
            <span>
              <b style={{ fontSize: '20px', letterSpacing: '0.06em', color: 'var(--gold2)', fontFamily: 'var(--font-serif)', display: 'block' }}>
                {storeName}
              </b>
              <small style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block' }}>
                {storeSettings.tagline || t('heroSubtitle', 'Tradition, Beautifully Curated.')}
              </small>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (Properly Aligned, Complete) */}
        <nav
          className="desktop-menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Link to="/" style={linkStyle('/')}>
            {t('home', 'Home')}
          </Link>
          <Link to="/shop" style={linkStyle('/shop')}>
            {t('catalogue', 'Catalogue')}
          </Link>
          <Link to="/orders" style={linkStyle('/orders')}>
            {t('myOrders', 'My Orders')}
          </Link>
          <Link to="/settings" style={linkStyle('/settings')}>
            {t('settings', 'Settings')}
          </Link>
          {isAuthenticated ? (
            <Link to="/settings" style={linkStyle('/settings')} title="Profile">
              {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Profile'}
            </Link>
          ) : (
            <Link to="/login" style={linkStyle('/login')}>
              {t('signIn', 'Sign In')}
            </Link>
          )}
        </nav>

        {/* Right: Tools Bar (Wishlist, Cart, Profile) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Wishlist Link with Synchronized Counter Badge */}
          <Link
            to="/wishlist"
            style={{
              position: 'relative',
              color: 'var(--gold2)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              textDecoration: 'none',
              borderRadius: '8px',
              transition: 'transform 0.2s'
            }}
            title={t('wishlist', 'Wishlist')}
          >
            <Heart size={21} fill={wishlistCount > 0 ? '#f87171' : 'none'} color={wishlistCount > 0 ? '#f87171' : 'var(--gold2)'} />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '1px',
                  right: '-3px',
                  minWidth: '17px',
                  height: '17px',
                  borderRadius: '50%',
                  background: '#f87171',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                  lineHeight: 1,
                  boxShadow: '0 2px 6px rgba(248,113,113,0.5)'
                }}
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Bag Link with Perfectly Aligned Counter Badge */}
          <Link
            to="/cart"
            style={{
              position: 'relative',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              textDecoration: 'none',
              borderRadius: '8px',
              transition: 'transform 0.2s'
            }}
            title={t('bag', 'Bag')}
          >
            <ShoppingBag size={21} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '1px',
                  right: '-3px',
                  minWidth: '17px',
                  height: '17px',
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  color: 'var(--ink)',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                  lineHeight: 1,
                  boxShadow: '0 2px 6px rgba(229,189,114,0.4)'
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile & Settings Icon */}
          <Link
            to={isAuthenticated ? '/settings' : '/login'}
            style={{
              color: 'var(--gold)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              textDecoration: 'none'
            }}
            title={isAuthenticated ? 'Profile & Settings' : 'Sign In'}
          >
            <User size={20} />
          </Link>

          {/* Optional Sign Out Button for Logged-In Users with Confirmation */}
          {isAuthenticated && (
            <button
              onClick={() => setShowSignOutModal(true)}
              style={{
                background: 'none',
                border: 0,
                color: '#fca5a5',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px'
              }}
              title={t('signOut', 'Sign Out')}
            >
              <LogOut size={18} />
            </button>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              background: 'none',
              border: 0,
              color: 'var(--gold2)',
              cursor: 'pointer',
              padding: '6px',
              display: 'none'
            }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-root"
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            maxHeight: 'calc(100vh - 64px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            background: 'rgba(24, 3, 20, 0.98)',
            borderBottom: '1px solid var(--line)',
            padding: '20px 24px',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backdropFilter: 'blur(16px)',
            boxSizing: 'border-box'
          }}
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={linkStyle('/')}>
            {t('home', 'Home')}
          </Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={linkStyle('/shop')}>
            {t('catalogue', 'Catalogue')}
          </Link>
          <Link to="/orders" onClick={() => setMobileMenuOpen(false)} style={linkStyle('/orders')}>
            {t('myOrders', 'My Orders')}
          </Link>
          <Link to="/settings" onClick={() => setMobileMenuOpen(false)} style={linkStyle('/settings')}>
            {t('settings', 'Settings')}
          </Link>
          <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} style={linkStyle('/wishlist')}>
            {t('wishlist', 'Wishlist')} ({wishlistCount})
          </Link>
          <Link to="/cart" onClick={() => setMobileMenuOpen(false)} style={linkStyle('/cart')}>
            {t('bag', 'Bag')} ({cartCount})
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowSignOutModal(true);
              }}
              style={{
                textAlign: 'left',
                background: 'none',
                border: 0,
                color: '#fca5a5',
                fontSize: '14px',
                padding: '6px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <LogOut size={16} /> {t('signOut', 'Sign Out')}
            </button>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={linkStyle('/login')}>
              {t('signIn', 'Sign In')}
            </Link>
          )}
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(10, 1, 8, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSignOutModal(false);
          }}
        >
          <div
            style={{
              background: 'linear-gradient(160deg, #320726, #1c0316)',
              border: '1px solid var(--line)',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.4)',
                color: '#f87171',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 16px'
              }}
            >
              <LogOut size={22} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--gold2)', margin: '0 0 8px' }}>
              Confirm Sign Out
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--cream)', opacity: 0.85, margin: '0 0 24px', lineHeight: 1.5 }}>
              Are you sure you want to sign out from your account?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowSignOutModal(false)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255,240,208,0.06)',
                  border: '1px solid var(--line)',
                  color: 'var(--cream)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(239,68,68,0.4)'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
