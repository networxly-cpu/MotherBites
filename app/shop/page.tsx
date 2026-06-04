'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Search, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';

export default function ShopPage() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        if (data) setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // कॅटेगरीज काढणे (Duplicates काढून)
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  // सर्च आणि कॅटेगरीनुसार प्रॉडक्ट्स फिल्टर करणे
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-transparent font-sans flex flex-col">
      <Navbar />

      {/* Shop Header */}
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-[#D4AF37] mb-4 drop-shadow-lg">
            {language === 'mr' ? 'आमची उत्पादने' : 'Our Authentic Range'}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            {language === 'mr' 
              ? '१००% नैसर्गिक, हातसडीचे आणि प्रेमाने बनवलेले गावाकडचे पदार्थ.' 
              : '100% natural, handmade village products prepared with love.'}
          </p>
        </div>
      </div>

      {/* Shop Content (Filters & Products) */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-[#2C1810]/50 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 text-[#D4AF37] mr-2">
              <Filter size={20} /> <span className="font-bold hidden sm:inline">Filter:</span>
            </div>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === cat 
                    ? 'bg-[#D4AF37] text-[#2C1810] shadow-[0_0_10px_rgba(212,175,55,0.4)]' 
                    : 'bg-black/40 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={language === 'mr' ? 'पदार्थ शोधा...' : 'Search products...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/20 text-white rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37]"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 bg-black/20 rounded-3xl border border-white/5">
            <ShoppingCart size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
            <p className="text-gray-400">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
            {filteredProducts.map((product, index) => {
              const mainImage = product.image_urls?.[0] || product.image_url || 'https://images.unsplash.com/photo-1599599810694-b5ac4dd33e2d?w=400&h=400&fit=crop';
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index % 10) * 0.05 }}
                  className="group relative"
                >
                  <div className="bg-[#2C1810]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]/50 transition-all duration-300 h-full flex flex-col">
                    
                    {/* Image Area */}
                    <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-black/40">
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008] to-transparent opacity-60"></div>
                      
                      {product.category && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-[#D4AF37] text-[#2C1810] text-xs font-black rounded-full shadow-lg z-10">
                          {product.category}
                        </div>
                      )}
                    </Link>

                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col relative z-20">
                      <Link href={`/product/${product.id}`} className="block mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-1 mb-3">
                        <div className="bg-green-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <span className="text-white text-xs font-bold">4.8</span>
                          <Star size={10} className="fill-white text-white" />
                        </div>
                        <span className="text-xs text-gray-400 ml-1">(120+)</span>
                      </div>

                      <div className="flex-1"></div> {/* Spacer */}

                      {/* Price & Actions */}
                      <div className="border-t border-white/10 pt-4 mt-2">
                        <div className="flex items-end gap-2 mb-4">
                          <span className="text-3xl font-black text-[#D4AF37]">₹{product.price}</span>
                          {product.weight && <span className="text-sm text-gray-400 mb-1">({product.weight})</span>}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart({ id: product.id, name: product.name, price: product.price, image: mainImage });
                              alert('Product added to cart successfully!');
                            }}
                            className="p-3 rounded-xl bg-white/5 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors border border-white/10 flex items-center justify-center shrink-0"
                            title="Add to Cart"
                          >
                            <ShoppingCart size={22} />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart({ id: product.id, name: product.name, price: product.price, image: mainImage });
                              router.push('/checkout');
                            }}
                            className="flex-1 py-3 rounded-xl bg-[#C85A3A] text-white font-bold hover:bg-[#A6452B] transition-colors shadow-lg text-center"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}