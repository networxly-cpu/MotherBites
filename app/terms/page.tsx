'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function TermsConditions() {
  return (
    <main className="min-h-screen bg-[#1a1008] text-[#FEF5E7] font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] mb-8 border-b border-white/10 pb-6">
          Terms & Conditions
        </h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed font-medium">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">1. Overview</h2>
            <p>This website is operated by MotherBites. Throughout the site, the terms "we", "us" and "our" refer to MotherBites. MotherBites offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.</p>
            <p>By visiting our site and/ or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">2. Product Information & Accuracy</h2>
            <p>Our products are handmade in villages using traditional methods. Because of the handmade nature of our food items (like Papads, Kurdais, Pickles), slight variations in shape, size, color, or weight may occur. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. However, we cannot guarantee that your computer monitor's display of any color will be accurate.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">3. Pricing & Modifications</h2>
            <p>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">4. Billing and Account Information</h2>
            <p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.</p>
            <p>You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">5. Shipping & Delivery</h2>
            <p>We strive to deliver all orders within 5-7 business days across India. However, since our products are freshly prepared and completely handmade, sudden surges in orders might cause slight delays. We will keep you updated regarding your dispatch status via email or SMS.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">6. Governing Law</h2>
            <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India, under the jurisdiction of Maharashtra courts.</p>
          </section>

        </div>
      </div>
      <Footer />
    </main>
  );
}