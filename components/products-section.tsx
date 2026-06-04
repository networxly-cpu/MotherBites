'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

export default function ProductsSection() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  return (
    <section id="products" className="py-20 bg-background/50">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            All Products
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Explore our complete range of authentic village specialties
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 lg:gap-8 w-full">
            {products.map((product, index) => {
              const mainImage = product.image_urls && product.image_urls.length > 0
                 ? product.image_urls[0]
                 : (product.image_url || 'https://images.unsplash.com/photo-1599599810694-b5ac4dd33e2d?w=400&h=400&fit=crop');

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="bg-card backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    
                    {/* फक्त फोटो आणि नावाला Link मध्ये टाकले आहे */}
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="relative aspect-square overflow-hidden bg-black/20">
                        <img
                          src={mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {product.category && (
                          <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full shadow-lg z-10">
                            {product.category}
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-5 flex-1 flex flex-col">
                      <Link href={`/product/${product.id}`} className="block mb-2">
                        <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-foreground/60 mb-3 line-clamp-2 flex-1">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className="fill-primary text-primary" />
                          ))}
                        </div>
                        <span className="text-xs text-foreground/60">(50+)</span>
                      </div>

                      {/* बटणे आता Link च्या बाहेर आहेत (म्हणून काम करतील!) */}
                      <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
                        <div>
                          <span className="text-2xl font-bold text-secondary">₹{product.price}</span>
                          {product.weight && <span className="text-xs text-gray-500 ml-2">({product.weight})</span>}
                        </div>
                        
                        <div className="flex gap-2 relative z-20">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: mainImage
                              });
                              alert('प्रॉडक्ट कार्टमध्ये ऍड झाले!');
                            }} 
                            className="px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 flex items-center justify-center cursor-pointer"
                          >
                            <ShoppingCart size={20} />
                          </button>
                          
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: mainImage
                              });
                              router.push('/checkout');
                            }}
                            className="px-4 py-2 rounded-lg bg-[#C85A3A] text-white font-bold hover:bg-[#A6452B] transition-colors shadow-lg cursor-pointer"
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
    </section>
  );
}