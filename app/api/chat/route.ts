import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: '❌ API Key सापडत नाहीये.' }, { status: 200 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { message, history } = await req.json();

    // १. डेटाबेसमधून लाइव्ह प्रॉडक्ट्स आणणे
    const { data: products } = await supabase
      .from('products')
      .select('name, price, description');

    let productsInfo = "आपल्याकडे सध्या हे प्रॉडक्ट्स उपलब्ध आहेत: ";
    if (products && products.length > 0) {
      productsInfo += products.map(p => `${p.name} (₹${p.price})`).join(' | ');
    } else {
      productsInfo = "सध्या सर्व प्रॉडक्ट्स आउट ऑफ स्टॉक आहेत.";
    }

    // २. हिस्टरी फॉरमॅट करणे
    const validHistory = history
      .filter((msg: any) => msg.role === 'user' || msg.role === 'model')
      .map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

    // ३. AI ला सूचना (Prompt)
    const finalPrompt = `तू 'MotherBites' या गावरान आणि घरगुती पदार्थ विकणाऱ्या वेबसाईटचा नम्र आणि हुशार AI असिस्टंट आहेस.
लाईव्ह प्रॉडक्ट्स: ${productsInfo}

नियम: 
१. फक्त याच प्रॉडक्ट्सबद्दल बोल. 
२. कोणी विचारलं नवीन काय आहे, तर 'मसाला उडीद पापड' सुचव. 
३. खरेदी करण्यासाठी नेहमी ही लिंक दे: [Shop Now](/shop) 
४. उत्तरे एकदम छोटी आणि मराठीत दे.

ग्राहकाचा मेसेज: ${message}`;

    // ४. Fallback Logic: मॉडेल्सची लिस्ट (एकामागून एक चेक करणार)
    const modelsToTry = [
      'gemini-1.5-flash', 
      'gemini-1.5-pro', 
      'gemini-1.0-pro', 
      'gemini-pro'
    ];
    
    let responseText = '';
    let success = false;
    let lastError = '';

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}...`); // हे टर्मिनलमध्ये दिसेल
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const chat = model.startChat({
          history: validHistory,
        });

        const result = await chat.sendMessage(finalPrompt);
        responseText = result.response.text();
        
        success = true;
        break; // एखादं मॉडेल चाललं की लूप थांबेल!
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err.message);
        lastError = err.message;
        // एरर आला तर लूप पुढे जाईल आणि दुसरं मॉडेल ट्राय करेल
      }
    }

    if (success) {
      return NextResponse.json({ reply: responseText });
    } else {
      // जर सगळीच मॉडेल्स फेल झाली तर
      return NextResponse.json({ reply: `❌ तांत्रिक एरर (All models failed): ${lastError}` }, { status: 200 });
    }

  } catch (error: any) {
    console.error('Chatbot API Error:', error);
    return NextResponse.json({ reply: `❌ तांत्रिक एरर: ${error.message}` }, { status: 200 });
  }
}