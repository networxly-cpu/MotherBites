'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- सिक्युरिटी लेव्हल १: डिव्हाइस चेक (फक्त तुझ्याच लॅपटॉपवर उघडेल) ---
    const deviceKey = localStorage.getItem('ADMIN_DEVICE_KEY');
    if (deviceKey !== 'MotherBites@Secure2026') {
      setError('Access Denied: You are not authorized to login from this device.');
      setLoading(false);
      return; 
    }
    // -----------------------------------------------------------------

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.push('/admin');
    } catch (err: any) {
      setError('चुकीचा ईमेल किंवा पासवर्ड.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1008] flex items-center justify-center p-4">
      <div className="bg-[#2C1810] p-8 rounded-xl border border-[#D4AF37]/30 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Admin Login</h1>
          <p className="text-gray-400 text-sm">Secure Access Only</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
               type="email"
               required
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full bg-black/50 border border-white/10 rounded p-3 text-white outline-none focus:border-[#D4AF37]"
               placeholder="admin@motherbites.com"
             />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
               type="password"
               required
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full bg-black/50 border border-white/10 rounded p-3 text-white outline-none focus:border-[#D4AF37]"
               placeholder="********"
            />
          </div>

          <button
             type="submit"
             disabled={loading}
            className="mt-4 w-full py-3 bg-[#C85A3A] text-white font-bold rounded hover:bg-[#A6452B] transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}