'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'नमस्कार! MotherBites मध्ये तुमचं स्वागत आहे. मी तुम्हाला कशी मदत करू शकतो? आमचा नवीन "मसाला उडीद पापड" नक्की ट्राय करा!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isChatClosed = sessionStorage.getItem('motherbites_chat_closed');
    if (!isChatClosed) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCloseChat = () => {
    setIsOpen(false);
    sessionStorage.setItem('motherbites_chat_closed', 'true');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // युझरचा मेसेज UI वर दाखवणे
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Backend ला मेसेज पाठवणे (पहिला वेलकम मेसेज सोडून खरी हिस्टरी पाठवणे)
      const historyToSend = newMessages.slice(1, -1); 

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: historyToSend 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', content: 'माफ करा, काहीतरी तांत्रिक अडचण आली आहे.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: 'इंटरनेट कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // AI च्या मेसेजमधील Markdown Links [Text](/link) ला खऱ्या बटणमध्ये बदलणारे फंक्शन
  const renderMessageContent = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // लिंकच्या आधीचा मजकूर
      if (match.index > lastIndex) {
        parts.push(<span key={lastIndex}>{text.substring(lastIndex, match.index)}</span>);
      }
      // लिंकला बटण बनवणे
      parts.push(
        <Link key={match.index} href={match[2]} className="inline-flex items-center gap-1.5 mt-2 mb-1 bg-[#2C1810] text-[#D4AF37] border border-[#D4AF37]/50 px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#D4AF37] hover:text-[#2C1810] transition-colors shadow-md">
          <ShoppingBag size={14} /> {match[1]}
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }
    // उरलेला मजकूर
    if (lastIndex < text.length) {
      parts.push(<span key={lastIndex}>{text.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`fixed bottom-6 right-6 z-50 group items-center gap-3 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <div className="hidden sm:block px-4 py-2 bg-[#2C1810] text-[#D4AF37] border border-[#D4AF37]/30 rounded-full text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
          Need Help? Chat with AI
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 flex items-center justify-center outline-none"
        >
          <div className="absolute inset-0 bg-[#D4AF37] rounded-full animate-ping opacity-25"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37] to-[#C85A3A] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] border-2 border-white/20 group-hover:scale-110 transition-transform duration-300">
            <Sparkles size={28} className="text-[#1a1008] drop-shadow-md" />
          </div>
          <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-[#1a1008] rounded-full z-10"></span>
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] bg-[#1a1008]/95 backdrop-blur-xl border border-[#D4AF37]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#2C1810] to-[#1a1008] p-4 flex items-center justify-between border-b border-[#D4AF37]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37] relative">
                  <Bot size={24} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-[#2C1810] rounded-full"></span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">MotherBites AI</h3>
                  <p className="text-green-400 text-xs flex items-center gap-1 font-medium">
                    Online & Ready to Help
                  </p>
                </div>
              </div>
              <button onClick={handleCloseChat} className="text-gray-400 hover:text-white transition bg-white/5 hover:bg-white/10 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-[url('/pattern.png')] bg-repeat bg-opacity-5">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-[#D4AF37] text-[#1a1008]' : 'bg-[#2C1810] text-[#D4AF37] border border-[#D4AF37]/30'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    
                    <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-md flex flex-col ${msg.role === 'user' ? 'bg-gradient-to-br from-[#D4AF37] to-[#e6c965] text-[#1a1008] font-medium rounded-tr-sm' : 'bg-[#2C1810]/90 text-gray-200 border border-white/5 rounded-tl-sm'}`}>
                      {/* इथे जादू होईल - नॉर्मल टेक्स्ट आणि बटन्स दिसतील */}
                      {renderMessageContent(msg.content)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex w-full justify-start">
                  <div className="flex gap-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-[#2C1810] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="p-4 bg-[#2C1810]/90 border border-white/5 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-[#D4AF37]/20 bg-gradient-to-b from-[#1a1008] to-[#0d0804]">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about MotherBites..."
                  className="flex-1 bg-[#2C1810] border border-white/10 rounded-full px-5 py-3.5 text-sm text-white outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-12 h-12 bg-gradient-to-tr from-[#C85A3A] to-[#e8704f] hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 text-white rounded-full flex items-center justify-center shrink-0 transition-all shadow-[0_0_15px_rgba(200,90,58,0.4)]"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}