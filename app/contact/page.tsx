'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function ContactPage() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen bg-transparent text-[#FEF5E7] font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-[#D4AF37] mb-6 drop-shadow-lg">
            {language === 'mr' ? 'संपर्क साधा' : 'Contact & Support'}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-medium">
            {language === 'mr' 
              ? 'आम्ही मदतीसाठी नेहमी तत्पर आहोत. कोणताही प्रश्न किंवा अडचण असल्यास बिनधास्त संपर्क करा!' 
              : 'We are always here to help. Reach out to us for any queries, support, or feedback!'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Details */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-[#C85A3A] pl-4">
              Get in Touch
            </h2>
            
            <div className="bg-[#2C1810]/60 p-8 rounded-3xl border border-white/10 backdrop-blur-md flex items-start gap-6 hover:border-[#D4AF37]/50 transition-colors">
              <div className="bg-[#C85A3A]/20 p-4 rounded-full text-[#C85A3A] shrink-0">
                <Phone size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
                <p className="text-gray-400 mb-2">Mon-Sat from 9am to 6pm.</p>
                <a href="tel:+919876543210" className="text-[#D4AF37] font-black text-lg hover:underline">+91 9876 543 210</a>
              </div>
            </div>

            <div className="bg-[#2C1810]/60 p-8 rounded-3xl border border-white/10 backdrop-blur-md flex items-start gap-6 hover:border-[#D4AF37]/50 transition-colors">
              <div className="bg-[#D4AF37]/20 p-4 rounded-full text-[#D4AF37] shrink-0">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
                <p className="text-gray-400 mb-2">Drop us a mail and we'll reply within 24 hours.</p>
                <a href="mailto:support@motherbites.com" className="text-[#D4AF37] font-black text-lg hover:underline">support@motherbites.com</a>
              </div>
            </div>

            <div className="bg-[#2C1810]/60 p-8 rounded-3xl border border-white/10 backdrop-blur-md flex items-start gap-6 hover:border-[#D4AF37]/50 transition-colors">
              <div className="bg-green-500/20 p-4 rounded-full text-green-500 shrink-0">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Our Village Unit</h3>
                <p className="text-gray-400 leading-relaxed">
                  Velhane Village, District Jalgaon,<br />
                  Maharashtra, India - 425001
                </p>
              </div>
            </div>
          </div>

          {/* Quick Inquiry Form */}
          <div className="bg-[#2C1810]/80 p-8 md:p-10 rounded-3xl border border-[#D4AF37]/30 backdrop-blur-md shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-2">Send a Message</h2>
            <p className="text-gray-400 mb-8">Fill out the form below and we will get back to you.</p>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37]" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile Number</label>
                <input type="tel" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37]" placeholder="10-digit number" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Your Message</label>
                <textarea required rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full bg-[#C85A3A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#A6452B] transition-all shadow-lg flex items-center justify-center gap-2">
                <MessageSquare size={20} /> Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}