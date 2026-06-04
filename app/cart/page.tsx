'use client';

import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartCount, cartTotal } = useCart();

  const deliveryCharge = cartTotal > 500 ? 0 : 50; // ५०० च्या वर फ्री डिलिव्हरी
  const finalAmount = cartTotal + deliveryCharge;

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-[#1a1008] pt-24 pb-12 px-4 flex flex-col items-center justify-center">
        <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="w-48 h-48 object-contain mb-6 opacity-80" />
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-2">Your cart is empty!</h2>
        <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/">
          <button className="bg-[#C85A3A] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#A6452B] transition shadow-lg">
            Shop Now
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1008] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Cart Items */}
        <div className="flex-1 space-y-4">
          <div className="bg-[#2C1810] rounded-xl p-4 sm:p-6 shadow-xl border border-[#D4AF37]/20 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#D4AF37]">My Cart ({cartCount})</h1>
            <div className="flex items-center text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
              <ShieldCheck size={16} className="mr-1" /> 100% Safe & Secure
            </div>
          </div>

          <div className="bg-[#2C1810] rounded-xl shadow-xl border border-[#D4AF37]/20 overflow-hidden divide-y divide-white/5">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 hover:bg-white/5 transition-colors">
                
                {/* Product Image */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-black/40 rounded-lg overflow-hidden border border-white/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Product Details & Actions */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">Authentic Traditional Recipe</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">₹{item.price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{item.price + 50}</span>
                      <span className="text-sm text-green-400 font-medium">Special Offer</span>
                    </div>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center gap-6 mt-4 sm:mt-0">
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-white hover:bg-white/10 transition disabled:opacity-50" disabled={item.quantity <= 1}>
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-white font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-white hover:bg-white/10 transition">
                        <Plus size={16} />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="flex items-center text-red-400 hover:text-red-300 transition font-medium uppercase text-sm tracking-wider">
                      <Trash2 size={16} className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Link href="/" className="inline-flex items-center text-[#D4AF37] hover:underline mt-4">
            <ArrowLeft size={16} className="mr-2" /> Continue Shopping
          </Link>
        </div>

        {/* Right Side: Price Details (Flipkart Style) */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-[#2C1810] rounded-xl shadow-xl border border-[#D4AF37]/20 sticky top-24 overflow-hidden">
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
                  {deliveryCharge === 0 ? 'Free Delivery' : `₹${deliveryCharge}`}
                </span>
              </div>
              
              {/* Divider */}
              <div className="border-t border-dashed border-gray-600 my-2"></div>
              
              <div className="flex justify-between text-xl font-bold text-[#D4AF37]">
                <span>Total Amount</span>
                <span>₹{finalAmount}</span>
              </div>
              
              <div className="border-t border-dashed border-gray-600 my-2"></div>
              
              <p className="text-green-400 text-sm font-medium">
                You will save ₹{cartCount * 50} on this order
              </p>
            </div>

            <div className="p-4 bg-black/20 border-t border-white/5">
              <Link href="/checkout">
                <button className="w-full bg-[#C85A3A] text-white py-4 rounded-lg font-bold text-lg uppercase tracking-wide hover:bg-[#A6452B] hover:shadow-[0_0_15px_rgba(200,90,58,0.5)] transition-all duration-300">
                  Place Order
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}