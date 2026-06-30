import React from 'react';
import { Mail, Phone, Send, MessageCircle, MapPin } from 'lucide-react';
import { getDictionary } from '../../dictionaries';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'id');
  return { title: dict.contact.title + ' | Vidplus+' };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'id');

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-300 py-12 px-4 md:px-8 lg:px-12 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-[#121622] p-8 md:p-12 rounded-2xl border border-gray-800 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 text-center">{dict.contact.title}</h1>
        <p className="text-center text-gray-400 mb-10 text-sm md:text-base">{dict.contact.desc}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Contact Details List */}
          <div className="flex flex-col gap-6 justify-center">
            
            {/* Email */}
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-[#ffbd59]/10 text-[#ffbd59] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">{dict.contact.email}</h3>
                <a href="mailto:info@vidplus.web.id" className="text-gray-400 hover:text-[#ffbd59] transition-colors">info@vidplus.web.id</a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-[#ffbd59]/10 text-[#ffbd59] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">{dict.contact.phone}</h3>
                <a href="tel:+6282221584446" className="text-gray-400 hover:text-[#ffbd59] transition-colors">+6282221584446</a>
              </div>
            </div>

            {/* Telegram */}
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-[#ffbd59]/10 text-[#ffbd59] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Send size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">{dict.contact.telegram}</h3>
                <a href="https://t.me/+6282221584446" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ffbd59] transition-colors">+6282221584446</a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-[#ffbd59]/10 text-[#ffbd59] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">{dict.contact.whatsapp}</h3>
                <a href="https://wa.me/6282221584446" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ffbd59] transition-colors">+6282221584446</a>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-[#07090e] rounded-2xl p-8 border border-gray-800 flex flex-col items-center justify-center text-center relative overflow-hidden group">
             {/* Background glow effect */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#ffbd59]/5 rounded-full blur-3xl group-hover:bg-[#ffbd59]/10 transition-colors duration-500"></div>
             
             <div className="w-16 h-16 rounded-full bg-[#ffbd59]/10 text-[#ffbd59] flex items-center justify-center mb-6 relative z-10 group-hover:-translate-y-1 transition-transform duration-300">
                <MapPin size={32} />
             </div>
             <h3 className="text-white font-bold text-xl mb-4 relative z-10">{dict.contact.address}</h3>
             <p className="text-gray-400 leading-relaxed text-sm md:text-base relative z-10 whitespace-pre-line">
               {dict.contact.addressText}
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}
