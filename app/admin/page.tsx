'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Package, ShoppingCart, Users, LogOut, Plus, Edit, Trash2, Building2 } from 'lucide-react';
import Link from 'next/link';

// आधीपासून ठरवलेल्या कॅटेगरीज
const DEFAULT_CATEGORIES = [
  'गहू कुरडई (Gahu Kurdai)',
  'उडीद पापड (Udid Papad)',
  'मसाला उडीद पापड (Masala Udid Papad)',
  'नाचणी पापड (Nachni Papad)',
  'गहू-तांदूळ पापड (Gahu-Tandul Papad)'
];

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const router = useRouter();
  
  // फॉर्म डेटा
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', quantity: '', weight: '', is_featured: false
  });

  // कॅटेगरीसाठी स्टेट्स
  const [allCategories, setAllCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  // फोटोंसाठी स्टेट्स (Multiple Photos)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

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
    fetchData();
  }

  async function fetchData() {
    setLoading(true);
    try {
      const { data: productsData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (productsData) {
        setProducts(productsData);
        // डेटाबेसमधून युनिक कॅटेगरीज काढणे आणि आधीच्या लिस्टमध्ये जोडणे
        const dbCategories = productsData.map(p => p.category).filter(Boolean);
        const uniqueCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...dbCategories]));
        setAllCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  // १० पेक्षा जास्त फोटो सिलेक्ट करू नयेत म्हणून चेक
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const totalImages = existingImages.length + newImageFiles.length + selectedFiles.length;
      
      if (totalImages > 10) {
        alert('भाऊ, तू जास्तीत जास्त 10 फोटोच अपलोड करू शकतोस!');
        return;
      }
      setNewImageFiles(prev => [...prev, ...selectedFiles]);
    }
  }

  // प्रिव्ह्यूमधून फोटो काढणे
  function removeNewImage(index: number) {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  }
  function removeExistingImage(index: number) {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    
    const finalCategory = selectedCategory === 'Other' ? customCategory : selectedCategory;
    if (!finalCategory) {
      alert('कृपया कॅटेगरी निवडा किंवा नवीन टाईप करा!');
      return;
    }

    if (existingImages.length === 0 && newImageFiles.length === 0) {
      alert('कृपया किमान 1 फोटो तरी अपलोड करा!');
      return;
    }

    setUploading(true);
    
    try {
      const uploadedUrls: string[] = [];

      // नवीन फोटो Supabase Storage मध्ये अपलोड करणे
      for (const file of newImageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      // फायनल फोटोंची लिस्ट (जुने + नवीन)
      const finalImageUrls = [...existingImages, ...uploadedUrls];

      const productData = {
        name: formData.name, 
        description: formData.description, 
        price: Number(formData.price),
        quantity: Number(formData.quantity) || 0,
        weight: formData.weight,
        category: finalCategory, 
        image_urls: finalImageUrls,
        is_featured: formData.is_featured
      };

      if (editingId) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingId);
        if (error) throw error;
        alert('प्रॉडक्ट अपडेट झाले!');
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        alert('नवीन प्रॉडक्ट ऍड झाले!');
      }

      closeForm();
      fetchData();
    } catch (error: any) {
      alert('प्रॉडक्ट सेव्ह करताना एरर आला: ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  function openEditForm(product: any) {
    setFormData({
      name: product.name, description: product.description, price: product.price.toString(),
      weight: product.weight || '', quantity: product.quantity?.toString() || '0', 
      is_featured: product.is_featured || false
    });
    
    if (allCategories.includes(product.category)) {
      setSelectedCategory(product.category);
    } else {
      setSelectedCategory('Other');
      setCustomCategory(product.category);
    }

    setExistingImages(product.image_urls || []);
    setNewImageFiles([]);
    setEditingId(product.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', quantity: '', weight: '', is_featured: false });
    setSelectedCategory('');
    setCustomCategory('');
    setExistingImages([]);
    setNewImageFiles([]);
  }

  async function handleDeleteProduct(id: string) {
    if (!window.confirm('तुम्हाला खरंच हे प्रॉडक्ट डिलीट करायचे आहे का?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      alert('एरर आला.');
    }
  }

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
          
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg transition-colors border border-[#D4AF37]/20">
            <Package size={20} /> <span className="font-bold">Products</span>
          </Link>

          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <Users size={20} /> <span className="font-medium">Users / Customers</span>
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
          <h2 className="text-2xl font-bold text-white">Products Management</h2>
          
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

        {/* Content (Products Table) */}
        <div className="flex-1 overflow-y-auto p-8 w-full scrollbar-hide relative">
          <div className="max-w-[1400px] mx-auto">
            
            <div className="flex justify-end mb-6">
              <button onClick={() => { closeForm(); setShowForm(true); }} className="bg-[#D4AF37] text-[#2C1810] px-6 py-3 rounded-lg font-bold hover:bg-[#ebd578] transition shadow-lg flex items-center gap-2">
                <Plus size={20} /> नवीन प्रॉडक्ट ऍड करा
              </button>
            </div>

            <div className="bg-[#2C1810]/60 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-black/40 text-gray-400 uppercase tracking-wider text-xs border-b border-white/10">
                    <tr>
                      <th className="p-5 font-semibold">Image</th>
                      <th className="p-5 font-semibold">Product Name</th>
                      <th className="p-5 font-semibold">Weight & Qty</th>
                      <th className="p-5 font-semibold">Price (₹)</th>
                      <th className="p-5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr><td colSpan={5} className="p-10 text-center text-gray-400">Loading products...</td></tr>
                    ) : products.length === 0 ? (
                      <tr><td colSpan={5} className="p-10 text-center text-gray-400">No products found.</td></tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-black/50 border border-white/10 flex-shrink-0">
                              <img 
                                src={product.image_urls?.[0] || product.image_url || 'https://images.unsplash.com/photo-1599599810694-b5ac4dd33e2d?w=100&h=100&fit=crop'} 
                                alt={product.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white text-base flex items-center gap-2">
                              {product.name}
                              {product.is_featured && <span className="text-[#D4AF37]">★</span>}
                            </div>
                            <div className="text-gray-400 text-xs mt-1 truncate max-w-[250px]">{product.description}</div>
                          </td>
                          <td className="p-4 text-gray-300">
                            {product.weight} | Qty: {product.quantity || 0}
                          </td>
                          <td className="p-4">
                            <span className="text-[#D4AF37] font-black text-lg">₹{product.price}</span>
                          </td>
                          <td className="p-4 text-right space-x-3">
                            <button onClick={() => openEditForm(product)} className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded hover:bg-blue-500 hover:text-white transition">
                              <Edit size={16} className="inline mr-1" /> Edit
                            </button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition">
                              <Trash2 size={16} className="inline mr-1" /> Delete
                            </button>
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

        {/* Product Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#2C1810] p-6 md:p-8 rounded-xl border border-[#D4AF37]/30 w-full max-w-3xl shadow-2xl relative overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">{editingId ? 'प्रॉडक्ट अपडेट करा' : 'नवीन प्रॉडक्ट ऍड करा'}</h2>
              
              <form onSubmit={handleSaveProduct} className="flex flex-col gap-5">
                
                <div className="flex flex-col p-4 border-2 border-dashed border-white/20 rounded-lg bg-black/30">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400">प्रॉडक्टचे फोटो (1 ते 10)</span>
                    <label className="px-4 py-2 bg-[#D4AF37] text-black font-semibold rounded cursor-pointer hover:bg-[#e0c25c]">
                      + फोटो निवडा
                      <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                    </label>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-2">
                    {existingImages.map((url, i) => (
                      <div key={'ext'+i} className="relative group">
                        <img src={url} alt={`Existing ${i}`} className="w-24 h-24 object-cover rounded-lg border border-[#D4AF37]" />
                        <button type="button" onClick={() => removeExistingImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">X</button>
                      </div>
                    ))}
                    {newImageFiles.map((file, i) => (
                      <div key={'new'+i} className="relative group">
                        <img src={URL.createObjectURL(file)} alt={`New ${i}`} className="w-24 h-24 object-cover rounded-lg border border-green-500" />
                        <button type="button" onClick={() => removeNewImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">X</button>
                        <span className="absolute bottom-1 left-1 bg-green-500 text-white text-[10px] px-1 rounded">New</span>
                      </div>
                    ))}
                    {existingImages.length === 0 && newImageFiles.length === 0 && (
                      <div className="w-full text-center text-gray-500 py-4">अजून एकही फोटो निवडलेला नाही.</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">प्रॉडक्टचे नाव</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white outline-none focus:border-[#D4AF37]" placeholder="उदा. उडीद पापड" />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">माहिती</label>
                    <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white outline-none focus:border-[#D4AF37]" placeholder="माहिती" rows={2}></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">किंमत (₹)</label>
                    <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white outline-none focus:border-[#D4AF37]" placeholder="उदा. 300" />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm text-gray-400 mb-1">कॅटेगरी</label>
                    <select 
                      required 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)} 
                      className="w-full bg-black/50 border border-white/10 rounded p-3 text-white outline-none focus:border-[#D4AF37] appearance-none"
                    >
                      <option value="" disabled>कॅटेगरी निवडा</option>
                      {allCategories.map((cat, i) => (
                        <option key={i} value={cat} className="bg-[#2C1810]">{cat}</option>
                      ))}
                      <option value="Other" className="bg-[#2C1810] text-[#D4AF37] font-bold">➕ इतर (Other - Type manually)</option>
                    </select>
                    
                    {selectedCategory === 'Other' && (
                      <input 
                        type="text" 
                        required 
                        value={customCategory} 
                        onChange={(e) => setCustomCategory(e.target.value)} 
                        className="w-full mt-2 bg-black/50 border border-[#D4AF37] rounded p-3 text-white outline-none focus:border-[#D4AF37]" 
                        placeholder="तुमची नवीन कॅटेगरी टाईप करा..." 
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">स्टॉक (Quantity)</label>
                    <input type="number" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white outline-none focus:border-[#D4AF37]" placeholder="उदा. 50" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">वजन (Weight)</label>
                    <input type="text" required value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white outline-none focus:border-[#D4AF37]" placeholder="उदा. 250g, 1Kg" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-2 bg-white/5 p-3 rounded-lg border border-white/10 cursor-pointer" onClick={() => setFormData({...formData, is_featured: !formData.is_featured})}>
                  <input type="checkbox" checked={formData.is_featured} readOnly className="w-5 h-5 accent-[#D4AF37]" />
                  <label className="text-gray-300 font-medium select-none">हे प्रॉडक्ट "Signature Collection" मध्ये दाखवा ⭐️</label>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={closeForm} disabled={uploading} className="px-6 py-2 bg-transparent border border-white/20 text-white rounded hover:bg-white/5">Cancel</button>
                  <button type="submit" disabled={uploading} className="px-6 py-2 bg-[#C85A3A] text-white font-bold rounded hover:bg-[#A6452B] disabled:opacity-50">
                    {uploading ? 'सेव्ह करत आहे...' : (editingId ? 'Update Product' : 'Save Product')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}