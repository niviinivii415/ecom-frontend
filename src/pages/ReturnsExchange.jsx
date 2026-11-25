import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, Clock, CheckCircle2, PackageCheck, AlertCircle, Phone, Mail } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { useStore } from '../context/StoreContext';
import '../EthnicEdit.css';

export default function ReturnsExchange() {
  const { storeSettings, storeName } = useStore();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', color: 'var(--cream)' }}>
      <Navbar showBack={true} backTo="/" backLabel="Back to Home" />

      <main style={{ flex: 1, maxWidth: '960px', width: '100%', margin: '0 auto', padding: '40px 20px 80px' }} className="page-transition">
        {/* Header Hero */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="kick" style={{ justifyContent: 'center', marginBottom: '8px' }}>
            Hassle-Free Protection
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', color: 'var(--gold2)', margin: '0 0 12px' }}>
            Returns &amp; Exchange Policy
          </h1>
          <p style={{ maxWidth: '620px', margin: '0 auto', fontSize: '15px', opacity: 0.85, lineHeight: 1.6 }}>
            Every heirloom piece crafted by {storeName} carries our commitment to authentic artistry. We offer a transparent 7-day exchange and return guarantee for your complete peace of mind.
          </p>
        </div>

        {/* 3 Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: 'linear-gradient(160deg, #320726, #1c0316)', border: '1px solid var(--line)', borderRadius: '20px', padding: '28px', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(212,175,55,0.12)', border: '1px solid var(--gold)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: 'var(--gold2)' }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--gold2)', marginBottom: '8px' }}>7-Day Window</h3>
            <p style={{ fontSize: '13px', opacity: 0.8, margin: 0, lineHeight: 1.5 }}>
              Initiate an exchange or return within 7 calendar days of courier delivery confirmation.
            </p>
          </div>

          <div style={{ background: 'linear-gradient(160deg, #320726, #1c0316)', border: '1px solid var(--line)', borderRadius: '20px', padding: '28px', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(212,175,55,0.12)', border: '1px solid var(--gold)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: 'var(--gold2)' }}>
              <RotateCcw size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--gold2)', marginBottom: '8px' }}>Free Replacement</h3>
            <p style={{ fontSize: '13px', opacity: 0.8, margin: 0, lineHeight: 1.5 }}>
              Received a damaged or wrong sizing piece? We arrange free reverse pickup and immediate replacement.
            </p>
          </div>

          <div style={{ background: 'linear-gradient(160deg, #320726, #1c0316)', border: '1px solid var(--line)', borderRadius: '20px', padding: '28px', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(212,175,55,0.12)', border: '1px solid var(--gold)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: 'var(--gold2)' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--gold2)', marginBottom: '8px' }}>Instant Refund</h3>
            <p style={{ fontSize: '13px', opacity: 0.8, margin: 0, lineHeight: 1.5 }}>
              Refunds are credited directly to your original payment method or bank account within 3-5 business days.
            </p>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <section style={{ background: 'linear-gradient(160deg, #2b0621, #180213)', border: '1px solid var(--line)', borderRadius: '24px', padding: '36px', marginBottom: '36px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--gold2)', marginBottom: '20px' }}>
            Exchange &amp; Return Guidelines
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', lineHeight: 1.6, opacity: 0.9 }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '3px' }} />
              <div>
                <b>Original Condition:</b> Pieces must be unused, unworn, and returned in their original luxury box with all jewelry tags intact.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '3px' }} />
              <div>
                <b>Reverse Pickup Service:</b> Our courier partners will inspect and collect the parcel safely from your doorstep across 19,000+ pin codes.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '3px' }} />
              <div>
                <b>Sizing &amp; Fitting Adjustments:</b> Need an altered kada size or longer dori thread for your necklace? We provide free sizing adjustments.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <AlertCircle size={18} style={{ color: '#fca5a5', flexShrink: 0, marginTop: '3px' }} />
              <div>
                <b>Non-Returnable Items:</b> Custom bridal bespoke engravings and pieces damaged through personal misuse cannot be returned.
              </div>
            </div>
          </div>
        </section>

        {/* How to Initiate */}
        <section style={{ background: 'rgba(255,240,208,0.03)', border: '1px solid var(--line)', borderRadius: '24px', padding: '32px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--gold2)', marginBottom: '12px' }}>
            Need to Return or Exchange a Piece?
          </h3>
          <p style={{ fontSize: '14px', opacity: 0.8, maxWidth: '540px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Reach out to our customer care team with your Order ID, or visit your Orders page to track shipment status.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/orders" className="gbtn" style={{ padding: '10px 24px', textDecoration: 'none' }}>
              View My Orders
            </Link>
            <a
              href={`mailto:${storeSettings.contact_email || 'hello@vwalah.com'}?subject=Return%20or%20Exchange%20Request`}
              className="gbtn out"
              style={{ padding: '10px 24px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Mail size={16} /> Email Support
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
