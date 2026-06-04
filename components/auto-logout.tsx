'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AutoLogout() {
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // १० मिनिटे = ६००,००० मिलीसेकंद
      timeoutId = setTimeout(async () => {
        // आधी चेक करूया की युझर खरंच लॉगिन आहे का
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            await supabase.auth.signOut();
            alert("सुरक्षेच्या कारणास्तव (Security reasons) १० मिनिटे कोणतीही हालचाल न केल्यामुळे तुम्ही लॉगआउट झाला आहात.");
            router.push('/'); // लॉगआउट झाल्यावर होम पेजवर पाठवा
            router.refresh();
        }
      }, 600000); 
    };

    // युझरच्या हालचाली ट्रॅक करा
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [router]);

  return null; // हा कंपोनंट स्क्रीनवर काहीही दाखवणार नाही, फक्त सिक्युरिटीचे काम करेल
}