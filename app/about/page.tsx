'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';
import { Heart, Sun, Users, UtensilsCrossed } from 'lucide-react';

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <main className="w-full overflow-x-hidden bg-transparent font-sans">
      <Navbar />

      {/* Hero Header - Background with Story 1 */}
      <section className="relative w-full h-[60vh] flex items-center justify-center pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="/story-1.jpg" 
            alt="Village Tradition" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008] via-[#1a1008]/80 to-[#1a1008]/40"></div>
        </div>
        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-[#D4AF37] drop-shadow-lg mb-6 tracking-tight"
          >
            {language === 'mr' ? 'आमची माती, आमची चव' : 'Our Roots, Our Taste'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-3xl text-gray-300 font-serif italic max-w-4xl mx-auto leading-relaxed"
          >
            {language === 'mr' 
              ? '"मशीनच्या युगात हरवलेली आईच्या हातची ती अस्सल चव शोधण्याचा एक प्रवास..."' 
              : '"A journey to find a mother\'s lost recipe in the age of machines..."'}
          </motion.p>
        </div>
      </section>

      {/* The Story Sections */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 text-[#FEF5E7] space-y-32">
        
        {/* Story Part 1: The Beginning (Image 1) */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.15)] border border-white/10 relative">
              <img src="/story-1.jpg" alt="MotherBites Mission" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#C85A3A] mb-6 border-l-4 border-[#D4AF37] pl-6 leading-tight">
              {language === 'mr' ? 'शहराच्या गर्दीत हरवलेली गावाची आठवण' : 'A Yearning for Home in the Bustling City'}
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed font-medium text-justify">
              <p>
                {language === 'mr' 
                  ? 'कामानिमित्त जेव्हा आपण घर सोडून शहरात येतो, तेव्हा सगळ्यात जास्त कशाची आठवण येत असेल, तर ती म्हणजे घरच्या जेवणाची. बाहेरचं पिझ्झा, बर्गर कितीही खाल्लं तरी पोट भरतं, पण मन भरत नाही. दुकानातून आणलेल्या रंगीत प्लास्टिकच्या पाकिटांमधल्या पदार्थांना आकार अगदी अचूक असतो, पण त्यात ती आईच्या हातची चव नसते. सगळं काही मोठ्या फॅक्टरीमध्ये, निर्जीव मशीनवर बनवलेलं असतं. जिथे हजारो किलो पीठ एकाच वेळी मळलं जातं, तिथे प्रेमाचा स्पर्श कसा असणार?' 
                  : 'When we leave our homes for the city, the one thing we crave the most is home-cooked food. No matter how much pizza or burger we eat, the soul remains empty. The colorful plastic packets in supermarkets have perfectly shaped products, but they lack the authentic taste. Everything is made in huge factories on automated, lifeless machines. Where thousands of kilos of dough are kneaded at once, how can there be a touch of a mother\'s love?'}
              </p>
              <p>
                {language === 'mr'
                  ? 'वेल्हाणे सारख्या छोट्याशा गावातून शहरात आल्यावर, हीच उणीव तीव्रतेने जाणवली. एक दिवस असा आला जेव्हा जाणवलं की आपली संस्कृती, आपले पारंपरिक पदार्थ फक्त जुन्या आठवणीत राहू नयेत. ते पुन्हा प्रत्येक घरात पोहोचले पाहिजेत. इथूनच "MotherBites" चा जन्म झाला. हा फक्त एक व्यवसाय नाही, तर आपल्या मातीशी आणि परंपरेशी जोडलेली नाळ पुन्हा घट्ट करण्याचा एक प्रामाणिक प्रयत्न आहे.'
                  : 'Coming from a small village like Velhane to the city, this absence was deeply felt. One day, we realized that our culture and traditional foods shouldn\'t just remain memories. They need to reach every home again. That\'s where "MotherBites" was born. It is not just a business; it is an honest effort to rebuild the unbreakable bond with our roots and traditions.'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Story Part 2: The Chulha & Grandmother (Image 2) */}
        <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(200,90,58,0.2)] border border-white/10">
              <img src="/story-2.jpg" alt="Grandmother cooking on mud stove" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-6 border-r-4 border-[#C85A3A] pr-6 text-right leading-tight">
              {language === 'mr' ? 'चुलीचा धूर आणि आजीच्या हातांची माया' : 'The Mud Stove and Grandmother\'s Love'}
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed font-medium text-justify">
              <p>
                {language === 'mr'
                  ? 'तुम्ही कधी आजीला चुलीवर जेवण बनवताना पाहिलंय? तिच्या सुरकुतलेल्या हातांमध्ये एक वेगळीच जादू असते. चुलीच्या धुराने डोळ्यांतून पाणी येत असतं, लाकडाची धग चेहऱ्यावर बसत असते, तरीही तिच्या चेहऱ्यावर कुटुंबाला खाऊ घालण्याचं एक विलक्षण समाधान असतं. कोणताही गॅस किंवा मायक्रोवेव्ह त्या मातीच्या चुलीची आणि लाकडाच्या जळणाची चव कधीच देऊ शकत नाही.'
                  : 'Have you ever watched a grandmother cook on a traditional mud stove (chulha)? There is a distinct magic in her wrinkled hands. Despite the smoke bringing tears to her eyes and the intense heat of the firewood hitting her face, she wears a profound smile of satisfaction knowing she is feeding her family. No modern gas stove or microwave can ever replicate that smoky flavor of the earth and firewood.'}
              </p>
              <p>
                {language === 'mr'
                  ? 'MotherBites मध्ये आम्ही याच परंपरेचा सन्मान करतो. आमची रेसिपी कोणत्याही फूड लॅबमध्ये बनलेली नाही, तर ती पिढ्यानपिढ्या एका आईकडून दुसऱ्या आईकडे चालत आलेली एक अनमोल संपत्ती आहे. तोच अस्सल गावरान मसाला, तीच भाजणीची पद्धत आणि तेच निःस्वार्थ प्रेम! जेव्हा तुम्ही आमचे पदार्थ खाता, तेव्हा तुम्हाला त्यात फक्त चव नाही, तर या माऊलींच्या कष्टाची आणि प्रेमाची उब जाणवते.'
                  : 'At MotherBites, we honor this very tradition. Our recipes are not formulated in a food lab; they are a priceless treasure passed down from one mother to another over generations. The same authentic rustic spices, the exact traditional roasting methods, and that same selfless love! When you taste our food, you don\'t just experience the flavor, but the very warmth and hardship of these loving mothers.'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Story Part 3: Traditional Process (Image 3) */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.15)] border border-white/10">
              <img src="/story-3.jpg" alt="Traditional Wooden Kurdai Press" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#C85A3A] mb-6 border-l-4 border-[#D4AF37] pl-6 leading-tight">
              {language === 'mr' ? 'लाकडी साचा आणि कडक उन्हाची साक्ष' : 'The Wooden Press & The Sun\'s Witness'}
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed font-medium text-justify">
              <p>
                {language === 'mr'
                  ? 'आजच्या काळात बटण दाबलं की सेकंदात हजारो कुरडया पाडणाऱ्या मशीन्स उपलब्ध आहेत. पण आम्ही तो मार्ग निवडला नाही. हा लाकडी आणि पितळी साचा बघितलात? याला चालवण्यासाठी खूप ताकद आणि संयम लागतो. हाताने जेव्हा या साच्यातून नाजूक तार खाली पडते, तेव्हा त्याला जो नैसर्गिक पोत (Texture) मिळतो, तो कोणतीही मशीन देऊ शकत नाही.'
                  : 'In today\'s world, there are machines that can extrude thousands of Kurdais in seconds with the push of a button. But we refused to take that path. Have you seen this traditional wooden and brass press? Operating it requires immense strength and patience. The natural texture that forms when the delicate strands fall from this hand-pressed tool is something no automated machine can ever achieve.'}
              </p>
              <p>
                {language === 'mr'
                  ? 'चीक शिजवण्यापासून ते कडक उन्हात एक-एक कुरडई वाळत घालण्यापर्यंतचा प्रवास खूप कष्टाचा असतो. जळगावच्या कडक उन्हात हे पदार्थ नैसर्गिकरीत्या वाळवले जातात. सूर्याची किरणे या पदार्थांमधली आर्द्रता शोषून घेतात आणि त्यांना एक दीर्घायुष्य देतात, तेही कोणत्याही केमिकल प्रिझर्व्हेटिव्हशिवाय! हा निसर्गाचा आणि मानवी कष्टाचा एक सुंदर संगम आहे, जो आम्ही जतन केला आहे.'
                  : 'The journey from cooking the fermented wheat extract (Cheek) to laying down each Kurdai under the scorching sun is full of rigorous labor. Dried naturally under the intense Jalgaon heat, the sun\'s rays absorb the moisture and give these products a long shelf-life, absolutely without any chemical preservatives! It is a beautiful harmony of nature and human effort that we have preserved.'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Story Part 4: Community & Empowerment (Image 4) */}
        <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(200,90,58,0.2)] border border-white/10 relative">
              <img src="/story-4.jpg" alt="Women tossing papads together" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-6 border-r-4 border-[#C85A3A] pr-6 text-right leading-tight">
              {language === 'mr' ? 'एकत्रित कुटुंब, एक स्वाभिमानी चळवळ' : 'A United Family, A Movement of Pride'}
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed font-medium text-justify">
              <p>
                {language === 'mr'
                  ? 'पापड उडवतानाचा हा क्षण बघा... हे फक्त काम नाहीये, तर हा गावाकडच्या एकत्र कुटुंबाचा एक गोड उत्सव आहे. सकाळी लवकर उठून जेव्हा गावातल्या महिला एकत्र येतात, तेव्हा अंगणात फक्त लाटण्यांचा आवाज घुमत नाही, तर एकमेकांच्या सुख-दुःखाच्या गप्पा, हास्य आणि गाणी घुमतात. हे आमचं फॅक्टरी युनिट नाही, हे एक मोठं कुटुंब आहे!'
                  : 'Look at the moment these papads are being tossed... This isn\'t just labor; it is a sweet celebration of the village\'s extended family. When women gather early in the morning, the courtyard doesn\'t just echo with the sound of rolling pins, but with shared stories, laughter, and folk songs. This is not our factory unit; this is one massive, united family!'}
              </p>
              <p>
                {language === 'mr'
                  ? 'MotherBites ने या ग्रामीण महिलांना फक्त रोजगार दिला नाही, तर एक ओळख आणि स्वाभिमान दिला आहे. ज्या हातांनी आयुष्यभर निमूटपणे चूल आणि मूल सांभाळलं, तेच हात आज त्यांच्या स्वतःच्या पायावर खंबीरपणे उभे आहेत. जेव्हा तुम्ही आमचं एखादं पाकीट खरेदी करता, तेव्हा तुम्ही फक्त एका उत्तम चवीचे पैसे देत नसता, तर तुम्ही एका खेड्यातील कुटुंबाला जगण्याचं बळ देत असता. त्यांचा हा स्वाभिमान आणि तुमच्या आरोग्याची काळजी हीच आमची खरी कमाई आहे.'
                  : 'MotherBites hasn\'t just provided employment to these rural women; it has given them an identity and pride. The hands that silently managed the hearth and children all their lives are now standing strong and financially independent. When you buy a packet from us, you aren\'t just paying for great taste; you are empowering a village family to live with dignity. Their pride and your health are our truest earnings.'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Part 5: The Promise (Kept Exactly Same as Before) */}
        <div className="pt-16 pb-12">
          <div className="bg-gradient-to-br from-[#2C1810]/90 to-[#1a1008] p-8 md:p-16 rounded-[3rem] border border-[#D4AF37]/30 backdrop-blur-md text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <h2 className="text-4xl md:text-5xl font-black text-[#D4AF37] mb-8 drop-shadow-md">
              {language === 'mr' ? 'आमचे वचन' : 'Our Promise to You'}
            </h2>
            <p className="text-2xl md:text-3xl text-white leading-relaxed font-serif italic mb-12 max-w-5xl mx-auto drop-shadow-lg">
              {language === 'mr'
                ? '"जेव्हा तुम्ही MotherBites चं पाकीट उघडाल, तेव्हा त्यातून फक्त पापड किंवा कुरडई बाहेर येणार नाही, तर त्यातून येईल तो चुलीचा धूर, जळगावच्या मातीचा सुवास आणि एका आईच्या प्रेमाची उब. तुमच्या आरोग्याशी आणि चवीशी आम्ही कधीही तडजोड करणार नाही, हे आमचं वचन आहे."'
                : '"When you open a packet of MotherBites, you won\'t just find a papad or kurdai inside, you will experience the essence of a traditional mud stove, the fragrance of Jalgaon\'s soil, and the warmth of a mother\'s love. We will never compromise on your health and taste, that is our promise."'}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-[#D4AF37]/20">
              <div className="flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-[#C85A3A]/20 p-5 rounded-full text-[#C85A3A] shadow-inner"><Heart size={40} /></div>
                <span className="font-bold text-gray-200 text-lg md:text-xl">{language === 'mr' ? 'हातांनी बनवलेले' : '100% Handmade'}</span>
              </div>
              <div className="flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-[#D4AF37]/20 p-5 rounded-full text-[#D4AF37] shadow-inner"><Sun size={40} /></div>
                <span className="font-bold text-gray-200 text-lg md:text-xl">{language === 'mr' ? 'उन्हात वाळवलेले' : 'Sun-Dried'}</span>
              </div>
              <div className="flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-green-500/20 p-5 rounded-full text-green-500 shadow-inner"><UtensilsCrossed size={40} /></div>
                <span className="font-bold text-gray-200 text-lg md:text-xl">{language === 'mr' ? 'कोणतेही केमिकल नाही' : 'Zero Chemicals'}</span>
              </div>
              <div className="flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
                <div className="bg-blue-500/20 p-5 rounded-full text-blue-500 shadow-inner"><Users size={40} /></div>
                <span className="font-bold text-gray-200 text-lg md:text-xl">{language === 'mr' ? 'महिला सक्षमीकरण' : 'Empowering Women'}</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      <Footer />
    </main>
  );
}