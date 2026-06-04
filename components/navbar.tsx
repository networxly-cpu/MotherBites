'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Search, LogOut, Package, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';
import LanguageToggle from './language-toggle';
import { useRouter } from 'next/navigation';
import LoginModal from './login-modal';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/lib/cart-context';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // 1. Session State आणि Dropdown State
  const [session, setSession] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const router = useRouter();
  const { t } = useLanguage();

  // 2. युझर लॉगिन आहे का ते चेक करणे
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Logout फंक्शन
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.refresh();
  };

  // 4. Smart Search फंक्शन (आता हे खरंच काम करेल)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    
    if (!query) return;

    // जर युझरने वेबसाईटचे पेजेस सर्च केले, तर तिथे पाठवा
    if (query.includes('about') || query.includes('story')) {
      router.push('/about');
    } else if (query.includes('contact') || query.includes('help')) {
      router.push('/contact');
    } else if (query.includes('b2b') || query.includes('bulk') || query.includes('wholesale')) {
      router.push('/#bulk-orders');
    } else if (query.includes('home')) {
      router.push('/');
    } else {
      // प्रॉडक्ट सर्च केले असतील, तर Shop पेजवर पाठवा
      router.push(`/shop?search=${encodeURIComponent(query)}`);
    }
    
    setSearchQuery(''); // सर्च झाल्यावर डबा रिकामा करणे
    setIsOpen(false); // मोबाईल मेनू उघडा असेल तर तो बंद करणे
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4 w-full">
            
            {/* डावी बाजू: MB लोगो काढला आहे, फक्त Search Bar ठेवलाय */}
            <div className="flex items-center gap-4 flex-1">
              <div className="hidden md:flex w-full max-w-md">
                <form onSubmit={handleSearch} className="relative w-full flex items-center">
                  <input 
                    type="text" 
                    placeholder="Search products, pages..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="w-full bg-background border border-border text-foreground px-4 py-2 pl-10 rounded-lg outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all" 
                  />
                  <Search className="absolute left-3 text-foreground/50" size={18} />
                  <button type="submit" className="hidden">Search</button>
                </form>
              </div>
            </div>

            {/* मधली जागा: पूर्णपणे रिकामी */}
            <div className="hidden lg:block flex-1"></div>

            {/* उजवी बाजू: सर्व Links आणि Icons (सगळे Bold केलेत) */}
            <div className="flex items-center justify-end gap-4 sm:gap-6 flex-1">
              
              {/* Links */}
              <div className="hidden lg:flex items-center gap-6 pr-4 border-r border-border">
                <Link href="/" className="text-foreground hover:text-primary transition-colors font-bold">Home</Link>
                <Link href="/shop" className="text-foreground hover:text-primary transition-colors font-bold">{t('shop')}</Link>
                <Link href="/about" className="text-foreground hover:text-primary transition-colors font-bold">{t('about')}</Link>
                <Link href="/#bulk-orders" className="text-foreground hover:text-primary transition-colors font-bold">B2B Orders</Link>
                <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-bold">{t('contact')}</Link>
              </div>

              {/* Icons (Language, Cart, User) */}
              <div className="flex items-center gap-2 sm:gap-4 relative">
                <div className="hidden lg:block"><LanguageToggle /></div>
                
                <Link href="/cart">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative p-2 text-foreground hover:text-primary transition-colors">
                    <ShoppingCart size={24} />
                    {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
                  </motion.button>
                </Link>

                {/* User Icon & Dropdown Logic */}
                <div className="relative hidden sm:block">
                  <motion.button
                    onClick={() => session ? setIsDropdownOpen(!isDropdownOpen) : setIsLoginModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 transition-colors flex items-center gap-2 ${session ? 'text-[#D4AF37]' : 'text-foreground hover:text-primary'}`}
                  >
                    <User size={24} />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && session && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-[#2C1810] border border-[#D4AF37]/20 rounded-xl shadow-2xl overflow-hidden flex flex-col z-50"
                      >
                        <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 transition">
                          <UserCircle size={18} className="text-[#D4AF37]" /> My Profile
                        </Link>
                        <Link href="/orders" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 transition border-t border-white/5">
                          <Package size={18} className="text-[#D4AF37]" /> My Orders
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/10 transition border-t border-white/5 w-full text-left">
                          <LogOut size={18} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-foreground">
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="lg:hidden border-t border-border py-4 space-y-3 bg-background shadow-xl">
              <div className="px-4 pb-2 md:hidden">
                <form onSubmit={handleSearch} className="relative flex items-center">
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="w-full bg-background border border-border text-foreground px-4 py-2 pl-10 rounded-lg outline-none focus:border-primary" 
                  />
                  <Search className="absolute left-3 top-2.5 text-foreground/50" size={18} />
                  <button type="submit" className="hidden">Search</button>
                </form>
              </div>

              {/* Mobile Links (सगळे Bold केलेत) */}
              <Link href="/" className="block px-4 py-2 text-foreground hover:text-primary font-bold" onClick={() => setIsOpen(false)}>Home</Link>
              <Link href="/shop" className="block px-4 py-2 text-foreground hover:text-primary font-bold" onClick={() => setIsOpen(false)}>{t('shop')}</Link>
              <Link href="/about" className="block px-4 py-2 text-foreground hover:text-primary font-bold" onClick={() => setIsOpen(false)}>{t('about')}</Link>
              <Link href="/#bulk-orders" className="block px-4 py-2 text-foreground hover:text-primary font-bold" onClick={() => setIsOpen(false)}>B2B Orders</Link>
              <Link href="/contact" className="block px-4 py-2 text-foreground hover:text-primary font-bold" onClick={() => setIsOpen(false)}>{t('contact')}</Link>
              
              {/* Mobile Account / Dropdown Logic */}
              <div className="border-t border-border mt-4 pt-4 px-4 space-y-2">
                {!session ? (
                  <button onClick={() => { setIsOpen(false); setIsLoginModalOpen(true); }} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-bold">
                    Login / Sign Up
                  </button>
                ) : (
                  <>
                    <p className="text-sm text-[#D4AF37] font-bold mb-2">My Account</p>
                    <Link href="/profile" className="flex items-center gap-2 text-foreground py-2 font-bold" onClick={() => setIsOpen(false)}><UserCircle size={18}/> My Profile</Link>
                    <Link href="/orders" className="flex items-center gap-2 text-foreground py-2 font-bold" onClick={() => setIsOpen(false)}><Package size={18}/> My Orders</Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 py-2 w-full text-left font-bold"><LogOut size={18}/> Logout</button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}