'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#1a1008] text-[#FEF5E7] font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] mb-8 border-b border-white/10 pb-6">
          Privacy Policy
        </h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed font-medium">
          <p><strong>Last Updated:</strong> June 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">1. Introduction</h2>
            <p>Welcome to MotherBites. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us. Please read this policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">2. Information We Collect</h2>
            <p>We collect information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products, or otherwise contact us.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Data:</strong> Name, shipping address, email address, and telephone number.</li>
              <li><strong>Financial Data:</strong> Data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services. (Note: Financial data is securely handled by our payment gateways like Razorpay/PhonePe).</li>
              <li><strong>Automatically Collected Data:</strong> IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">3. How We Use Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and deliver your authentic village food orders.</li>
              <li>Create and manage your account.</li>
              <li>Email you regarding your account or order status.</li>
              <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
              <li>Respond to product and customer service requests.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">4. Disclosure of Your Information</h2>
            <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process.</li>
              <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
            </ul>
            <p className="font-bold text-[#D4AF37]">We DO NOT sell, trade, or rent your personal information to third parties.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">5. Security of Your Information</h2>
            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">6. Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
            <p className="text-white">Email: support@motherbites.com<br/>Phone: +91 9876 543 210<br/>Address: Velhane Village, Jalgaon, Maharashtra, India - 425001</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}