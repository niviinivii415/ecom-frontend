import React, { useState } from 'react';
import { Tag, ShieldCheck, X } from 'lucide-react';
import { couponService } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const inr = (n) => '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');

export default function OrderSummary({
  title = 'Order Summary',
  subtotal = 0,
  shippingFee = 0,
  appliedCoupon = null,
  onCouponApplied,
  onRemoveCoupon,
  items = [],
  showCouponInput = true,
  showCouponError = true,
  showCouponSuccessToast = true,
  actionLabel = '',
  onAction = null,
  actionDisabled = false,
  footerNote = '100% Genuine Certified Jewellery & Insured Shipping'
}) {
  const { showNotification } = useNotification();
  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);
  const [inlineError, setInlineError] = useState('');

  const discountAmount = appliedCoupon
    ? Math.min(Math.round(Number(appliedCoupon.discount_amount ?? appliedCoupon.discount ?? 0)), Math.round(subtotal))
    : 0;
  const finalTotal = Math.max(0, Math.round(subtotal) - discountAmount + Math.round(shippingFee));

  const handleApply = async (e) => {
    e.preventDefault();
    setInlineError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      const msg = 'Invalid coupon code. Please try again.';
      setInlineError(msg);
      return;
    }

    setApplying(true);
    try {
      const res = await couponService.applyCoupon({
        code,
        subtotal,
        items: items.map((item) => ({
          product_id: item.product_id || item.id,
          id: item.id || item.product_id,
          category: item.category,
          price: item.price || item.unit_price || item.selling_price || 0,
          quantity: item.quantity || 1
        }))
      });

      if (res.success) {
        const discountVal = Math.round(
          parseFloat(res.discount_amount ?? res.discount ?? res.coupon?.discount_amount ?? res.coupon?.discount ?? 0)
        );
        const couponObj = {
          code,
          discount: discountVal,
          discount_amount: discountVal,
          message: res.message || 'Coupon applied successfully!'
        };
        if (onCouponApplied) {
          onCouponApplied(couponObj);
        }
        setCouponInput('');
        setInlineError('');
        if (showCouponSuccessToast) {
          showNotification('Coupon applied successfully!', 'success');
        }
      } else {
        const msg = res.message || 'Invalid coupon code. Please try again.';
        setInlineError(msg);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid coupon code. Please try again.';
      setInlineError(msg);
    } finally {
      setApplying(false);
    }
  };

  const handleRemove = () => {
    setInlineError('');
    if (onRemoveCoupon) {
      onRemoveCoupon();
    }
    showNotification('Coupon removed. Order total updated.', 'warning', 2200);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #3a0b2d, #230419)',
        border: '1px solid var(--line)',
        borderRadius: '22px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}
    >
      <h2 style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)', fontSize: '22px', color: 'var(--gold2)', margin: 0 }}>
        {title}
      </h2>

      {/* Coupon Form */}
      {showCouponInput && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <form onSubmit={handleApply} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value);
                if (inlineError) setInlineError('');
              }}
              disabled={applying}
              style={{
                flex: '1 1 160px',
                minWidth: 0,
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(255,240,208,0.06)',
                border: '1px solid var(--line)',
                color: '#fff',
                fontSize: '13px',
                textTransform: 'uppercase'
              }}
            />
            <button
              type="submit"
              className="gbtn"
              disabled={applying}
              style={{ padding: '10px 18px', fontSize: '13px', whiteSpace: 'nowrap' }}
            >
              {applying ? 'Applying...' : 'Apply'}
            </button>
          </form>

          {appliedCoupon && (
            <div
              style={{
                fontSize: '12.5px',
                color: '#4ade80',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '10px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={13} />
                <span>
                  Coupon applied successfully! <b>{appliedCoupon.code}</b> (-{inr(discountAmount)})
                </span>
              </span>
              {onRemoveCoupon && (
                <button
                  type="button"
                  onClick={handleRemove}
                  aria-label="Remove coupon"
                  style={{
                    background: 'rgba(239, 68, 68, 0.18)',
                    border: '1px solid rgba(248, 113, 113, 0.4)',
                    color: '#fca5a5',
                    borderRadius: '999px',
                    padding: '3px 9px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <X size={11} /> Remove
                </button>
              )}
            </div>
          )}

          {showCouponError && inlineError && (
            <div style={{ fontSize: '12px', color: '#f87171', lineHeight: 1.4 }}>
              {inlineError}
            </div>
          )}
        </div>
      )}

      {/* Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ opacity: 0.8 }}>Product Subtotal</span>
          <span>{inr(subtotal)}</span>
        </div>

        {discountAmount > 0 && appliedCoupon && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80' }}>
            <span>Coupon Discount ({appliedCoupon.code})</span>
            <span>- {inr(discountAmount)}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ opacity: 0.8 }}>Shipping &amp; Insurance</span>
          <span style={{ color: '#4ade80' }}>
            {shippingFee > 0 ? inr(shippingFee) : 'Complimentary (Free)'}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--line)',
            paddingTop: '14px',
            fontSize: '19px',
            fontWeight: 700,
            color: 'var(--gold2)'
          }}
        >
          <span>Total Payable</span>
          <span>{inr(finalTotal)}</span>
        </div>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          className="gbtn"
          disabled={actionDisabled}
          onClick={onAction}
          style={{ justifyContent: 'center', padding: '14px 20px', fontSize: '15px', width: '100%' }}
        >
          {actionLabel}
        </button>
      )}

      {footerNote && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', opacity: 0.72, justifyContent: 'center', textAlign: 'center' }}>
          <ShieldCheck size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
          <span>{footerNote}</span>
        </div>
      )}
    </div>
  );
}
