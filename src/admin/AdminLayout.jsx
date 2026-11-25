import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Globe, Bell, CheckCheck, Trash2, LayoutDashboard, Gem, FolderTree, 
  Package, ClipboardList, Users, MessageSquare, Tag, Settings, LogOut, Camera, ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { notificationService } from '../services/api';
import DashboardOverview from './DashboardOverview';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import BannerManagement from './BannerManagement';
import OrderManagement from './OrderManagement';
import InventoryManagement from './InventoryManagement';
import CustomerManagement from './CustomerManagement';
import CouponManagement from './CouponManagement';
import SettingsManagement from './SettingsManagement';
import InquiriesManagement from './InquiriesManagement';
import '../EthnicEdit.css';

export default function AdminLayout() {
  const { adminUser, isAdmin, isAdminAuthenticated, loading, adminLogout, user } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { storeName } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tabHistory, setTabHistory] = useState(['dashboard']);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategoryForProducts, setSelectedCategoryForProducts] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [confirmSignOutOpen, setConfirmSignOutOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isNotifOpen]);

  const handleConfirmSignOut = () => {
    adminLogout();
    navigate('/admin/login', { replace: true });
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationService.getAdminNotifications();
      if (res && res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unread_count || 0);
      }
    } catch (err) {
      console.warn('Failed to load notifications:', err.message);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 12000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, fetchNotifications]);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNotification = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      const target = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (target && !target.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffSecs = Math.floor((now - date) / 1000);
    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectTab = (tabId) => {
    const target = tabId === 'overview' ? 'dashboard' : tabId;
    if (target !== activeTab) {
      setTabHistory((prev) => [...prev, target]);
      setActiveTab(target);
      navigate(`/admin/${target}`);
    }
  };

  const handleViewCategoryProducts = (catId) => {
    setSelectedCategoryForProducts(catId ? catId.toString() : 'all');
    handleSelectTab('products');
  };

  const handleAdminBack = () => {
    if (tabHistory.length > 1) {
      const nextHist = [...tabHistory];
      nextHist.pop(); // remove current active tab
      const prevTab = nextHist[nextHist.length - 1];
      setTabHistory(nextHist);
      setActiveTab(prevTab);
      navigate(`/admin/${prevTab}`);
    } else if (activeTab !== 'dashboard') {
      setActiveTab('dashboard');
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const [currentAdminUser, setCurrentAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('tee_admin_user');
      return stored ? JSON.parse(stored) : adminUser;
    } catch {
      return adminUser;
    }
  });

  useEffect(() => {
    if (adminUser) setCurrentAdminUser(adminUser);
    const handleUserUpdate = (e) => {
      if (e.detail) setCurrentAdminUser(e.detail);
      else {
        try {
          const stored = localStorage.getItem('tee_admin_user');
          if (stored) setCurrentAdminUser(JSON.parse(stored));
        } catch {}
      }
    };
    window.addEventListener('admin_user_updated', handleUserUpdate);
    return () => window.removeEventListener('admin_user_updated', handleUserUpdate);
  }, [adminUser]);

  const navItems = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Jewellery Products', icon: Gem },
    { id: 'categories', label: 'Jewellery Collections / Categories', icon: FolderTree },
    { id: 'banners', label: 'Banners & Hero Media', icon: Camera },
    { id: 'orders', label: 'Orders & Shipments', icon: Package },
    { id: 'inventory', label: 'Inventory & Stock', icon: ClipboardList },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inquiries', label: 'Customer Messages', icon: MessageSquare },
    { id: 'coupons', label: 'Coupons & Offers', icon: Tag },
    { id: 'settings', label: 'Store Settings', icon: Settings }
  ];

  useEffect(() => {
    const rawSegment = location.pathname.split('/').filter(Boolean)[1] || 'dashboard';
    const segment = (rawSegment === 'overview' || rawSegment === 'dashboard') ? 'dashboard' : rawSegment;
    if (navItems.some((n) => n.id === segment)) {
      setActiveTab(segment);
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  const hasAdminRole = isAdmin || adminUser?.role === 'admin' || user?.role === 'admin';

  useEffect(() => {
    // If not loading and not admin, redirect to admin login
    if (!loading && !hasAdminRole) {
      navigate('/admin/login', { replace: true });
    }
  }, [hasAdminRole, loading, navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#12020e', color: 'var(--gold2)' }}>
        ✦ Loading Admin Management Console...
      </div>
    );
  }

  if (!hasAdminRole) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#12020e', color: '#fff', padding: '24px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--gold2)', marginBottom: '12px' }}>Admin Authentication Required</h2>
        <p style={{ opacity: 0.8, maxWidth: '400px', marginBottom: '24px' }}>Please log in with your administrator credentials to access the management portal.</p>
        <button
          onClick={() => navigate('/admin/login', { replace: true })}
          style={{ background: 'var(--gold)', color: '#1a0418', border: 'none', padding: '12px 28px', borderRadius: '999px', fontWeight: 700, cursor: 'pointer' }}
        >
          Go to Admin Login →
        </button>
      </div>
    );
  }

  return (
    <div
      className="admin-layout-root"
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        background: 'radial-gradient(ellipse at 50% 0, rgba(111,31,78,0.35), transparent 55%), linear-gradient(160deg, #1b0315, #350a29 55%, #1e0418)',
        color: '#fff',
        fontFamily: 'var(--font-sans)',
        boxSizing: 'border-box'
      }}
    >
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #f6dda0, #d4af37)', display: 'grid', placeItems: 'center', color: '#1a0418', fontSize: '20px', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(212,175,55,0.3)' }}>
            ✦
          </div>
          <div>
            <b style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', color: 'var(--gold2)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', lineHeight: 1.2 }}>
              {storeName || 'THE ETHNIC EDIT'}
            </b>
            <small style={{ color: 'var(--gold)', opacity: 0.85, fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
              ADMIN CONSOLE
            </small>
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleSelectTab(item.id);
                  setSidebarOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: isActive ? '1px solid var(--gold)' : '1px solid transparent',
                  background: isActive ? 'rgba(212,175,55,0.16)' : 'none',
                  color: isActive ? 'var(--gold2)' : 'var(--cream)',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 400,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 14px rgba(0,0,0,0.3)' : 'none'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', color: isActive ? 'var(--gold2)' : 'var(--gold)' }}><item.icon size={17} /></span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer actions in sidebar (Matching Image 3) */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--line)', display: 'flex', gap: '10px' }}>
          <button
            onClick={handleAdminBack}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '999px',
              background: 'rgba(255,240,208,0.06)',
              border: '1px solid var(--line)',
              color: 'var(--cream)',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            onClick={() => setConfirmSignOutOpen(true)}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '999px',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.4)',
              color: '#fca5a5',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
            title={t('adminSignOut', 'Sign Out')}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Navbar */}
        <header
          className="admin-header"
          style={{
            height: '70px',
            background: 'rgba(28,4,22,0.95)',
            borderBottom: '1px solid var(--line)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 80
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="admin-menu-toggle"
              aria-label="Toggle Sidebar Navigation"
            >
              ☰
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              {currentAdminUser?.profile_image ? (
                <img
                  src={currentAdminUser.profile_image}
                  alt={currentAdminUser.name || 'Admin'}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid var(--gold)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.35)'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f6dda0, #d4af37)',
                    color: '#1a0418',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    border: '1px solid rgba(255,240,208,0.4)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.35)'
                  }}
                >
                  {currentAdminUser?.name ? currentAdminUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
              )}
              <span style={{ fontSize: '13px', color: 'var(--cream)', opacity: 0.9 }}>
                {t('adminLoggedInAs', 'Logged in as')}{' '}
                <b style={{ color: 'var(--gold2)' }}>
                  {currentAdminUser?.name || 'Administrator'}
                </b>
              </span>
            </div>

            {/* Notification Bell & Dropdown */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsNotifOpen((prev) => !prev)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isNotifOpen ? 'rgba(229,189,114,0.22)' : 'rgba(255,240,208,0.08)',
                  border: unreadCount > 0 ? '1.5px solid var(--gold)' : '1px solid var(--line)',
                  color: unreadCount > 0 ? 'var(--gold2)' : 'var(--cream)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={unreadCount > 0 ? `${unreadCount} unread notification(s)` : 'Notifications'}
                aria-label="Notifications"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: '999px',
                      minWidth: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(239,68,68,0.5)',
                      lineHeight: 1
                    }}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {isNotifOpen && (
                <>
                  <div
                    onClick={() => setIsNotifOpen(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 998 }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 10px)',
                      width: '380px',
                      maxWidth: 'calc(100vw - 32px)',
                      background: 'linear-gradient(170deg, #2a0520, #160212)',
                      border: '1px solid var(--line)',
                      borderRadius: '18px',
                      boxShadow: '0 24px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(229,189,114,0.15)',
                      zIndex: 999,
                      overflow: 'hidden'
                    }}
                  >
                    {/* Panel Header */}
                    <div
                      style={{
                        padding: '14px 18px',
                        borderBottom: '1px solid var(--line)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(255,240,208,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14.5px', color: 'var(--gold2)' }}>
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <span
                            style={{
                              background: 'rgba(239,68,68,0.2)',
                              border: '1px solid rgba(239,68,68,0.4)',
                              color: '#fca5a5',
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontWeight: 600
                            }}
                          >
                            {unreadCount} new
                          </span>
                        )}
                      </div>

                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllAsRead}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--gold)',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: '6px'
                          }}
                          title="Mark all as read"
                        >
                          <CheckCheck size={14} /> Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notification Items List */}
                    <div
                      style={{
                        maxHeight: '360px',
                        overflowY: 'auto',
                        overscrollBehavior: 'contain'
                      }}
                    >
                      {notifications.length === 0 ? (
                        <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--cream)', opacity: 0.6 }}>
                          <Bell size={26} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                          <p style={{ fontSize: '13px', margin: 0 }}>No notifications yet</p>
                          <small style={{ fontSize: '11.5px', display: 'block', marginTop: '4px', opacity: 0.8 }}>
                            When customers click WhatsApp or Instagram, alerts will appear here.
                          </small>
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          const isWhatsApp = notif.platform?.toLowerCase() === 'whatsapp' || notif.type === 'whatsapp';
                          const isInstagram = notif.platform?.toLowerCase() === 'instagram' || notif.type === 'instagram';
                          return (
                            <div
                              key={notif.id}
                              onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                              style={{
                                padding: '12px 16px',
                                borderBottom: '1px solid rgba(229,189,114,0.1)',
                                background: notif.is_read ? 'transparent' : 'rgba(229,189,114,0.07)',
                                cursor: notif.is_read ? 'default' : 'pointer',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                transition: 'background 0.2s'
                              }}
                            >
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  flexShrink: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: isWhatsApp ? 'rgba(37,211,102,0.18)' : isInstagram ? 'rgba(225,48,108,0.18)' : 'rgba(229,189,114,0.15)',
                                  border: `1px solid ${isWhatsApp ? 'rgba(37,211,102,0.4)' : isInstagram ? 'rgba(225,48,108,0.4)' : 'rgba(229,189,114,0.3)'}`,
                                  fontSize: '14px'
                                }}
                              >
                                {isWhatsApp ? <MessageSquare size={14} color="#4ade80" /> : isInstagram ? <Camera size={14} color="#f472b6" /> : <Bell size={14} color="var(--gold)" />}
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '2px' }}>
                                  <span
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.08em',
                                      color: isWhatsApp ? '#4ade80' : isInstagram ? '#f472b6' : 'var(--gold)'
                                    }}
                                  >
                                    {notif.platform || 'Customer Action'}
                                  </span>
                                  <span style={{ fontSize: '11px', color: 'var(--cream)', opacity: 0.55 }}>
                                    {formatTimestamp(notif.createdAt)}
                                  </span>
                                </div>
                                <p style={{ fontSize: '12.5px', color: 'var(--cream)', margin: '0 0 6px', lineHeight: 1.4, opacity: notif.is_read ? 0.75 : 1 }}>
                                  {notif.message}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  {!notif.is_read ? (
                                    <span style={{ fontSize: '10.5px', color: 'var(--gold2)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
                                      Click to mark read
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '10.5px', color: 'var(--cream)', opacity: 0.4 }}>
                                      Read
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteNotification(notif.id, e)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#f87171',
                                      opacity: 0.6,
                                      cursor: 'pointer',
                                      padding: '2px 4px'
                                    }}
                                    title="Delete notification"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setConfirmSignOutOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.4)',
                color: '#fca5a5',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              title={t('adminSignOut', 'Sign Out')}
            >
              {t('adminSignOut', 'Sign Out')}
            </button>
          </div>
        </header>

        {/* Tab Content Container */}
        <div className="admin-content-pad" style={{ padding: '28px', flex: 1, overflowY: 'auto' }}>
          {(activeTab === 'dashboard' || activeTab === 'overview') && (
            <DashboardOverview onNavigate={handleSelectTab} onBack={handleAdminBack} />
          )}
          {activeTab === 'products' && (
            <ProductManagement
              initialCategory={selectedCategoryForProducts}
              onClearCategory={() => setSelectedCategoryForProducts('all')}
              onBack={handleAdminBack}
            />
          )}
          {activeTab === 'categories' && <CategoryManagement onViewProducts={handleViewCategoryProducts} onBack={handleAdminBack} />}
          {activeTab === 'banners' && <BannerManagement onBack={handleAdminBack} />}
          {activeTab === 'orders' && <OrderManagement onBack={handleAdminBack} />}
          {activeTab === 'inventory' && <InventoryManagement onBack={handleAdminBack} />}
          {activeTab === 'customers' && <CustomerManagement onBack={handleAdminBack} />}
          {activeTab === 'inquiries' && <InquiriesManagement onBack={handleAdminBack} />}
          {activeTab === 'coupons' && <CouponManagement onBack={handleAdminBack} />}
          {activeTab === 'settings' && <SettingsManagement onBack={handleAdminBack} />}
        </div>
      </main>

      {/* Sign Out Confirmation Modal */}
      {confirmSignOutOpen && (
        <div className="ov on" onClick={() => setConfirmSignOutOpen(false)}>
          <div className="box" style={{ maxWidth: '420px', textAlign: 'center', padding: '32px 24px', background: 'linear-gradient(160deg, #320726, #1c0316)' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(239,68,68,0.18)', border: '1px solid #ef4444', color: '#fca5a5', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <LogOut size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--gold2)', margin: '0 0 10px' }}>
              Sign Out Confirmation
            </h3>
            <p style={{ fontSize: '14px', opacity: 0.85, margin: '0 0 24px', lineHeight: 1.5 }}>
              Are you sure you want to sign out of the Administrator Console?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setConfirmSignOutOpen(false)}
                style={{ flex: 1, padding: '10px 18px', borderRadius: '999px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--cream)', cursor: 'pointer', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSignOut}
                style={{ flex: 1, padding: '10px 18px', borderRadius: '999px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

