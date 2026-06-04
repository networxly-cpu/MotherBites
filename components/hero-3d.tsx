'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function HeroSection() {
  const { t } = useLanguage();
  const [floatingProducts, setFloatingProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .limit(4);
      if (data) setFloatingProducts(data);
    }
    fetchProducts();
  }, []);

  const floatPositions = [
    { top: '15%', left: '8%', delay: 0 },
    { top: '25%', right: '10%', delay: 1.5 },
    { bottom: '20%', left: '12%', delay: 2.5 },
    { bottom: '30%', right: '8%', delay: 1 },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center bg-transparent w-full">
      
      {/* 1. हवेत तरंगणारे प्रॉडक्ट्सचे फोटो (Clickable Links) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden max-w-[100vw]">
        {floatingProducts.map((prod, i) => {
          const pos = floatPositions[i % 4];
          const img = prod.image_urls?.[0] || prod.image_url;

          return (
            <motion.div
              key={prod.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{ top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom }}
              animate={{ 
                y: [0, -25, 0], 
                rotate: [0, 8, -8, 0] 
              }}
              transition={{ 
                duration: 6 + i, 
                repeat: Infinity, 
                ease: 'easeInOut', 
                delay: pos.delay 
              }}
              whileHover={{ scale: 1.15, zIndex: 50 }}
            >
              <Link href={`/product/${prod.id}`} className="block relative group">
                <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full border-[3px] border-[#D4AF37]/60 overflow-hidden shadow-[0_0_25px_rgba(212,175,55,0.4)] opacity-90 group-hover:opacity-100 transition-all duration-300">
                  <img src={img} alt={prod.name} className="w-full h-full object-cover" />
                </div>
                {/* टूलटिप: माऊस नेल्यावर प्रॉडक्टचे नाव दिसेल */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#2C1810] text-[#D4AF37] font-bold text-xs md:text-sm px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#D4AF37]/40 shadow-lg pointer-events-none">
                  {prod.name}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* 2. मुख्य मजकूर आणि बटणे (Overlay Content) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen text-center">
        
        {/* मजकूर थोडा खाली ढकलण्यासाठी pt-12 ऍड केले आहे */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 md:space-y-8 flex flex-col items-center pt-12"
        >
          {/* १. सर्वात वर: आपला फायनल प्रीमियम लोगो */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="z-10 mb-6 relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full shadow-[0_0_50px_rgba(212,175,55,0.4)] border-2 border-[#D4AF37]/50 overflow-hidden flex items-center justify-center bg-[#1a1008]"
          >
            <img 
              src="/logo.png" 
              alt="MotherBites Premium Logo" 
              // इथे scale-[1.35] च्या जागी scale-[1.15] केला आहे
              className="w-full h-full object-cover scale-[1.12]" 
            />
          </motion.div>

          {/* २. Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl sm:text-8xl lg:text-[6.5rem] font-black text-balance leading-tight text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] tracking-tight"
          >
            MotherBites
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C85A3A] to-[#D4AF37] drop-shadow-none">
              {t('heroTitle')}
            </span>
          </motion.h1>

          {/* ३. Badge (100% Natural - टायटलच्या खाली घेतला) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-block px-6 py-2 md:py-3 rounded-full border border-[#D4AF37]/30 bg-black/40 text-[#D4AF37] text-sm md:text-lg font-bold backdrop-blur-md shadow-lg"
          >
            100% Natural • Handmade • No Chemicals
          </motion.div>

          {/* ४. Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-transparent via-black/50 to-transparent p-6 rounded-2xl backdrop-blur-sm mt-4"
          >
            <p className="text-2xl md:text-3xl lg:text-4xl text-[#FEF5E7] font-serif italic drop-shadow-lg leading-relaxed tracking-wide">
              "{t('heroDescription')}"
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-6"
          >
            {/* Shop Now -> /shop पेजवर जाईल */}
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 md:py-5 bg-[#D4AF37] text-[#2C1810] rounded-xl font-black text-lg md:text-xl hover:bg-[#e0c25c] transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] w-full sm:w-auto"
              >
                {t('shopNow')}
              </motion.button>
            </Link>
            
            {/* Learn More -> /about (आपल्या स्टोरी) पेजवर जाईल */}
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 md:py-5 bg-black/60 text-white border-2 border-[#D4AF37]/50 rounded-xl font-bold text-lg md:text-xl hover:bg-black/80 hover:border-[#D4AF37] transition-all backdrop-blur-md shadow-lg w-full sm:w-auto"
              >
                {t('learnMore')}
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8 pt-4 hidden sm:block"
          >
            <p className="text-sm md:text-base text-gray-300 mb-3 drop-shadow-md">
              {t('language') === 'English' ? 'Scroll to explore' : 'अन्वेषण करण्यासाठी खाली स्क्रोल करा'}
            </p>
            <div className="w-8 h-12 border-2 border-[#D4AF37]/50 rounded-full mx-auto flex items-start justify-center p-2 bg-black/20 backdrop-blur-sm">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
      
    </section>
  );
}