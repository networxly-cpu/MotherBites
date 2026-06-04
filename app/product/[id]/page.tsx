'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft, ShieldCheck, Zap, Star, UserCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import { useCart } from '@/lib/cart-context';

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]); // खरी रेटिंग्स
  const [loading, setLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState('');
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        // प्रॉडक्ट आणणे
        const { data: mainProduct, error } = await supabase.from('products').select('*').eq('id', params.id).single();
        if (error) throw error;
        
        if (mainProduct) {
          setProduct(mainProduct);
          setActiveImage(mainProduct.image_urls?.[0] || mainProduct.image_url || 'https://images.unsplash.com/photo-1599599810694-b5ac4dd33e2d?w=400&h=400&fit=crop');
          
          // समान प्रॉडक्ट्स आणणे
          const { data: similarData } = await supabase
            .from('products')
            .select('*')
            .eq('category', mainProduct.category)
            .neq('id', mainProduct.id)
            .limit(8);
          if (similarData) setSimilarProducts(similarData);

          // या प्रॉडक्टचे खरे 'Reviews' डेटाबेसमधून आणणे
          const { data: reviewsData } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', mainProduct.id)
            .order('created_at', { ascending: false });
          if (reviewsData) setReviews(reviewsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#1a1008]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D4AF37]"></div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-white">Product Not Found</div>
      </>
    );
  }

  const allImages = product.image_urls?.length > 0 ? product.image_urls : [product.image_url].filter(Boolean);
  
  // Average Rating Calculation
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#1a1008] text-[#FEF5E7] pt-28 pb-12 font-sans">
        <div className="w-full px-4 mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link href="/shop" className="inline-flex items-center text-gray-400 hover:text-[#D4AF37] mb-6 transition-colors">
            <ArrowLeft className="mr-2" size={20} /> Back to Products
          </Link>

          {/* MAIN PRODUCT SECTION */}
          <div className="bg-[#2C1810]/50 border border-white/5 rounded-3xl p-6 lg:p-10 shadow-2xl backdrop-blur-sm mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              
              {/* Left: Images */}
              <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
                {allImages.length > 1 && (
                  <div className="flex md:flex-col gap-3 overflow-x-auto md:w-20 scrollbar-hide">
                    {allImages.map((img: string, idx: number) => (
                      <button key={idx} onClick={() => setActiveImage(img)} className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#D4AF37]' : 'border-transparent opacity-60'}`}>
                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex-1 h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-black/40 relative">
                  <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Right: Details */}
              <div className="flex flex-col">
                <span className="text-[#C85A3A] font-bold uppercase text-sm mb-2">{product.category}</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">{product.name}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-600 text-white px-2 py-0.5 rounded text-sm font-bold flex items-center gap-1">
                    {avgRating} <Star size={12} className="fill-white"/>
                  </span>
                  <span className="text-gray-400 text-sm">
                    {reviews.length > 0 ? `${reviews.length} Verified Reviews` : 'No reviews yet, be the first!'}
                  </span>
                </div>
                
                <div className="flex items-end gap-3 mb-6 pb-6 border-b border-white/10">
                  <span className="text-5xl font-black text-[#D4AF37]">₹{product.price}</span>
                  {product.weight && <span className="text-lg text-gray-400 mb-1">({product.weight})</span>}
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-2">Product Description</h3>
                  <div className={`prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap ${!showFullDesc ? 'line-clamp-3' : ''}`}>
                    {product.description}
                  </div>
                  <button 
                    onClick={() => setShowFullDesc(!showFullDesc)} 
                    className="text-blue-400 font-medium mt-2 hover:text-blue-300 flex items-center"
                  >
                    {showFullDesc ? 'Show Less' : 'Read more...'}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      addToCart({ id: product.id, name: product.name, price: product.price, image: activeImage });
                      alert('प्रॉडक्ट कार्टमध्ये ऍड झाले!');
                    }}
                    className="bg-[#ff9f00] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#e08e00] shadow-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCart size={22} /> Add to Cart
                  </button>
                  
                  <button 
                    onClick={() => {
                      addToCart({ id: product.id, name: product.name, price: product.price, image: activeImage });
                      router.push('/checkout');
                    }}
                    className="bg-[#fb641b] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#e05817] shadow-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Zap size={22} /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SIMILAR PRODUCTS SECTION */}
          {similarProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Similar Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {similarProducts.map((simProd) => (
                  <Link href={`/product/${simProd.id}`} key={simProd.id} className="group bg-[#2C1810]/50 rounded-xl overflow-hidden border border-white/5 hover:border-[#D4AF37]/50 transition-all">
                    <div className="h-40 md:h-48 overflow-hidden bg-black/20">
                      <img src={simProd.image_urls?.[0] || simProd.image_url} alt={simProd.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white line-clamp-1">{simProd.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xl font-bold text-[#D4AF37]">₹{simProd.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS SECTION */}
          {/* REVIEWS SECTION */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Ratings & Reviews</h2>
            
            {reviews.length === 0 ? (
              <div className="bg-[#2C1810]/30 p-8 rounded-xl border border-white/5 text-center">
                <Star size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No reviews yet for this product. Order now and be the first to review!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-[#2C1810]/40 p-6 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded text-sm font-bold flex items-center gap-1 text-white ${rev.rating >= 4 ? 'bg-green-600' : rev.rating === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                        {rev.rating} <Star size={12} className="fill-white"/>
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed whitespace-pre-wrap">{rev.review_text}</p>
                    
                    {/* जर कस्टमरने फोटो टाकला असेल तर तो इथे दिसेल */}
                    {rev.image_url && (
                      <div className="mb-4">
                        <img 
                          src={rev.image_url} 
                          alt="Customer Review" 
                          className="w-24 h-24 object-cover rounded-lg border border-[#D4AF37]/30 hover:scale-105 transition-transform cursor-pointer" 
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-t border-white/10 pt-3">
                      <UserCircle size={16} className="text-gray-400" />
                      <span className="text-gray-300">{rev.user_name}</span>
                      <span className="mx-1">•</span>
                      <span className="flex items-center text-green-400/80"><ShieldCheck size={12} className="mr-1"/> Certified Buyer</span>
                      <span className="mx-1">•</span>
                      <span>{new Date(rev.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}