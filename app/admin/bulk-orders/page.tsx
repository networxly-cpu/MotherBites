'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Building2, Phone, MapPin, Calendar, Package, Clock, CheckCircle2, ShoppingCart, Users, LogOut, Inbox, PhoneCall, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BulkOrdersAdmin() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('New');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  async function checkAdminAccess() {
    // १. सिक्रेट डिव्हाइस की चेक करा
    const deviceKey = localStorage.getItem('ADMIN_DEVICE_KEY');
    if (deviceKey !== 'MotherBites@Secure2026') {
      router.push('/admin/login');
      return;
    }

    // २. लॉगिन सेशन चेक करा
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
      return;
    }

    // दोन्ही बरोबर असेल तरच डेटा आणा
    fetchEnquiries();
  }

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bulk_enquiries')
        .select(`*, products ( name )`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setEnquiries(data);
    } catch (error) {
      console.error('Error fetching bulk enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, currentStatus: string) => {
    let newStatus = 'New';
    if (currentStatus === 'New') newStatus = 'Contacted';
    else if (currentStatus === 'Contacted') newStatus = 'Completed';
    else return; 

    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('bulk_enquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setEnquiries(prev => prev.map(enq => enq.id === id ? { ...enq, status: newStatus } : enq));
      
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Status अपडेट करताना एरर आली.');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  const filteredEnquiries = enquiries.filter(enq => {
    if (activeTab === 'New') return enq.status === 'New';
    if (activeTab === 'Contacted') return enq.status === 'Contacted';
    if (activeTab === 'Completed') return enq.status === 'Completed';
    return true;
  });

  return (
    <div className="flex h-screen bg-[#1a1008] text-[#FEF5E7] overflow-hidden w-full font-sans">
      
      {/* 1. Left Sidebar (Fixed) */}
      <aside className="w-64 bg-[#2C1810] border-r border-white/10 flex flex-col flex-shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-white/10 bg-black/20">
          <h1 className="text-2xl font-black text-[#D4AF37] tracking-wider">MotherBites</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Menu</p>
          
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <ShoppingCart size={20} /> <span className="font-medium">Orders</span>
          </Link>
          
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <Package size={20} /> <span className="font-medium">Products</span>
          </Link>

          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <Users size={20} /> <span className="font-medium">Users / Customers</span>
          </Link>

          {/* Active Tab */}
          <Link href="/admin/bulk-orders" className="flex items-center gap-3 px-4 py-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg transition-colors border border-[#D4AF37]/20">
            <Building2 size={20} /> <span className="font-bold">B2B Enquiries</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <LogOut size={20} /> <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#1a1008] relative">
        
        {/* Top Header - Admin Details */}
        <header className="h-20 bg-[#2C1810]/50 border-b border-white/10 flex items-center justify-between px-8 flex-shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">B2B / Bulk Enquiries</h2>
            <button onClick={fetchEnquiries} className="bg-black/30 border border-white/10 text-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-white/5 transition text-sm">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
          
          <div className="flex items-center gap-4 bg-black/20 px-4 py-2 rounded-full border border-white/5">
            <div className="text-right hidden sm:block">
              <p className="text-white font-bold text-sm leading-tight">Dinesh Patil</p>
              <p className="text-[#D4AF37] text-xs font-medium uppercase tracking-wide">CEO & Admin</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C85A3A] flex items-center justify-center text-[#2C1810] font-black shadow-lg">
              DP
            </div>
          </div>
        </header>

        {/* Content Area (Sidebar + Cards) */}
        <div className="flex-1 overflow-y-auto p-8 w-full scrollbar-hide">
          <div className="max-w-[1400px] mx-auto">
            
            <div className="flex flex-col md:flex-row gap-6 w-full">
              
              {/* Inner Sidebar for Tabs */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-[#2C1810]/80 rounded-xl border border-white/10 overflow-hidden shadow-xl sticky top-0">
                  <div className="p-4 border-b border-white/10">
                    <h2 className="text-gray-400 font-bold uppercase tracking-wider text-xs">Enquiry Status</h2>
                  </div>
                  <ul className="flex flex-col p-2 space-y-1">
                    <li>
                      <button onClick={() => setActiveTab('New')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === 'New' ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-bold' : 'text-gray-300 hover:bg-white/5'}`}>
                        <span className="flex items-center gap-3"><Inbox size={18} /> New Requests</span>
                        <span className="bg-black/40 px-2 py-0.5 rounded text-xs">{enquiries.filter(e => e.status === 'New').length}</span>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setActiveTab('Contacted')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === 'Contacted' ? 'bg-blue-500/20 text-blue-400 font-bold' : 'text-gray-300 hover:bg-white/5'}`}>
                        <span className="flex items-center gap-3"><PhoneCall size={18} /> Contacted</span>
                        <span className="bg-black/40 px-2 py-0.5 rounded text-xs">{enquiries.filter(e => e.status === 'Contacted').length}</span>
                      </button>
                    </li>
                    <div className="border-t border-white/5 my-2"></div>
                    <li>
                      <button onClick={() => setActiveTab('Completed')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === 'Completed' ? 'bg-green-500/20 text-green-400 font-bold' : 'text-gray-300 hover:bg-white/5'}`}>
                        <span className="flex items-center gap-3"><CheckCircle2 size={18} /> Completed</span>
                        <span className="bg-black/40 px-2 py-0.5 rounded text-xs">{enquiries.filter(e => e.status === 'Completed').length}</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Main Area: Enquiries Cards */}
              <div className="flex-1 min-w-0">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {activeTab === 'New' && 'New Enquiry Requests'}
                    {activeTab === 'Contacted' && 'Follow-up / Contacted Enquiries'}
                    {activeTab === 'Completed' && 'Successfully Closed Deals'}
                    <span className="text-sm font-normal text-gray-400 ml-2">({filteredEnquiries.length} found)</span>
                  </h2>
                </div>

                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#D4AF37]"></div>
                  </div>
                ) : filteredEnquiries.length === 0 ? (
                  <div className="bg-[#2C1810]/50 border border-white/5 rounded-3xl p-16 text-center shadow-xl">
                    <Building2 size={64} className="mx-auto text-gray-500 mb-6" />
                    <p className="text-gray-400 text-lg">No enquiries found in this section.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {filteredEnquiries.map((enq, index) => (
                      <motion.div 
                        key={enq.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-[#2C1810] border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-[#D4AF37]/40 transition-colors flex flex-col h-full"
                      >
                        {/* Card Header (Status & Date) */}
                        <div className="px-6 py-4 bg-black/30 border-b border-white/5 flex justify-between items-center">
                          <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm
                            ${enq.status === 'New' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                              enq.status === 'Contacted' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                              'bg-green-500/20 text-green-400 border border-green-500/30'}`}
                          >
                            {enq.status === 'New' && <Clock size={12} />}
                            {enq.status === 'Contacted' && <Phone size={12} />}
                            {enq.status === 'Completed' && <CheckCircle2 size={12} />}
                            {enq.status}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Calendar size={14} /> {formatDate(enq.created_at)}
                          </div>
                        </div>

                        {/* Card Body (Customer Info) */}
                        <div className="p-6 space-y-5 flex-1">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{enq.customer_name}</h3>
                            <a href={`tel:${enq.phone}`} className="inline-flex items-center gap-2 text-[#D4AF37] hover:underline font-medium">
                              <Phone size={16} /> {enq.phone}
                            </a>
                          </div>

                          <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Product Requirement</p>
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-white font-medium flex items-center gap-2">
                                <Package size={16} className="text-[#C85A3A]" /> 
                                {enq.products?.name || 'Unknown Product'}
                              </p>
                              <p className="text-[#D4AF37] font-black shrink-0">{enq.quantity_kg} KG</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
                              <MapPin size={12} /> Delivery Address
                            </p>
                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{enq.address}</p>
                          </div>
                        </div>

                        {/* Card Footer (Action Button) */}
                        <div className="p-6 pt-0 mt-auto">
                          {enq.status === 'New' && (
                            <button 
                              disabled={updatingId === enq.id}
                              onClick={() => updateStatus(enq.id, enq.status)}
                              className="w-full py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 bg-[#C85A3A] hover:bg-[#A6452B] text-white disabled:opacity-50"
                            >
                              {updatingId === enq.id ? 'Updating...' : 'Mark as Contacted'}
                            </button>
                          )}
                          {enq.status === 'Contacted' && (
                            <button 
                              disabled={updatingId === enq.id}
                              onClick={() => updateStatus(enq.id, enq.status)}
                              className="w-full py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#e0c25c] text-[#2C1810] disabled:opacity-50"
                            >
                              {updatingId === enq.id ? 'Updating...' : 'Mark as Completed'}
                            </button>
                          )}
                          {enq.status === 'Completed' && (
                            <div className="w-full py-3 rounded-xl bg-green-500/10 text-green-500 font-bold border border-green-500/20 text-center flex items-center justify-center gap-2">
                              <CheckCircle2 size={18} /> Deal Closed
                            </div>
                          )}
                        </div>

                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}