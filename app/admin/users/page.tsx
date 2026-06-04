'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Package, ShoppingCart, Users, LogOut, UserCircle, Mail, Phone, Calendar, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    fetchCustomers();
  }

  async function fetchCustomers() {
    setLoading(true);
    try {
      // ऑर्डर्स टेबलवरून आपण ग्राहकांचा डेटा काढत आहोत
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      
      if (error) throw error;

      if (data) {
        // एकाच ग्राहकाने २-३ वेळा ऑर्डर केली असेल, तर ते एकत्र करण्यासाठी Logic
        const customerMap = new Map();

        data.forEach(order => {
          // ईमेल किंवा फोन नंबरवरून ग्राहकाला ओळखणे
          const key = order.account_email || order.customer_phone || order.customer_name;
          
          if (!customerMap.has(key)) {
            customerMap.set(key, {
              id: key,
              name: order.customer_name,
              email: order.account_email || order.customer_email || 'Not Provided',
              phone: order.customer_phone || order.account_phone || 'Not Provided',
              address: order.delivery_address,
              totalOrders: 0,
              totalSpent: 0,
              firstOrderDate: order.created_at,
              lastOrderDate: order.created_at
            });
          }

          const cust = customerMap.get(key);
          cust.totalOrders += 1;
          cust.totalSpent += Number(order.total_amount);
          
          // शेवटच्या ऑर्डरची तारीख अपडेट करणे
          if (new Date(order.created_at) > new Date(cust.lastOrderDate)) {
            cust.lastOrderDate = order.created_at;
          }
        });

        // Map ला Array मध्ये कन्व्हर्ट करून सेट करणे
        setCustomers(Array.from(customerMap.values()));
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

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

          {/* Active Tab */}
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg transition-colors border border-[#D4AF37]/20">
            <Users size={20} /> <span className="font-bold">Users / Customers</span>
          </Link>

          {/* New Bulk Orders Tab */}
          <Link href="/admin/bulk-orders" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <Building2 size={20} /> <span className="font-medium">B2B Enquiries</span>
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
          <div>
            <h2 className="text-2xl font-bold text-white">Customers Management</h2>
            <p className="text-sm text-gray-400">Total Registered Customers: {customers.length}</p>
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

        {/* Content (Customers Table) */}
        <div className="flex-1 overflow-y-auto p-8 w-full scrollbar-hide">
          <div className="max-w-[1400px] mx-auto">
            
            <div className="bg-[#2C1810]/60 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-black/40 text-gray-400 uppercase tracking-wider text-xs border-b border-white/10">
                    <tr>
                      <th className="p-5 font-semibold">Customer Profile</th>
                      <th className="p-5 font-semibold">Contact Info</th>
                      <th className="p-5 font-semibold">Address</th>
                      <th className="p-5 font-semibold">Total Orders</th>
                      <th className="p-5 font-semibold text-right">Total Spent (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr><td colSpan={5} className="p-10 text-center text-gray-400">Loading customers data...</td></tr>
                    ) : customers.length === 0 ? (
                      <tr><td colSpan={5} className="p-10 text-center text-gray-400">No customers found.</td></tr>
                    ) : (
                      customers.map((cust, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          
                          {/* Profile & Name */}
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C1810] to-gray-800 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                                <UserCircle size={24} />
                              </div>
                              <div>
                                <p className="font-bold text-white text-base">{cust.name}</p>
                                <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                                  <Calendar size={10} /> Last Order: {formatDate(cust.lastOrderDate)}
                                </p>
                              </div>
                            </div>
                          </td>
                          
                          {/* Contact */}
                          <td className="p-5">
                            <div className="space-y-1.5">
                              <p className="text-gray-300 text-sm flex items-center gap-2">
                                <Mail size={14} className="text-[#D4AF37]" /> {cust.email}
                              </p>
                              <p className="text-gray-300 text-sm flex items-center gap-2">
                                <Phone size={14} className="text-[#D4AF37]" /> {cust.phone}
                              </p>
                            </div>
                          </td>
                          
                          {/* Address */}
                          <td className="p-5">
                            <p className="text-gray-400 text-sm truncate max-w-[250px]" title={cust.address}>
                              {cust.address}
                            </p>
                          </td>
                          
                          {/* Total Orders Badge */}
                          <td className="p-5">
                            <span className="bg-[#C85A3A]/20 text-[#C85A3A] border border-[#C85A3A]/30 px-3 py-1 rounded-full font-bold">
                              {cust.totalOrders} Orders
                            </span>
                          </td>
                          
                          {/* Total Spent */}
                          <td className="p-5 text-right">
                            <span className="text-[#D4AF37] font-black text-lg">₹{cust.totalSpent}</span>
                          </td>
                          
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}