'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { motion } from 'framer-motion';
import { UserCircle, Mail, Phone, MapPin, Save, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LoginModal from '@/components/login-modal';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // फॉर्म डेटा
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    // युझर चेक करणे
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadUserProfile(session.user);
        setIsLoginModalOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // प्रोफाईल डेटा लोड करणे
  async function loadUserProfile(user: any) {
    setLoading(true);
    try {
      // इथे आपण user_metadata मधून डेटा घेतोय
      setFormData({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        address: user.user_metadata?.address || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  // प्रोफाईल अपडेट करणे
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address
        }
      });

      if (error) throw error;
      alert('प्रोफाईल यशस्वीरित्या अपडेट झाले! (Profile Updated Successfully!)');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert('प्रोफाईल अपडेट करताना एरर आली: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1a1008] text-[#FEF5E7] font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
          <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
            <UserCircle size={40} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#D4AF37]">My Profile</h1>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-500" /> Secure Account Settings
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#D4AF37]"></div>
          </div>
        ) : !session ? (
          /* जर लॉगिन नसेल तर */
          <div className="bg-[#2C1810]/50 border border-white/5 rounded-3xl p-12 text-center shadow-xl backdrop-blur-md">
            <UserCircle size={64} className="mx-auto text-gray-500 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">You are not logged in</h2>
            <p className="text-gray-400 mb-8">Please log in to view and update your profile.</p>
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-[#D4AF37] text-[#2C1810] px-10 py-3 rounded-xl font-bold hover:bg-[#e0c25c] transition-all shadow-lg"
            >
              Login to Continue
            </button>
          </div>
        ) : (
          /* प्रोफाईल फॉर्म */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2C1810]/60 border border-[#D4AF37]/20 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md"
          >
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <UserCircle size={16} /> Full Name
                  </label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email (Disabled / Read-only) */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Mail size={16} /> Email Address
                  </label>
                  <input 
                    type="email" 
                    disabled
                    value={formData.email}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed.</p>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Phone size={16} /> Phone Number
                  </label>
                  <input 
                    type="tel" 
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    placeholder="Enter 10-digit number"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-2 pt-4 border-t border-white/5">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <MapPin size={16} /> Default Delivery Address
                </label>
                <textarea 
                  rows={4}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none"
                  placeholder="Enter your full home address for faster checkout..."
                ></textarea>
              </div>

              {/* Save Button */}
              <div className="pt-6 flex justify-end">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-[#C85A3A] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#A6452B] transition-all shadow-[0_0_15px_rgba(200,90,58,0.3)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                  ) : (
                    <><Save size={20} /> Save Changes</>
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        )}
      </div>

      {/* लॉगिन मोडल */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <Footer />
    </main>
  );
}