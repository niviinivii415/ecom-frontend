import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { StoreProvider } from './context/StoreContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';

// Code-split lazy loaded components for rapid initial page load
const Landing = lazy(() => import('./pages/Landing'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductListing = lazy(() => import('./pages/ProductListing'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const BuyNow = lazy(() => import('./pages/BuyNow'));
const Account = lazy(() => import('./pages/Account'));
const UserSettings = lazy(() => import('./pages/UserSettings'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Feedback = lazy(() => import('./pages/Feedback'));
const ReturnsExchange = lazy(() => import('./pages/ReturnsExchange'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));

function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(111,31,78,0.4), transparent 70%), #12020e',
        color: 'var(--gold2)'
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          border: '2px solid rgba(212,175,55,0.2)',
          borderTopColor: 'var(--gold)',
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
          marginBottom: '16px'
        }}
      />
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', letterSpacing: '0.1em' }}>
        Vwalah
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <LanguageProvider>
          <NotificationProvider>
            <AuthProvider>
              <CartProvider>
                <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Brand Landing Page - Open to all visitors */}
                  <Route path="/" element={<Landing />} />

                  {/* Dedicated Customer Support & Policy Pages */}
                  <Route path="/returns" element={<ReturnsExchange />} />
                  <Route path="/exchange-and-return" element={<ReturnsExchange />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />

                  {/* Authentication Pages (Public) */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Customer Shopping & Catalogue Browsing (Requires Customer Login) */}
                  <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                  <Route path="/store" element={<ProtectedRoute><ProductListing /></ProtectedRoute>} />
                  <Route path="/store/:categorySlug" element={<ProtectedRoute><ProductListing /></ProtectedRoute>} />
                  <Route path="/shop" element={<ProtectedRoute><ProductListing /></ProtectedRoute>} />
                  <Route path="/category/:categorySlug" element={<ProtectedRoute><ProductListing /></ProtectedRoute>} />
                  <Route path="/collections/:categorySlug" element={<ProtectedRoute><ProductListing /></ProtectedRoute>} />
                  <Route path="/collection/:categorySlug" element={<ProtectedRoute><ProductListing /></ProtectedRoute>} />
                  <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
                  <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
                  <Route path="/reviews" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
                  <Route
                    path="/buy-now"
                    element={
                      <ProtectedRoute>
                        <BuyNow />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <UserSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/settings"
                    element={
                      <ProtectedRoute>
                        <UserSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/track-order"
                    element={
                      <ProtectedRoute>
                        <OrderTracking />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/track-order/:orderNumber"
                    element={
                      <ProtectedRoute>
                        <OrderTracking />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Management Portal - Role-based Admin Protected */}
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback - return to landing */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </CartProvider>
          </AuthProvider>
          </NotificationProvider>
        </LanguageProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}
