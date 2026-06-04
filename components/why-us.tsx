'use client';

import { motion } from 'framer-motion';
import { Heart, Leaf, Award, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function WhyUs() {
  const { t, language } = useLanguage();

  // इथे आपण एकदम कडक, विश्वासाचा आणि भावनिक मजकूर टाकला आहे
  const reasons = [
    {
      icon: Heart,
      title: language === 'mr' ? 'प्रेमाने हातांनी बनवलेले' : 'Handmade with Love',
      desc: language === 'mr' 
        ? 'प्रत्येक पदार्थ गावाकडच्या आया-बहिणींच्या प्रेमळ हातांनी बनवला जातो. आजीच्या हातची तीच जुनी, अस्सल चव आणि आपुलकी तुम्हाला प्रत्येक घासात नक्की जाणवेल. हे फक्त अन्न नाही, तर घरची आठवण आहे!'
        : 'Every single piece is shaped by the loving hands of village mothers. We preserve the age-old traditions and warmth of a grandmother\'s touch, bringing you food that truly feels like home.'
    },
    {
      icon: Leaf,
      title: language === 'mr' ? '१००% नैसर्गिक आणि शुद्ध' : '100% Chemical-Free',
      desc: language === 'mr'
        ? 'कोणतेही प्रिझर्व्हेटिव्ह किंवा कृत्रिम रंग नाहीत! आम्ही थेट स्थानिक शेतकऱ्यांकडून कच्चा माल आणतो, जेणेकरून तुमच्या कुटुंबाला मिळेल फक्त शुद्ध आणि सात्विक आहार. आरोग्याशी कोणतीही तडजोड नाही.'
        : 'No preservatives, no artificial colors, and absolutely no chemicals. We source fresh, raw ingredients directly from local farmers to ensure your family eats only the purest and healthiest food.'
    },
    {
      icon: Award,
      title: language === 'mr' ? 'मशिनचा अजिबात वापर नाही' : 'No Machines Used',
      desc: language === 'mr'
        ? 'मशिनच्या या जगात आम्ही संयम निवडला आहे! कडक उन्हात वाळवण्यापासून ते हाताने वळण्यापर्यंत, आमच्या पारंपरिक पद्धतींमुळे पदार्थांची खरी चव आणि सुगंध टिकून राहतो. बाजारातल्या पाकिटांसारखी ही चव नाही.'
        : 'In a world of mass production, we choose patience. From sun-drying to hand-crafting, our slow and traditional processes lock in the authentic village flavors that factory machines simply destroy.'
    },
    {
      icon: Sparkles,
      title: language === 'mr' ? 'नेहमी ताजे आणि दर्जेदार' : 'Fresh & Quality Tested',
      desc: language === 'mr'
        ? 'आम्ही महिनोनमहिने गोदामात साठा करून ठेवत नाही. गरजेनुसार छोट्या बॅचेसमध्ये अत्यंत स्वच्छतेने ताजे पदार्थ बनवले जातात. त्यामुळे पाकीट उघडताच तुम्हाला येईल तो अस्सल गावरान सुगंध!'
        : 'We don\'t stock up in warehouses for months. Your food is prepared in small, fresh batches with strict hygiene. The moment you open the packet, the authentic village aroma will win your heart.'
    }
  ];

  return (
    <section id="why-us" className="py-20 w-full bg-black/40 border-y border-white/5 backdrop-blur-sm">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-md">
            {t('whyUsTitle')}
          </h2>
          <p className="text-lg text-[#D4AF37] max-w-2xl mx-auto font-medium">
            {language === 'mr' ? 'आमची उत्पादने एकदा का खावीत?' : 'Bringing authentic village food to every table with pride'}
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="p-8 md:p-10 rounded-2xl bg-[#2C1810]/60 backdrop-blur-md border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:bg-[#2C1810]/80 transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] group"
              >
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="shrink-0 p-4 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37]/20 transition-transform duration-300 border border-[#D4AF37]/30"
                  >
                    <Icon size={32} />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                      {reason.title}
                    </h3>
                    {/* मजकुराची लांबी वाढवली आहे आणि वाचायला सोपा केला आहे */}
                    <p className="text-gray-300 leading-relaxed text-base md:text-[17px] font-medium opacity-90">
                      {reason.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent p-12 rounded-3xl border border-[#D4AF37]/20 backdrop-blur-md"
        >
          {[
            { number: '500+', label: t('customersServed'), sub: language === 'mr' ? 'आनंदी कुटुंबे' : 'Happy Families' },
            { number: '100%', label: t('chemicalFree'), sub: language === 'mr' ? 'शुद्धतेची हमी' : 'Purity Guaranteed' },
            { number: '5+', label: t('yearsOfTrust'), sub: language === 'mr' ? 'वर्षांचा अनुभव' : 'Years of Experience' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-black text-[#D4AF37] mb-2 drop-shadow-md">
                {stat.number}
              </div>
              <p className="text-white font-bold text-lg">{stat.label}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}