'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-[#1a1008] text-[#FEF5E7] font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] mb-8 border-b border-white/10 pb-6">
          Refund & Cancellation Policy
        </h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed font-medium">
          
          <div className="bg-[#C85A3A]/10 border border-[#C85A3A]/30 p-6 rounded-xl">
            <p className="text-white font-bold mb-2">Important Note on Food Items:</p>
            <p>Because MotherBites deals in authentic, handmade, and perishable food items without chemical preservatives, we maintain a strict health and safety standard. Therefore, <strong>we do not accept returns on any opened or consumed food products</strong>.</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">1. Order Cancellation</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Before Dispatch:</strong> You can cancel your order completely free of charge before it has been dispatched from our village facility. Please contact us immediately at support@motherbites.com or call our helpline to request a cancellation.</li>
              <li><strong>After Dispatch:</strong> Once the order has been handed over to our courier partners, it cannot be canceled.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">2. Damaged or Defective Items</h2>
            <p>Your satisfaction is our priority. While we pack our items securely, transit damages can occasionally occur. You are eligible for a replacement or refund under the following conditions:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The packet was physically damaged, torn, or unsealed at the time of delivery.</li>
              <li>The wrong product was delivered to you.</li>
            </ul>
            <p className="font-bold text-[#D4AF37]">Action Required:</p>
            <p>You must notify us within <strong>24 hours of delivery</strong>. Please send us an email at support@motherbites.com with clear photos/videos of the damaged parcel, your Order ID, and a brief description. We will verify the issue and arrange a free replacement or a full refund.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">3. Refund Process & Timelines</h2>
            <p>If your refund request is approved (due to cancellation before dispatch or damaged delivery):</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Prepaid Orders:</strong> The refund will be initiated to your original method of payment (Credit/Debit Card, UPI, Net Banking). It typically takes <strong>5-7 business days</strong> for the amount to reflect in your bank account, depending on your bank's processing time.</li>
              <li><strong>Cash on Delivery (COD) Orders:</strong> If you paid via COD and are eligible for a refund (e.g., returned a damaged product at the door), we will request your UPI ID or Bank Account details via email. The refund will be processed within 5-7 business days after receiving your details.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#C85A3A]">4. Late or Missing Refunds</h2>
            <p>If you haven’t received a refund after 7 business days, first check your bank account again. Then contact your credit card company or bank, as it may take some time before your refund is officially posted. If you’ve done all of this and you still have not received your refund, please contact us at support@motherbites.com.</p>
          </section>

        </div>
      </div>
      <Footer />
    </main>
  );
}