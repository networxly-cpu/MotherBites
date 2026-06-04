'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Link from 'next/link';
import { Package, ArrowLeft, Clock, CheckCircle2, LockKeyhole, Star, UploadCloud } from 'lucide-react';
import LoginModal from '@/components/login-modal';

// --- वेगळा Review Form Component जो प्रत्येक Delivered प्रॉडक्ट खाली दिसेल ---
function ReviewForm({ item, session }: { item: any, session: any }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // आधीच रिव्ह्यू दिलाय का हे चेक करण्यासाठी States
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [checking, setChecking] = useState(true);

  // पेज लोड झाल्यावर चेक करा की या युझरने या प्रॉडक्टला आधी रिव्ह्यू दिलाय का?
  useEffect(() => {
    async function checkExistingReview() {
      if (!session?.user) {
        setChecking(false);
        return;
      }

      const userEmail = session.user.email || session.user.phone;
      
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id')
          .eq('product_id', item.id)
          .eq('user_email', userEmail)
          .limit(1); // इथे limit(1) लावले आहे जेणेकरून मल्टीपल रिव्ह्यू असले तरी एरर येणार नाही

        // जर १ जरी रिव्ह्यू सापडला, तर alreadyReviewed ला true करा
        if (data && data.length > 0) {
          setAlreadyReviewed(true);
        }
      } catch (err) {
        console.error("Error checking review:", err);
      } finally {
        setChecking(false);
      }
    }

    checkExistingReview();
  }, [item.id, session]);

  // 1. Text Validation: फक्त Letters, Digits, Spaces आणि . , / : ( ) &
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const regex = /^[a-zA-Z0-9\s.,/:\(\)&\n]*$/;
    if (regex.test(val)) {
      setReviewText(val);
    }
  };

  // 2. Image Validation: फक्त .jpg आणि .png
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert('फक्त .jpg आणि .png फॉरमॅटच अलाऊड आहे!');
        e.target.value = '';
      }
    }
  };

  const submitReview = async () => {
    if (rating === 0) {
      alert('कृपया स्टार रेटिंग द्या!');
      return;
    }
    if (!reviewText.trim()) {
      alert('कृपया तुमचा अभिप्राय (Review) लिहा!');
      return;
    }

    setSubmitting(true);
    try {
      let uploadedImageUrl = null;

      // फोटो असेल तर आधी Storage मध्ये अपलोड करा
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('review-images')
          .getPublicUrl(fileName);
        
        uploadedImageUrl = publicUrl;
      }

      // डेटाबेसमध्ये रिव्ह्यू सेव्ह करा
      const { error } = await supabase.from('reviews').insert([{
        product_id: item.id,
        user_name: session.user.user_metadata?.full_name || 'Verified Customer',
        user_email: session.user.email || session.user.phone,
        rating: rating,
        review_text: reviewText,
        image_url: uploadedImageUrl
      }]);

      if (error) throw error;
      
      // हे ट्रू केल्यामुळे फॉर्म लगेच लपेल आणि हिरवा मेसेज दिसेल
      setSubmitted(true); 
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("रिव्ह्यू सबमिट करताना एरर आला. कृपया पुन्हा प्रयत्न करा.");
    } finally {
      setSubmitting(false);
    }
  };

  // जर चेक करत असेल तर लोडिंग दाखवा
  if (checking) {
    return <div className="mt-4 text-xs text-gray-500">Checking review status...</div>;
  }

  // जर आधीच रिव्ह्यू दिला असेल किंवा आता नवीन सबमिट केला असेल, तर हा हिरवा बॉक्स दिसेल (फॉर्म दिसणार नाही)
  if (submitted || alreadyReviewed) {
    return (
      <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
        <CheckCircle2 size={24} className="text-green-500 shrink-0" />
        <div>
          <p className="text-green-400 font-bold">खूप खूप धन्यवाद!</p>
          <p className="text-sm text-gray-400">या प्रॉडक्टसाठी तुमचा अभिप्राय आमच्याकडे सेव्ह आहे.</p>
        </div>
      </div>
    );
  }

  // जर रिव्ह्यू दिला नसेल, तरच फॉर्म दिसेल
  return (
    <div className="mt-4 p-5 bg-[#1a1008] border border-[#D4AF37]/30 rounded-xl shadow-inner">
      <h4 className="text-[#D4AF37] font-bold text-sm mb-3">Rate your experience with this product:</h4>
      
      {/* Star Rating */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} onClick={() => setRating(star)} className="focus:outline-none transform hover:scale-110 transition-transform">
            <Star size={28} className={star <= rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-600"} />
          </button>
        ))}
      </div>

      {/* Review Text */}
      <textarea 
        rows={3} 
        value={reviewText}
        onChange={handleTextChange}
        placeholder="Write your review here... (Allowed special characters: . , / : () &)"
        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-[#D4AF37] resize-none mb-4"
      ></textarea>

      {/* Photo Upload & Submit Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="cursor-pointer bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/10 px-4 py-2 rounded-lg text-sm text-gray-300 font-medium transition-colors flex items-center gap-2">
            <UploadCloud size={16} />
            {imageFile ? 'Change Photo' : 'Add Photo (Optional)'}
            <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageChange} className="hidden" />
          </label>
          
          {imagePreview && (
            <div className="w-10 h-10 rounded overflow-hidden border border-[#D4AF37] shrink-0">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <button 
          onClick={submitReview}
          disabled={submitting || rating === 0}
          className="w-full sm:w-auto bg-[#C85A3A] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#A6452B] transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
}
// -------------------------------------------------------------------------

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchMyOrders(session);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchMyOrders(session);
        setIsLoginModalOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchMyOrders(currentSession: any) {
    setLoading(true);
    try {
      const email = currentSession.user.email;
      const phone = currentSession.user.phone;

      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      
      if (email && phone) {
        query = query.or(`account_email.eq.${email},account_phone.eq.${phone}`);
      } else if (email) {
        query = query.eq('account_email', email);
      } else if (phone) {
        query = query.eq('account_phone', phone);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#1a1008] text-[#FEF5E7] pt-28 pb-12 font-sans">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
            <Link href="/" className="p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors text-gray-400 hover:text-[#D4AF37]">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-[#D4AF37] flex items-center gap-3">
                <Package size={32} /> My Orders
              </h1>
              <p className="text-gray-400 text-sm mt-1">Track and manage your recent orders</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#D4AF37]"></div>
            </div>
          ) : !session ? (
            <div className="bg-[#2C1810]/50 border border-white/5 rounded-3xl p-12 text-center shadow-xl max-w-lg mx-auto backdrop-blur-md">
              <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <LockKeyhole size={40} className="text-[#D4AF37]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Secure Access</h2>
              <p className="text-gray-400 mb-8 text-lg">Please log in to view and track your orders.</p>
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-[#C85A3A] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#A6452B] transition-all shadow-lg text-lg w-full sm:w-auto"
              >
                Login / Sign Up
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-[#2C1810]/50 border border-white/5 rounded-3xl p-12 text-center shadow-xl backdrop-blur-md">
              <Package size={64} className="mx-auto text-gray-500 mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">No Orders Found</h2>
              <p className="text-gray-400 mb-8">Looks like you haven't placed any orders yet.</p>
              <Link href="/shop">
                <button className="bg-[#D4AF37] text-[#2C1810] px-8 py-3 rounded-xl font-bold hover:bg-[#e0c25c] transition-all shadow-lg">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-[#2C1810]/80 border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-lg hover:border-[#D4AF37]/50 transition-colors backdrop-blur-sm">
                  
                  {/* Order Header */}
                  <div className="bg-black/40 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5">
                    <div className="flex flex-col sm:flex-row sm:gap-8 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Order ID</p>
                        <p className="text-white font-mono font-bold">{order.order_id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Order Date</p>
                        <p className="text-white font-medium">{formatDate(order.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Total Amount</p>
                        <p className="text-[#D4AF37] font-black text-lg">₹{order.total_amount}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-sm
                        ${order.order_status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                          order.order_status === 'Confirmed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                          order.order_status === 'Shipped' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 
                          order.order_status === 'Delivered' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                          'bg-red-500/20 text-red-400 border border-red-500/30'}`
                      }>
                        {order.order_status === 'Pending' && <Clock size={14} />}
                        {order.order_status === 'Delivered' && <CheckCircle2 size={14} />}
                        {order.order_status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-6">
                      {order.items && order.items.map((item: any, index: number) => (
                        <div key={index} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <Link href={`/product/${item.id}`} className="text-white font-bold hover:text-[#D4AF37] transition-colors">{item.name}</Link>
                                <p className="text-gray-400 text-sm">Qty: {item.quantity} × ₹{item.price}</p>
                              </div>
                            </div>
                            <div className="text-[#D4AF37] font-bold text-lg">
                              ₹{item.price * item.quantity}
                            </div>
                          </div>

                          {/* नेहमी ओपन असणारा Rating Form (फक्त डिलिव्हर झाल्यावर दिसेल) */}
                          {order.order_status === 'Delivered' && (
                            <ReviewForm item={item} session={session} />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-dashed border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Delivery Address:</p>
                        <p className="text-white text-sm line-clamp-1 max-w-md">{order.delivery_address}</p>
                      </div>
                      <p className="text-sm text-gray-400 shrink-0">Payment: <strong className="text-[#D4AF37] uppercase">{order.payment_mode}</strong></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <Footer />
    </>
  );
}