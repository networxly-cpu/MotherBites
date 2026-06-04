'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Mail, Phone, Lock, CheckCircle2, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [identifier, setIdentifier] = useState(''); // Email किंवा Mobile साठी एकच रकाना
  const [inputType, setInputType] = useState<'email' | 'phone' | null>(null);
  
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // युझरने टाईप केल्यावर आपोआप ओळखणे (Email की Mobile)
  useEffect(() => {
    if (identifier.includes('@')) {
      setInputType('email');
    } else if (/[0-9]{10}/.test(identifier)) {
      setInputType('phone');
    } else {
      setInputType(null);
    }
  }, [identifier]);

  // पासवर्ड व्हॅलिडेशन (Min 6, Max 12, 1 Small, 1 Capital, 1 Digit)
  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,12}$/;
    return regex.test(pass);
  };

  // ---------------- MOBILE & PASSWORD LOGIC ----------------
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!validatePassword(password)) {
      setMessage('पासवर्ड ६-१२ अक्षरांचा असावा, त्यात किमान १ कॅपिटल, १ स्मॉल अक्षर आणि १ नंबर असणे आवश्यक आहे.');
      setLoading(false);
      return;
    }

    try {
      // 1. आधी लॉगिन करायचा प्रयत्न करा
      const { error: signInError } = await supabase.auth.signInWithPassword({
        phone: identifier,
        password: password,
      });

      if (signInError) {
        // जर अकाउंट नसेल (Invalid credentials), तर नवीन अकाउंट बनवा (SignUp)
        if (signInError.message.includes('Invalid login credentials')) {
          const { error: signUpError } = await supabase.auth.signUp({
            phone: identifier,
            password: password,
          });
          
          if (signUpError) {
            // जर पासवर्ड चुकला असेल आणि आधीच अकाउंट असेल तर हा एरर येईल
            if (signUpError.message.includes('already registered')) {
               throw new Error('चुकीचा पासवर्ड! कृपया पुन्हा प्रयत्न करा.');
            }
            throw signUpError;
          }
          alert('नवीन अकाउंट यशस्वीरित्या बनले आहे!');
          onClose();
        } else {
          throw signInError;
        }
      } else {
        // लॉगिन यशस्वी
        onClose(); 
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EMAIL OTP LOGIC ----------------
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: identifier });
      if (error) throw error;
      setOtpSent(true);
      setMessage('तुमच्या ईमेलवर OTP पाठवला आहे!');
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.verifyOtp({ email: identifier, token: otp, type: 'email' });
      if (error) throw error;
      onClose();
    } catch (error: any) {
      setMessage('चुकीचा OTP. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#2C1810] border border-[#D4AF37]/20 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/20 p-2 rounded-full transition z-10">
            <X size={20} />
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-[#D4AF37] mb-1 tracking-wide">MotherBites</h2>
              <p className="text-gray-400 text-sm">Log in or Sign up</p>
            </div>

            {message && (
              <div className="mb-4 p-3 rounded-lg bg-black/30 border border-[#D4AF37]/30 text-[#D4AF37] text-xs text-center">
                {message}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* Smart Input (Email or Mobile) */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider">Mobile Number or Email</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-3 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    disabled={otpSent}
                    value={identifier} 
                    onChange={(e) => setIdentifier(e.target.value)} 
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-[#D4AF37] disabled:opacity-50" 
                    placeholder="Enter Email or 10-digit Mobile" 
                  />
                </div>
              </div>

              {/* जर मोबाईल असेल तर पासवर्ड विचारणार */}
              {inputType === 'phone' && (
                <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider">Password (Login / Set New)</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-[#D4AF37]" placeholder="Minimum 6 chars (Aa1...)" />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">If account doesn't exist, a new one will be created.</p>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-[#C85A3A] text-white font-bold py-3 rounded-lg hover:bg-[#A6452B] transition shadow-lg disabled:opacity-50">
                    {loading ? 'Processing...' : 'Continue'}
                  </button>
                </form>
              )}

              {/* जर ईमेल असेल तर OTP ची प्रोसेस */}
              {inputType === 'email' && (
                <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
                  {otpSent && (
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider">Enter 6-Digit OTP</label>
                      <div className="relative">
                        <CheckCircle2 className="absolute left-3 top-3 text-gray-500" size={18} />
                        <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-[#D4AF37] tracking-widest text-center text-lg" placeholder="• • • • • •" maxLength={6} />
                      </div>
                    </div>
                  )}
                  <button type="submit" disabled={loading} className="w-full bg-[#C85A3A] text-white font-bold py-3 rounded-lg hover:bg-[#A6452B] transition shadow-lg disabled:opacity-50">
                    {loading ? 'Processing...' : (otpSent ? 'Verify & Login' : 'Send OTP')}
                  </button>
                </form>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}