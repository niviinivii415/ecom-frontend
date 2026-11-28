import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { useNotification } from '../context/NotificationContext';
import { couponService } from '../services/api';
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import OrderSummary from '../components/OrderSummary';
import '../EthnicEdit.css';

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function Cart() {
  const { cartItems, cartSubtotal, discount, appliedCoupon, setAppliedCoupon, removeCoupon, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { storeName } = useStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // Revalidate any previously applied coupon against backend whenever cart opens or subtotal changes
  useEffect(() => {
    if (!appliedCoupon?.code || cartItems.length === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await couponService.applyCoupon({
          code: appliedCoupon.code,
          subtotal: cartSubtotal,
          items: cartItems.map((item) => ({
            product_id: item.id,
            id: item.id,
            category: item.category,
            price: item.price,
            quantity: item.quantity
          }))
        });
        if (!cancelled && res.success) {
          const disc = Math.round(parseFloat(res.discount_amount ?? res.discount ?? 0));
          if (disc !== (appliedCoupon.discount ?? appliedCoupon.discount_amount)) {
            setAppliedCoupon({ ...appliedCoupon, discount: disc, discount_amount: disc });
          }
        }
      } catch (err) {
        if (!cancelled) {
          removeCoupon();
          showNotification('This coupon has expired or is no longer available. Your order total has been updated.', 'warning', 3500);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [cartSubtotal, cartItems.length]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/shop');
    }
  };

  return (
    <div className="page-transition" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', color: 'var(--cream)' }}>
      {/* Header */}
      <Navbar />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '36px 20px' }}>
        <div style={{ marginBottom: '28px' }}>
          <button
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: 'var(--gold)',
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              marginBottom: '8px'
            }}
          >
            <ArrowLeft size={14} /> {t('adminBack', 'Back')}
          </button>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', color: 'var(--gold2)', margin: 0 }}>
            {t('shoppingBag', 'Your Shopping Bag')}
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ background: 'linear-gradient(160deg, #320726, #200318)', border: '1px solid var(--line)', borderRadius: '24px', padding: '60px 24px', textAlign: 'center' }}>
            <ShoppingBag size={54} style={{ color: 'var(--gold)', opacity: 0.5, marginBottom: '16px' }} />
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '26px', color: 'var(--gold2)', marginBottom: '8px' }}>
              Your bag is currently empty
            </h2>
            <p style={{ opacity: 0.8, maxWidth: '420px', margin: '0 auto 28px', fontSize: '14px' }}>
              Explore our curated South Indian temple jewellery, heirloom chokers, and handcrafted bridal pieces.
            </p>
            <Link to="/shop" className="gbtn">
              {t('startShopping', 'Explore Collections')} <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '32px', alignItems: 'start' }}>
            {/* Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => {
                const img = item.image_url || item.images?.[0]?.image_url || item.i;
                const isCss = img && img.startsWith('var(');
                const bg = isCss ? img : img ? `url("${encodeURI(img)}")` : 'var(--i-neck)';

                return (
                  <div
                    key={item.id}
                    className="cart-item"
                    style={{
                      background: 'linear-gradient(160deg, #320726, #200318)',
                      border: '1px solid var(--line)',
                      borderRadius: '18px',
                      padding: '20px',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '12px',
                        backgroundImage: bg,
                        backgroundColor: '#24061d',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        flexShrink: 0,
                        border: '1px solid var(--line)'
                      }}
                    />
                    <div className="cart-item-details" style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontFamily: '"Cormorant Garamond", serif', color: 'var(--gold2)' }}>
                        {item.name}
                      </h3>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>
                        {inr(item.price)}
                      </div>
                      <div className="cart-item-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,240,208,0.06)', border: '1px solid var(--line)', borderRadius: '8px' }}>
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            style={{ padding: '4px 10px', background: 'transparent', border: 0, color: 'var(--gold)', cursor: 'pointer', fontSize: '15px' }}
                          >
                            −
                          </button>
                          <span style={{ padding: '0 8px', fontSize: '13px', fontWeight: 600 }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            style={{ padding: '4px 10px', background: 'transparent', border: 0, color: 'var(--gold)', cursor: 'pointer', fontSize: '15px' }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => updateQuantity(item.id, -item.quantity)}
                          style={{ background: 'transparent', border: 0, color: '#f87171', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-price" style={{ textAlign: 'right', fontWeight: 600, fontSize: '16px', color: 'var(--gold2)' }}>
                      {inr(item.price * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Box */}
            <OrderSummary
              title="Order Summary"
              subtotal={cartSubtotal}
              shippingFee={0}
              appliedCoupon={appliedCoupon}
              onCouponApplied={(couponObj) => setAppliedCoupon(couponObj)}
              onRemoveCoupon={removeCoupon}
              items={cartItems}
              showCouponInput={true}
              actionLabel={`${t('proceedToCheckout', 'Proceed to Checkout')} →`}
              onAction={() =>
                navigate('/checkout', {
                  state: {
                    couponDiscount: discount,
                    appliedCoupon: appliedCoupon?.code || ''
                  }
                })
              }
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--line)', padding: '24px', background: 'var(--panel)', fontSize: '13px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span>© {new Date().getFullYear()} {storeName}. All rights reserved.</span>
          <span>
            Powered by{' '}
            <a href="https://www.aminoid.in/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold2)', textDecoration: 'none', fontWeight: 500 }}>
              Aminoid
            </a>
          </span>
          
        </div>
      </footer>
    </div>
  );
}
