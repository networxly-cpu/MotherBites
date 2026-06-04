'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';

// हे तुझे public फोल्डरमधले ४ स्वतःचे फोटो
const aboutImages = [
  "/about-1.jpg",
  "/about-2.jpg",
  "/about-3.jpg",
  "/about-4.jpg"
];

export default function AboutSection() {
  const { t, language } = useLanguage();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % aboutImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="py-24 bg-transparent border-y border-white/5 relative z-10 w-full overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* डावी बाजू - बदलणारे फोटो */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/20 bg-black/40">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={aboutImages[currentImage]}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="w-full h-full object-cover absolute inset-0"
                  alt="MotherBites Preparation"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008] via-transparent to-transparent" />
            </div>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {aboutImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-2 rounded-full transition-all duration-300 ${currentImage === idx ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/50'}`}
                />
              ))}
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-2 md:-right-6 bg-[#C85A3A] text-white px-6 py-4 rounded-2xl shadow-2xl font-bold border border-white/10 z-20 text-center"
            >
              <span className="block text-2xl font-black text-[#D4AF37]">100%</span>
              Authentic Taste
            </motion.div>
          </motion.div>

          {/* उजवी बाजू - भावनिक शॉर्ट स्टोरी */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 bg-black/40 p-6 sm:p-10 rounded-3xl border border-white/5 backdrop-blur-sm"
          >
            <motion.div>
              <h3 className="text-sm font-black text-[#C85A3A] uppercase tracking-[0.2em] mb-3">
                {language === 'mr' ? 'आमची कहाणी' : 'OUR STORY'}
              </h3>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6 drop-shadow-md">
                {language === 'mr' ? 'गावाकडची आठवण, थेट तुमच्या ताटात!' : 'From the Village, Straight to Your Heart'}
              </h2>
            </motion.div>

            <motion.div className="space-y-4 text-lg text-gray-300 leading-relaxed font-medium">
              <p>
                {language === 'mr' 
                  ? 'शहराच्या सिमेंटच्या जंगलात आणि धावपळीच्या आयुष्यात आपण खूप काही मिळवलं, पण एक गोष्ट मागे राहिली... ती म्हणजे आपल्या मातीची चव. चुलीवरची ती करपलेली भाकरी आणि जळगावच्या उन्हात वाळवलेल्या कुरडयांची आठवण आजही मनाला साद घालते.' 
                  : 'In the hustle of city life and cement jungles, we achieved a lot, but we left something precious behind... the authentic taste of our roots. The memory of food cooked on a traditional mud stove still calls out to our hearts.'}
              </p>
              <p>
                {language === 'mr' 
                  ? 'मशीनमधून बाहेर पडणाऱ्या पाकिटांमध्ये अन्नाचं रूप असतं, पण आईच्या हाताचा तो स्पर्श नसतो. "मदरबाईट्स" ची सुरुवात याच एका साध्या पण खोल भावनेतून झाली. जुन्या पिढीची तीच पारंपरिक चव पुन्हा जिवंत करण्यासाठी...' 
                  : 'Factory-made packets might look perfect, but they lack a mother\'s warm touch. MotherBites was born from a simple yet profound emotion: to revive that pure, traditional taste of our old generation...'}
              </p>
            </motion.div>

            {/* Read Full Story Button */}
            <motion.div className="pt-6">
              <Link href="/about">
                <button className="bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#D4AF37] hover:text-[#2C1810] transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  {language === 'mr' ? 'पूर्ण कहाणी वाचा →' : 'Read Full Story →'}
                </button>
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}