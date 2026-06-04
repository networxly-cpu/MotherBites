'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1a1008] flex flex-col items-center justify-center font-sans px-4 text-center">
      <AlertCircle size={80} className="text-[#C85A3A] mb-6" />
      <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] mb-4">404 - Page Not Found</h1>
      <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
        भाऊ, तुम्ही चुकीच्या लिंकवर आला आहात. हे पेज अजून बनलेलं नाही किंवा डिलीट झालं आहे.
      </p>
      <Link href="/">
        <button className="bg-[#D4AF37] text-[#2C1810] px-8 py-3 rounded-lg font-bold hover:bg-[#ebd578] transition shadow-lg">
          होम पेजवर परत जा
        </button>
      </Link>
    </div>
  );
}