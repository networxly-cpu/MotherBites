'use client';
import React from 'react';

export default function Option3FullTest() {
  return (
    <div 
      className="min-h-screen text-[#FEF5E7] selection:bg-[#D4AF37] selection:text-black font-sans"
      style={{
        backgroundColor: '#1a1008',
        /* डार्क ओव्हरले सोबत गावरान फोटो */
        backgroundImage: `linear-gradient(rgba(26, 16, 8, 0.85), rgba(26, 16, 8, 0.85)), url('https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?q=80&w=2000&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed' /* ही लाईन बॅकग्राउंडला स्क्रोल होताना स्थिर ठेवते */
      }}
    >
      {/* १. Navbar (वरची पट्टी) */}
      <nav className="p-6 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-[#D4AF37] tracking-wider">MotherBites</div>
          <div className="hidden md:flex gap-8 text-sm text-gray-300 font-medium">
            <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Home</span>
            <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">About Us</span>
            <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Products</span>
          </div>
        </div>
      </nav>

      {/* २. Hero Section (पहिला लुक) */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative">
        <div className="inline-block px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-semibold mb-6">
          १००% नैसर्गिक आणि हातसडीचे
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl leading-tight">
          गावाकडची <span className="text-[#D4AF37]">अस्सल</span> चव
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
          आजीच्या हातचे वळलेले पापड आणि उन्हात वाळवलेल्या कुरड्या. मातीच्या चुलीवरची आणि गावच्या प्रेमाची खरी ओळख.
        </p>
        <button className="px-10 py-4 bg-[#D4AF37] text-[#1a1008] font-bold rounded-sm text-lg hover:bg-[#e0c25c] transition-transform hover:-translate-y-1 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
          आमचे पदार्थ पहा
        </button>
      </section>

      {/* ३. Why Us / Features Section (खासियत) */}
      <section className="py-24 px-4 border-t border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="w-full mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#FEF5E7]">आमची खासियत</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'मशिनचा वापर नाही', desc: 'सर्व पदार्थ पारंपरिक पद्धतीने, हाताने बनवले जातात.' },
              { title: '१००% नैसर्गिक', desc: 'कोणतेही केमिकल किंवा प्रिझर्व्हेटिव्ह नाही, थेट शेतातून.' },
              { title: 'रोज ताजे', desc: 'ऑर्डर आल्यावर ताज्या साहित्यापासून बनवलेले पदार्थ.' }
            ].map((feature, i) => (
              <div key={i} className="p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-full mb-6 flex items-center justify-center text-[#D4AF37] text-2xl group-hover:scale-110 transition-transform">
                  ✦
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-[#D4AF37]">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ४. Products Section (पदार्थ) */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-black/80">
        <div className="w-full mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#FEF5E7]">गावरान पदार्थ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {['उडीद पापड', 'नाचणी पापड', 'बाजरी वडी', 'मसाला पापड'].map((product, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-white/10 bg-[#1a1008]/80 group hover:border-[#D4AF37]/50 transition-all">
                <div className="h-52 bg-[#2C1810] relative overflow-hidden flex items-center justify-center">
                  <span className="text-gray-600">Product Image</span>
                  <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/20 transition-all duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-[#FEF5E7]">{product}</h3>
                  <p className="text-[#D4AF37] font-semibold mb-6 text-lg">₹ 300</p>
                  <button className="w-full py-3 border-2 border-[#D4AF37] text-[#D4AF37] font-bold rounded hover:bg-[#D4AF37] hover:text-[#1a1008] transition-all">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ५. Footer */}
      <footer className="py-10 border-t border-white/10 text-center text-gray-500 bg-black">
        <p>© 2026 MotherBites. गावाकडून तुमच्या घरापर्यंत.</p>
      </footer>
    </div>
  );
}