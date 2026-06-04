'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { Check, Truck, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase'; 

const maharashtraDistricts = [
  "Ahmednagar", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", 
  "Chandrapur", "Chhatrapati Sambhajinagar", "Dharashiv", "Dhule", "Gadchiroli", 
  "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", 
  "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Palghar", 
  "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", 
  "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
].sort();

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount } = useCart();
  const [activeStep, setActiveStep] = useState(2);
  
  const [address, setAddress] = useState({ name: '', phone: '', pin: '', district: '', fullAddress: '' });
  const [paymentMode, setPaymentMode] = useState('cod');
  
  // कस्टमरचा लॉगिन ईमेल आणि फोन आपोआप घेण्यासाठी स्टेट
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [authPhone, setAuthPhone] = useState<string | null>(null);
  
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryCharge = cartTotal > 500 ? 0 : 50;
  const finalAmount = cartTotal + deliveryCharge;

  // 6 Digit Captcha Generator
  const generateCaptcha = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaText(result);
  };

  useEffect(() => {
    // पेज लोड झाल्यावर कस्टमरचा सेव्ह असलेला ईमेल किंवा फोन गुपचूप मिळवणे
    async function getUserDetails() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (user.email) setAuthEmail(user.email);
        if (user.phone) setAuthPhone(user.phone);
      }
    }
    
    getUserDetails();
    generateCaptcha();
  }, []);

  const handleConfirmOrder = async () => {
    if (!termsAccepted) {
      alert("Please accept the Terms & Conditions.");
      return;
    }
    if (captchaInput !== captchaText) {
      alert("Invalid CAPTCHA! Please try again.");
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    setIsSubmitting(true);
    const newOrderId = `MB-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;

    const orderData = {
      order_id: newOrderId,
      customer_name: address.name,
      customer_phone: address.phone,
      delivery_address: `${address.fullAddress}, ${address.district}, Maharashtra - ${address.pin}`,
      total_amount: finalAmount,
      payment_mode: paymentMode,
      order_status: 'Pending',
      items: cart,
      account_email: authEmail, // हा ईमेल आता बॅकग्राउंडमधून आपोआप जाईल
      account_phone: authPhone  // हा फोन नंबर बॅकग्राउंडमधून जाईल
    };

    try {
      const { error } = await supabase.from('orders').insert([orderData]);
      if (error) throw error;
      
      setGeneratedOrderId(newOrderId);
      setOrderPlaced(true);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Something went wrong! Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#1a1008] pt-24 pb-12 px-4 flex flex-col items-center justify-center font-sans">
        <CheckCircle2 size={80} className="text-green-500 mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-[#D4AF37] mb-2 text-center">Order Confirmed Successfully!</h1>
        <p className="text-gray-400 mb-2 text-center">Thank you for choosing MotherBites.</p>
        <div className="bg-[#2C1810] border border-[#D4AF37]/30 px-6 py-4 rounded-lg mb-8 text-center">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Your Order ID</p>
          <p className="text-2xl font-bold text-white">{generatedOrderId}</p>
        </div>
        <Link href="/orders">
          <button className="bg-[#C85A3A] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#A6452B] transition shadow-lg">Go to My Orders</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1008] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Accordion Steps */}
        <div className="flex-1 space-y-4">
          
          {/* Step 1: LOGIN */}
          <div className="bg-[#2C1810] rounded-lg shadow-md border border-[#D4AF37]/20 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gray-200 text-[#2C1810] font-bold w-6 h-6 flex items-center justify-center rounded-sm text-sm">1</div>
                <div>
                  <h2 className="text-gray-400 font-semibold text-sm uppercase">Login <Check size={16} className="inline text-green-500 ml-1" /></h2>
                  <p className="text-white font-medium mt-1">Verified User</p>
                </div>
              </div>
              <button className="text-[#C85A3A] font-medium text-sm border border-[#C85A3A] px-4 py-1 rounded">CHANGE</button>
            </div>
          </div>

          {/* Step 2: DELIVERY ADDRESS */}
          <div className="bg-[#2C1810] rounded-lg shadow-md border border-[#D4AF37]/20 overflow-hidden">
            <div className={`px-6 py-4 flex items-center gap-4 ${activeStep === 2 ? 'bg-[#C85A3A]' : ''}`}>
              <div className={`font-bold w-6 h-6 flex items-center justify-center rounded-sm text-sm ${activeStep === 2 ? 'bg-white text-[#C85A3A]' : 'bg-gray-200 text-[#2C1810]'}`}>2</div>
              <h2 className={`font-semibold uppercase ${activeStep === 2 ? 'text-white' : 'text-gray-400 text-sm'}`}>
                Delivery Address {activeStep > 2 && <Check size={16} className="inline text-green-500 ml-1" />}
              </h2>
            </div>
            
            {activeStep === 2 && (
              <div className="p-6 bg-black/20">
                <form onSubmit={(e) => { e.preventDefault(); setActiveStep(3); }} className="space-y-4 max-w-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" required placeholder="Full Name" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} className="bg-black/50 border border-white/10 rounded px-4 py-3 text-white outline-none focus:border-[#D4AF37]" />
                    <input type="tel" required placeholder="10-digit Mobile No" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="bg-black/50 border border-white/10 rounded px-4 py-3 text-white outline-none focus:border-[#D4AF37]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" required placeholder="Pincode" value={address.pin} onChange={e => setAddress({...address, pin: e.target.value})} className="bg-black/50 border border-white/10 rounded px-4 py-3 text-white outline-none focus:border-[#D4AF37]" />
                    <div className="relative">
                      <select required value={address.district} onChange={e => setAddress({...address, district: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white outline-none focus:border-[#D4AF37] appearance-none">
                        <option value="" disabled>Select District</option>
                        {maharashtraDistricts.map(district => (
                          <option key={district} value={district} className="bg-[#2C1810]">{district}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <textarea required placeholder="Address (House No, Building, Street, Area)" value={address.fullAddress} onChange={e => setAddress({...address, fullAddress: e.target.value})} rows={3} className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white outline-none focus:border-[#D4AF37]" />
                  <button type="submit" className="bg-[#C85A3A] text-white px-8 py-3 rounded font-bold hover:bg-[#A6452B] transition uppercase tracking-wide shadow-lg">Save & Deliver Here</button>
                </form>
              </div>
            )}
            {activeStep > 2 && (
              <div className="px-6 py-4">
                <p className="text-white font-bold">{address.name} <span className="text-sm font-normal text-gray-400 ml-2">{address.phone}</span></p>
                <p className="text-gray-400 text-sm mt-1">{address.fullAddress}, {address.district}, Maharashtra - {address.pin}</p>
              </div>
            )}
          </div>

          {/* Step 3: ORDER SUMMARY */}
          <div className="bg-[#2C1810] rounded-lg shadow-md border border-[#D4AF37]/20 overflow-hidden">
            <div className={`px-6 py-4 flex items-center justify-between ${activeStep === 3 ? 'bg-[#C85A3A]' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`font-bold w-6 h-6 flex items-center justify-center rounded-sm text-sm ${activeStep === 3 ? 'bg-white text-[#C85A3A]' : 'bg-gray-200 text-[#2C1810]'}`}>3</div>
                <h2 className={`font-semibold uppercase ${activeStep === 3 ? 'text-white' : 'text-gray-400 text-sm'}`}>
                  Order Summary {activeStep > 3 && <Check size={16} className="inline text-green-500 ml-1" />}
                </h2>
              </div>
              {activeStep > 3 && <button onClick={() => setActiveStep(3)} className="text-[#C85A3A] font-medium text-sm border border-[#C85A3A] px-4 py-1 rounded">CHANGE</button>}
            </div>

            {activeStep === 3 && (
              <div className="bg-black/20">
                <div className="p-6 divide-y divide-white/5 max-h-[300px] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover border border-white/10" />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-[#D4AF37] font-bold">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-white/10 bg-[#2C1810] flex justify-between items-center">
                  <p className="text-white">Review your items and continue.</p>
                  <button onClick={() => setActiveStep(4)} className="bg-[#C85A3A] text-white px-8 py-3 rounded font-bold hover:bg-[#A6452B] transition uppercase tracking-wide shadow-lg">Continue</button>
                </div>
              </div>
            )}
            {activeStep > 3 && (
              <div className="px-6 py-4 text-white font-medium">
                {cartCount} Item(s) Confirmed
              </div>
            )}
          </div>

          {/* Step 4: PAYMENT OPTIONS */}
          <div className="bg-[#2C1810] rounded-lg shadow-md border border-[#D4AF37]/20 overflow-hidden">
            <div className={`px-6 py-4 flex items-center justify-between ${activeStep === 4 ? 'bg-[#C85A3A]' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`font-bold w-6 h-6 flex items-center justify-center rounded-sm text-sm ${activeStep === 4 ? 'bg-white text-[#C85A3A]' : 'bg-gray-200 text-[#2C1810]'}`}>4</div>
                <h2 className={`font-semibold uppercase ${activeStep === 4 ? 'text-white' : 'text-gray-400 text-sm'}`}>
                  Payment Options {activeStep > 4 && <Check size={16} className="inline text-green-500 ml-1" />}
                </h2>
              </div>
              {activeStep > 4 && <button onClick={() => setActiveStep(4)} className="text-[#C85A3A] font-medium text-sm border border-[#C85A3A] px-4 py-1 rounded">CHANGE</button>}
            </div>
            
            {activeStep === 4 && (
              <div className="p-6 bg-black/20 space-y-4">
                <label className="block border p-4 rounded cursor-pointer transition border-[#D4AF37] bg-[#D4AF37]/10">
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" value="cod" checked={paymentMode === 'cod'} onChange={() => setPaymentMode('cod')} className="w-4 h-4 accent-[#D4AF37]" />
                    <span className="text-white font-medium flex-1">Cash on Delivery (COD)</span>
                    <Truck size={24} className="text-[#D4AF37]" />
                  </div>
                </label>
                <div className="mt-8 text-right">
                  <button onClick={() => setActiveStep(5)} className="bg-[#C85A3A] text-white px-10 py-3 rounded font-bold hover:bg-[#A6452B] transition uppercase tracking-wide shadow-xl text-lg">
                    Continue to Confirm
                  </button>
                </div>
              </div>
            )}
            {activeStep > 4 && (
              <div className="px-6 py-4 text-white font-medium">
                Cash on Delivery (COD) Selected
              </div>
            )}
          </div>

          {/* Step 5: CONFIRM DETAILS */}
          <div className="bg-[#2C1810] rounded-lg shadow-md border border-[#D4AF37]/20 overflow-hidden">
             <div className={`px-6 py-4 flex items-center gap-4 ${activeStep === 5 ? 'bg-[#C85A3A]' : ''}`}>
              <div className={`font-bold w-6 h-6 flex items-center justify-center rounded-sm text-sm ${activeStep === 5 ? 'bg-white text-[#C85A3A]' : 'bg-gray-200 text-[#2C1810]'}`}>5</div>
              <h2 className={`font-semibold uppercase ${activeStep === 5 ? 'text-white' : 'text-gray-400 text-sm'}`}>Confirm Details</h2>
            </div>

            {activeStep === 5 && (
              <div className="p-6 bg-black/20">
                {/* Summary Box */}
                <div className="bg-black/40 p-4 rounded-lg border border-white/5 mb-6 space-y-4">
                  <div>
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Delivery To</h3>
                    <p className="text-white font-medium">{address.name} ({address.phone})</p>
                    <p className="text-gray-300 text-sm">{address.fullAddress}, {address.district} - {address.pin}</p>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Products</h3>
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-sm text-white mb-1">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider">Payment Mode</h3>
                    <span className="text-[#D4AF37] font-bold">COD (Cash on Delivery)</span>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer mb-6">
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 w-4 h-4 accent-[#D4AF37]" />
                  <span className="text-gray-300 text-sm">I agree to the Terms & Conditions and confirm that the above details are correct.</span>
                </label>

                {/* CAPTCHA Section (uppercase क्लास काढला आहे) */}
                <div className="bg-[#2C1810] p-4 rounded-lg border border-[#D4AF37]/30 flex flex-col md:flex-row items-center gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 px-6 py-2 rounded text-2xl font-bold tracking-[0.2em] text-white line-through decoration-gray-500 decoration-2 select-none">
                      {captchaText}
                    </div>
                    <button onClick={generateCaptcha} className="text-[#D4AF37] hover:text-white transition" title="Refresh Captcha">
                      <RefreshCw size={20} />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="Enter CAPTCHA exactly as shown" 
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="flex-1 bg-black/50 border border-white/10 rounded px-4 py-3 text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="text-right">
                  <button 
                    onClick={handleConfirmOrder} 
                    disabled={isSubmitting}
                    className="bg-green-600 text-white px-12 py-4 rounded-lg font-bold hover:bg-green-700 transition uppercase tracking-wide shadow-xl text-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Price Details (Sticky) */}
        <div className="w-full lg:w-[350px]">
          <div className="bg-[#2C1810] rounded-lg shadow-md border border-[#D4AF37]/20 sticky top-24 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-gray-400 font-bold uppercase tracking-wider text-sm">Price Details</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-white">
                <span>Price ({cartCount} items)</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Delivery Charges</span>
                <span className={deliveryCharge === 0 ? "text-green-400" : ""}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="border-t border-dashed border-gray-600 my-2"></div>
              <div className="flex justify-between text-xl font-bold text-[#D4AF37]">
                <span>Total Payable</span>
                <span>₹{finalAmount}</span>
              </div>
            </div>
            <div className="bg-[#D4AF37]/10 px-6 py-3 border-t border-white/5 text-green-400 text-sm font-medium flex items-center gap-2">
               <ShieldCheck size={16} /> 100% Safe and Secure.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}