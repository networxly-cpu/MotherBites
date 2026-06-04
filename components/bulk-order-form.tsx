'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Send, Building2, PackageCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function BulkOrderForm() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    productId: '',
    quantity: '5'
  });

  const quantityOptions = Array.from({ length: 20 }, (_, i) => (i + 1) * 5);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('id, name');
      if (data) setProducts(data);
    }
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Supabase च्या 'bulk_enquiries' टेबलमध्ये डेटा पाठवणे
      const { error } = await supabase.from('bulk_enquiries').insert([
        {
          customer_name: formData.name,
          phone: formData.phone,
          product_id: formData.productId,
          quantity_kg: parseInt(formData.quantity),
          address: formData.address,
          status: 'New'
        }
      ]);

      if (error) throw error;

      alert(language === 'mr' ? 'तुमची बल्क ऑर्डर इन्क्वायरी पाठवली गेली आहे. आम्ही लवकरच संपर्क करू!' : 'Your bulk order inquiry has been sent successfully! We will contact you soon.');
      
      // फॉर्म रिकामा करणे
      setFormData({ name: '', phone: '', address: '', productId: '', quantity: '5' });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // इथे id="bulk-orders" लावला आहे, ज्यामुळे Navbar मधून थेट इथे येता येईल
    <section id="bulk-orders" className="py-20 bg-gradient-to-b from-transparent to-[#1a1008] border-t border-white/5 relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#2C1810]/80 rounded-[3rem] border border-[#D4AF37]/30 backdrop-blur-md overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          
          {/* डावी बाजू - माहिती */}
          <div className="w-full lg:w-2/5 bg-black/40 p-10 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-8">
              <Building2 size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              {language === 'mr' ? 'मोठ्या ऑर्डर्ससाठी चौकशी' : 'Bulk & B2B Orders'}
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              {language === 'mr' 
                ? 'लग्नसमारंभ, हॉटेल्स किंवा दुकानासाठी आमचे अस्सल गावरान पदार्थ मोठ्या प्रमाणात हवे आहेत? फॉर्म भरा आणि विशेष होलसेल सवलत (Discount) मिळवा!' 
                : 'Need our authentic village products in large quantities for weddings, hotels, or retail? Fill out the form and get special wholesale discounts!'}
            </p>
            <ul className="space-y-4 text-gray-300 font-medium">
              <li className="flex items-center gap-3"><PackageCheck className="text-[#D4AF37]" size={20} /> Minimum order 5 KG</li>
              <li className="flex items-center gap-3"><PackageCheck className="text-[#D4AF37]" size={20} /> Special wholesale pricing</li>
              <li className="flex items-center gap-3"><PackageCheck className="text-[#D4AF37]" size={20} /> Direct village transport</li>
            </ul>
          </div>

          {/* उजवी बाजू - फॉर्म */}
          <div className="w-full lg:w-3/5 p-10 md:p-16">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37]" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile Number</label>
                  <input type="tel" required maxLength={10} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37]" placeholder="10-digit number" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Select Product</label>
                <select required value={formData.productId} onChange={(e) => setFormData({...formData, productId: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] appearance-none">
                  <option value="" disabled>-- Select a product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#2C1810] text-white">{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Quantity (in KG)</label>
                <select required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] appearance-none">
                  {quantityOptions.map((kg) => (
                    <option key={kg} value={kg} className="bg-[#2C1810] text-white">{kg} KG</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Full Delivery Address</label>
                <textarea required rows={3} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] resize-none" placeholder="Enter shop/hotel name and full address..."></textarea>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting}
                className="w-full bg-[#D4AF37] text-[#2C1810] py-4 rounded-xl font-black text-lg hover:bg-[#e0c25c] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : <><Send size={20} /> Submit Enquiry</>}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}