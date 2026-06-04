'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Clock, CheckCircle2, Truck, RefreshCw, Package, RotateCcw, XCircle, ListChecks, ShoppingCart, Users, Building2, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Pending');
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
    fetchOrders();
  }

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string, orderDetails: any) => {
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId);
        
      if (error) {
        alert("Database Update Failed!");
        throw error;
      }

      setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));

      if (orderDetails.account_email) {
        const res = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderDetails.order_id,
            customerName: orderDetails.customer_name,
            customerEmail: orderDetails.account_email,
            items: orderDetails.items,
            totalAmount: orderDetails.total_amount,
            orderStatus: newStatus
          })
        });
        
        if (res.ok) alert(`✅ Order marked as '${newStatus}' and Email sent successfully to customer!`);
        else alert(`❌ Order marked as '${newStatus}', but failed to send Email.`);
      } else {
        alert(`✅ Order marked as '${newStatus}'!`);
      }
      
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Pending') return order.order_status === 'Pending';
    if (activeTab === 'Shipping') return order.order_status === 'Confirmed';
    if (activeTab === 'Delivery') return order.order_status === 'Shipped';
    if (activeTab === 'Delivered') return order.order_status === 'Delivered';
    if (activeTab === 'Returned') return order.order_status === 'Returned';
    if (activeTab === 'Canceled') return order.order_status === 'Canceled';
    return true;
  });

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
          
          {/* Active Tab */}
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg transition-colors border border-[#D4AF37]/20">
            <ShoppingCart size={20} /> <span className="font-bold">Orders</span>
          </Link>
          
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <Package size={20} /> <span className="font-medium">Products</span>
          </Link>

          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <Users size={20} /> <span className="font-medium">Users / Customers</span>
          </Link>

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
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Orders Management</h2>
            <button onClick={fetchOrders} className="bg-black/30 border border-white/10 text-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-white/5 transition text-sm">
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 w-full scrollbar-hide">
          <div className="max-w-[1400px] mx-auto">
            
            {/* Orders Layout (Inner Tabs + Table) */}
            <div className="flex flex-col md:flex-row gap-6 w-full">
              
              {/* Inner Sidebar for Status Tabs */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-[#2C1810]/80 rounded-xl border border-white/10 overflow-hidden shadow-xl sticky top-0">
                  <div className="p-4 border-b border-white/10">
                    <h2 className="text-gray-400 font-bold uppercase tracking-wider text-xs">Order Categories</h2>
                  </div>
                  <ul className="flex flex-col p-2 space-y-1">
                    <li>
                      <button onClick={() => setActiveTab('Pending')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === 'Pending' ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-bold' : 'text-gray-300 hover:bg-white/5'}`}>
                        <span className="flex items-center gap-3"><Clock size={18} /> Pending</span>
                        <span className="bg-black/40 px-2 py-0.5 rounded text-xs">{orders.filter(o => o.order_status === 'Pending').length}</span>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setActiveTab('Shipping')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === 'Shipping' ? 'bg-blue-500/20 text-blue-400 font-bold' : 'text-gray-300 hover:bg-white/5'}`}>
                        <span className="flex items-center gap-3"><Package size={18} /> Ready to Ship</span>
                        <span className="bg-black/40 px-2 py-0.5 rounded text-xs">{orders.filter(o => o.order_status === 'Confirmed').length}</span>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setActiveTab('Delivery')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === 'Delivery' ? 'bg-indigo-500/20 text-indigo-400 font-bold' : 'text-gray-300 hover:bg-white/5'}`}>
                        <span className="flex items-center gap-3"><Truck size={18} /> Out for Delivery</span>
                        <span className="bg-black/40 px-2 py-0.5 rounded text-xs">{orders.filter(o => o.order_status === 'Shipped').length}</span>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setActiveTab('Delivered')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === 'Delivered' ? 'bg-green-500/20 text-green-400 font-bold' : 'text-gray-300 hover:bg-white/5'}`}>
                        <span className="flex items-center gap-3"><ListChecks size={18} /> Delivered</span>
                        <span className="bg-black/40 px-2 py-0.5 rounded text-xs">{orders.filter(o => o.order_status === 'Delivered').length}</span>
                      </button>
                    </li>
                    <div className="border-t border-white/5 my-2"></div>
                    <li>
                      <button onClick={() => setActiveTab('Returned')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === 'Returned' ? 'bg-orange-500/20 text-orange-400 font-bold' : 'text-gray-300 hover:bg-white/5'}`}>
                        <span className="flex items-center gap-3"><RotateCcw size={18} /> Returned</span>
                        <span className="bg-black/40 px-2 py-0.5 rounded text-xs">{orders.filter(o => o.order_status === 'Returned').length}</span>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setActiveTab('Canceled')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === 'Canceled' ? 'bg-red-500/20 text-red-400 font-bold' : 'text-gray-300 hover:bg-white/5'}`}>
                        <span className="flex items-center gap-3"><XCircle size={18} /> Canceled</span>
                        <span className="bg-black/40 px-2 py-0.5 rounded text-xs">{orders.filter(o => o.order_status === 'Canceled').length}</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Inner Table Area */}
              <div className="flex-1 min-w-0 bg-[#2C1810]/50 rounded-xl border border-white/10 overflow-hidden shadow-2xl h-fit">
                <div className="p-4 border-b border-white/10 bg-[#2C1810]/80">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {activeTab === 'Pending' && 'Pending Orders'}
                    {activeTab === 'Shipping' && 'Ready to Ship (Confirmed)'}
                    {activeTab === 'Delivery' && 'Out for Delivery (Shipped)'}
                    {activeTab === 'Delivered' && 'Completed Orders'}
                    {activeTab === 'Returned' && 'Returned Orders'}
                    {activeTab === 'Canceled' && 'Canceled Orders'}
                    <span className="text-sm font-normal text-gray-400 ml-2">({filteredOrders.length} found)</span>
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap lg:whitespace-normal">
                    <thead className="bg-[#2C1810] text-gray-400 uppercase tracking-wider text-xs border-b border-white/10">
                      <tr>
                        <th className="p-4 min-w-[150px]">Order ID & Date</th>
                        <th className="p-4 min-w-[200px]">Customer Details</th>
                        <th className="p-4 min-w-[200px]">Items & Amount</th>
                        <th className="p-4 text-right min-w-[150px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                        <tr><td colSpan={4} className="p-8 text-center text-gray-400">Loading orders...</td></tr>
                      ) : filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-12 text-center">
                            <div className="text-gray-500 mb-2 flex justify-center"><Package size={48} /></div>
                            <p className="text-gray-400 text-lg">No orders in this section.</p>
                          </td>
                        </tr>
                      ) : filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                          
                          <td className="p-4 align-top">
                            <div className="font-mono font-bold text-[#D4AF37]">{order.order_id}</div>
                            <div className="text-gray-400 text-xs mt-1">{formatDate(order.created_at)}</div>
                          </td>
                          
                          <td className="p-4 align-top">
                            <div className="font-bold text-white">{order.customer_name}</div>
                            <div className="text-gray-400 text-xs mt-1">{order.customer_phone}</div>
                            <div className="text-gray-500 text-xs mt-1 line-clamp-2" title={order.delivery_address}>{order.delivery_address}</div>
                          </td>
                          
                          <td className="p-4 align-top">
                            <div className="text-[#C85A3A] font-bold text-lg mb-1">
                              ₹{order.total_amount} <span className="text-xs font-normal text-gray-500 uppercase">({order.payment_mode})</span>
                            </div>
                            <div className="text-gray-400 text-xs space-y-1">
                              {order.items && order.items.map((item: any, idx: number) => (
                                <div key={idx} className="truncate">• {item.name} (x{item.quantity})</div>
                              ))}
                            </div>
                          </td>
                          
                          <td className="p-4 align-top text-right space-x-2 space-y-2">
                            {activeTab === 'Pending' && (
                              <div className="flex flex-col gap-2 items-end">
                                <button disabled={updatingId === order.id} onClick={() => handleStatusChange(order.id, 'Confirmed', order)} className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-700 transition w-full sm:w-auto">
                                  {updatingId === order.id ? 'Updating...' : 'Confirm Order'}
                                </button>
                                <button disabled={updatingId === order.id} onClick={() => handleStatusChange(order.id, 'Canceled', order)} className="bg-red-600/20 text-red-500 border border-red-500/50 px-4 py-2 rounded text-xs font-bold hover:bg-red-600 hover:text-white transition w-full sm:w-auto">
                                  Cancel Order
                                </button>
                              </div>
                            )}

                            {activeTab === 'Shipping' && (
                              <div className="flex flex-col gap-2 items-end">
                                <button disabled={updatingId === order.id} onClick={() => handleStatusChange(order.id, 'Shipped', order)} className="bg-indigo-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-indigo-700 transition w-full sm:w-auto">
                                  Mark as Shipped
                                </button>
                                <button disabled={updatingId === order.id} onClick={() => handleStatusChange(order.id, 'Canceled', order)} className="bg-red-600/20 text-red-500 border border-red-500/50 px-4 py-2 rounded text-xs font-bold hover:bg-red-600 hover:text-white transition w-full sm:w-auto">
                                  Cancel Order
                                </button>
                              </div>
                            )}

                            {activeTab === 'Delivery' && (
                              <div className="flex flex-col gap-2 items-end">
                                <button disabled={updatingId === order.id} onClick={() => handleStatusChange(order.id, 'Delivered', order)} className="bg-green-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-green-700 transition w-full sm:w-auto">
                                  Mark as Delivered
                                </button>
                                <button disabled={updatingId === order.id} onClick={() => handleStatusChange(order.id, 'Returned', order)} className="bg-orange-600/20 text-orange-500 border border-orange-500/50 px-4 py-2 rounded text-xs font-bold hover:bg-orange-600 hover:text-white transition w-full sm:w-auto mt-2">
                                  Mark Returned
                                </button>
                              </div>
                            )}

                            {(activeTab === 'Delivered' || activeTab === 'Canceled' || activeTab === 'Returned') && (
                              <span className="text-gray-500 text-xs italic inline-block w-full text-right">No actions available</span>
                            )}
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}