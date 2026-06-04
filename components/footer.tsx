'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Send } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import LanguageToggle from './language-toggle';
import Link from 'next/link';

export default function Footer() {
  const { language } = useLanguage();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(language === 'mr' ? 'आमच्याशी जोडले गेल्याबद्दल धन्यवाद! तुम्हाला लवकरच अपडेट्स मिळतील.' : 'Thank you for subscribing! You will receive our updates soon.');
  };

  return (
    <footer className="bg-[#100905] backdrop-blur-md text-[#FEF5E7] border-t border-[#D4AF37]/20 mt-20 relative z-10 w-full overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 mx-auto py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 xl:gap-12 mb-16">

          {/* १. ब्रँडची माहिती */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
          >
            <h3 className="text-3xl font-black text-[#D4AF37] mb-4 tracking-wider">MotherBites</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 lg:pr-4">
              {language === 'mr' 
                ? 'MotherBites तुमच्या ताटात आणते अस्सल गावरान चव. गावाकडच्या आया-बहिणींनी हातांनी आणि प्रेमाने बनवलेले १००% नैसर्गिक पदार्थ.' 
                : 'MotherBites brings authentic village food to your table. Handmade, chemical-free, and prepared with love by village mothers.'}
            </p>
            <div className="flex gap-4">
              {/* Facebook (फेसबुक पेजची लिंक इथे टाका) */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-[#1877F2] hover:text-white transition-all text-gray-300 shadow-sm">
                <Facebook size={18} />
              </a>
              
              {/* Instagram (motherbites च्या जागी तुझ्या पेजचं युझरनेम टाक) */}
              <a href="https://www.instagram.com/officialmotherbites/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-[#E4405F] hover:text-white transition-all text-gray-300 shadow-sm">
                <Instagram size={18} />
              </a>
              
              {/* Twitter / X */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-[#1DA1F2] hover:text-white transition-all text-gray-300 shadow-sm">
                <Twitter size={18} />
              </a>
            </div>
          </motion.div>

          {/* २. जलद लिंक्स (Quick Links) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}
          >
            <h4 className="font-bold text-lg text-white mb-6 border-b-2 border-[#C85A3A] pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-[#D4AF37] hover:translate-x-1 transition-all flex items-center gap-2"><span className="text-[#C85A3A]">•</span> Home</Link></li>
              {/* Shop Link Activated Here */}
              <li><Link href="/shop" className="text-gray-400 hover:text-[#D4AF37] hover:translate-x-1 transition-all flex items-center gap-2"><span className="text-[#C85A3A]">•</span> Shop Products</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-[#D4AF37] hover:translate-x-1 transition-all flex items-center gap-2"><span className="text-[#C85A3A]">•</span> Our Story</Link></li>
              <li><Link href="/orders" className="text-gray-400 hover:text-[#D4AF37] hover:translate-x-1 transition-all flex items-center gap-2"><span className="text-[#C85A3A]">•</span> Track Order</Link></li>
            </ul>
          </motion.div>

          {/* ३. मदत आणि कायदेशीर बाबी (Support & Legal) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}
          >
            <h4 className="font-bold text-lg text-white mb-6 border-b-2 border-[#C85A3A] pb-2 inline-block">Support & Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-[#D4AF37] hover:translate-x-1 transition-all flex items-center gap-2"><span className="text-[#C85A3A]">•</span> Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-[#D4AF37] hover:translate-x-1 transition-all flex items-center gap-2"><span className="text-[#C85A3A]">•</span> Terms & Conditions</Link></li>
              <li><Link href="/refund-policy" className="text-gray-400 hover:text-[#D4AF37] hover:translate-x-1 transition-all flex items-center gap-2"><span className="text-[#C85A3A]">•</span> Refund & Cancellation</Link></li>
              <li><Link href="/#contact" className="text-gray-400 hover:text-[#D4AF37] hover:translate-x-1 transition-all flex items-center gap-2"><span className="text-[#C85A3A]">•</span> Contact Support</Link></li>
            </ul>
          </motion.div>

          {/* ४. संपर्क (Contact Info) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}
          >
            <h4 className="font-bold text-lg text-white mb-6 border-b-2 border-[#C85A3A] pb-2 inline-block">Contact Us</h4>
            <div className="space-y-4 text-sm">
              <a href="mailto:officialmotherbites@gmail.com" className="flex items-center gap-3 text-gray-400 hover:text-[#D4AF37] transition-colors group">
                <div className="bg-white/5 p-2 rounded-full shrink-0 group-hover:bg-[#D4AF37]/20 transition-colors"><Mail size={16} className="text-[#D4AF37]" /></div>
                <span className="truncate">officialmotherbites@gmail.com</span>
              </a>
              <a href="tel:+917499860284" className="flex items-center gap-3 text-gray-400 hover:text-[#D4AF37] transition-colors group">
                <div className="bg-white/5 p-2 rounded-full shrink-0 group-hover:bg-[#D4AF37]/20 transition-colors"><Phone size={16} className="text-[#D4AF37]" /></div>
                +91 7499860284
              </a>
              <div className="flex items-start gap-3 text-gray-400 group">
                <div className="bg-white/5 p-2 rounded-full shrink-0 group-hover:bg-[#D4AF37]/20 transition-colors"><MapPin size={16} className="text-[#D4AF37]" /></div>
                <span className="mt-1 leading-relaxed">Velhane kh. Tal. Parola Dist. Jalgaon <br/> Maharashtra, India - 425111</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ५. वृत्तपत्र (Newsletter Form) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}
          className="border-t border-[#D4AF37]/20 pt-10 mb-10 w-full"
        >
          <div className="w-full max-w-2xl mx-auto text-center">
            <h4 className="font-bold text-xl md:text-2xl text-white mb-2">Subscribe to Our Newsletter</h4>
            <p className="text-gray-400 text-sm mb-6">
              {language === 'mr' ? 'नवीन उत्पादने आणि ऑफर्सची माहिती मिळवण्यासाठी ईमेल टाका.' : 'Get updates on new village products and special offers.'}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                className="flex-1 px-5 py-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              />
              <button type="submit" className="px-8 py-4 bg-[#D4AF37] text-[#2C1810] rounded-xl font-bold hover:bg-[#e0c25c] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0">
                Subscribe <Send size={18} />
              </button>
            </form>
          </div>
        </motion.div>

        {/* ६. कॉपीराईट आणि भाषा */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 w-full">
          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} MotherBites. All rights reserved. <br className="md:hidden" />
            <span className="text-[#C85A3A] ml-1">Crafted with ♥ in Village.</span>
          </p>
          <LanguageToggle />
        </div>
        
      </div>
    </footer>
  );
}