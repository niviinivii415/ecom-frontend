import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { useStore } from '../context/StoreContext';
import '../EthnicEdit.css';

export default function PrivacyPolicy() {
  const { storeSettings, storeName } = useStore();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'radial-gradient(ellipse at 50% 0, rgba(111,31,78,0.35), transparent 55%), linear-gradient(160deg, #1b0315, #350a29 55%, #1e0418)', color: 'var(--cream)' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: '960px', width: '100%', margin: '0 auto', padding: '30px 20px 80px' }} className="page-transition">
        {/* Back Button in Page Body */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,240,208,0.06)',
              border: '1px solid var(--line)',
              color: 'var(--gold2)',
              padding: '8px 18px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,175,55,0.18)'; e.currentTarget.style.borderColor = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,240,208,0.06)'; e.currentTarget.style.borderColor = 'var(--line)'; }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div className="kick" style={{ justifyContent: 'center', marginBottom: '8px' }}>
            Data Protection &amp; Trust
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', color: 'var(--gold2)', margin: '0 0 12px' }}>
            Privacy Policy
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '15px', opacity: 0.85, lineHeight: 1.6 }}>
            At {storeName}, your privacy and digital security are our paramount priorities. Learn how we responsibly collect, protect, and handle your personal data.
          </p>
        </div>

        {/* Content Card */}
        <div style={{ background: 'linear-gradient(160deg, #2b0621, #180213)', border: '1px solid var(--line)', borderRadius: '24px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--gold2)', marginBottom: '12px' }}>
              1. Information We Collect
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.7, opacity: 0.85, margin: 0 }}>
              When you purchase or create an account with {storeName}, we collect basic information required to process and ship your heirloom jewellery orders, including your full name, shipping and billing address, email address, mobile contact number, and order preferences.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--gold2)', marginBottom: '12px' }}>
              2. How Your Information is Used
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.7, opacity: 0.85, margin: '0 0 12px' }}>
              We use your data strictly for legitimate ecommerce operations:
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: 1.8, opacity: 0.85, margin: 0 }}>
              <li>Processing, billing, and packaging your handcrafted jewelry orders.</li>
              <li>Providing real-time order tracking notifications and shipment milestones via SMS or Email.</li>
              <li>Handling customer service, sizing requests, and return/exchange inquiries.</li>
              <li>Preventing fraudulent payments through secure 256-bit SSL encrypted gateways.</li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--gold2)', marginBottom: '12px' }}>
              3. Payment Security &amp; Encryption
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.7, opacity: 0.85, margin: 0 }}>
              We do not store your credit card numbers, debit card PINs, or net banking passwords. All online financial transactions are routed directly through PCI-DSS Level 1 compliant secure payment gateways (including Razorpay and UPI).
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--gold2)', marginBottom: '12px' }}>
              4. Cookies and Local Storage
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.7, opacity: 0.85, margin: 0 }}>
              We use browser local storage and essential cookies strictly to preserve your active shopping bag, saved wishlist pieces, and language preferences across browser visits. We never sell or lease your browsing history to third-party marketing brokers.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--gold2)', marginBottom: '12px' }}>
              5. Your Rights &amp; Data Deletion
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.7, opacity: 0.85, margin: 0 }}>
              You may request an update, export, or permanent deletion of your profile data at any time by contacting our privacy compliance desk at{' '}
              <a href={`mailto:${storeSettings.contact_email || 'hello@vwalah.com'}`} style={{ color: 'var(--gold2)' }}>
                {storeSettings.contact_email || 'hello@vwalah.com'}
              </a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
