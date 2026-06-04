import React from 'react';

// १. फक्त आयकॉन (मोबाईलसाठी किंवा साईडबारसाठी)
export function LogoIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Premium Ring */}
      <circle cx="50" cy="50" r="48" fill="#1a1008" stroke="#D4AF37" strokeWidth="2.5" />
      
      {/* Traditional Dashed Inner Ring (गावठी फील) */}
      <circle cx="50" cy="50" r="41" fill="none" stroke="#C85A3A" strokeWidth="1.5" strokeDasharray="3 4" />
      
      {/* Abstract Sun / Heat lines (चुलीवरची धग / ऊन) */}
      <path d="M50 15 L50 20 M85 50 L80 50 M50 85 L50 80 M15 50 L20 50" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
      
      {/* Center Monogram (MB) */}
      <text 
        x="51" 
        y="58" 
        fontFamily="Georgia, serif" 
        fontSize="34" 
        fontWeight="900" 
        fill="#D4AF37" 
        textAnchor="middle" 
        letterSpacing="-1"
        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
      >
        MB
      </text>
      
      {/* Decorative Leaf / Grain (शेती आणि निसर्गाचे प्रतीक) */}
      <path d="M50 67 C 56 67, 62 73, 50 82 C 38 73, 44 67, 50 67 Z" fill="#C85A3A" />
      <path d="M50 67 C 52 67, 55 69, 50 75 C 45 69, 48 67, 50 67 Z" fill="#D4AF37" />
    </svg>
  );
}

// २. पूर्ण लोगो (आयकॉन + नाव - वेबसाईटच्या हेडरसाठी)
export function LogoFull({ className = "h-12" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon className="h-full w-auto drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]" />
      <div className="flex flex-col justify-center">
        <span className="text-2xl font-black text-white tracking-wide leading-none" style={{ fontFamily: "Georgia, serif" }}>
          Mother<span className="text-[#D4AF37]">Bites</span>
        </span>
        <span className="text-[9px] font-bold text-[#C85A3A] uppercase tracking-[0.2em] mt-1">
          Authentic Village Flavors
        </span>
      </div>
    </div>
  );
}