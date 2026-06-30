import React from 'react';
import { Play, Film, Star, Zap } from 'lucide-react';
import { getDictionary } from '../../dictionaries';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'id');
  return { title: dict.about.title + ' | Vidplus+' };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'id');

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-300 py-16 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#ffbd59]/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#ffbd59]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-[#ffbd59]/10 rounded-2xl mb-6">
            <Zap className="text-[#ffbd59]" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {dict.about.title} <span className="text-[#ffbd59]">Vidplus+</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {dict.about.desc}
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#121622]/80 backdrop-blur-xl p-8 md:p-12 lg:p-16 rounded-3xl border border-gray-800 shadow-2xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white leading-tight">{dict.about.heading}</h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                {dict.about.p1}
              </p>
              <p className="text-gray-400 leading-relaxed text-lg">
                {dict.about.p2}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#07090e] p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center group hover:border-[#ffbd59]/30 transition-all duration-300 hover:-translate-y-1">
                <Film className="text-[#ffbd59] mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-white font-bold mb-1">{dict.about.features.genre}</h3>
                <p className="text-xs md:text-sm text-gray-500">{dict.about.features.genreDesc}</p>
              </div>
              <div className="bg-[#07090e] p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center group hover:border-[#ffbd59]/30 transition-all duration-300 mt-0 md:mt-8 hover:-translate-y-1">
                <Play className="text-[#ffbd59] mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-white font-bold mb-1">{dict.about.features.short}</h3>
                <p className="text-xs md:text-sm text-gray-500">{dict.about.features.shortDesc}</p>
              </div>
              <div className="bg-[#07090e] p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center group hover:border-[#ffbd59]/30 transition-all duration-300 -mt-0 md:-mt-8 hover:-translate-y-1">
                <Star className="text-[#ffbd59] mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-white font-bold mb-1">{dict.about.features.vip}</h3>
                <p className="text-xs md:text-sm text-gray-500">{dict.about.features.vipDesc}</p>
              </div>
              <div className="bg-[#07090e] p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center group hover:border-[#ffbd59]/30 transition-all duration-300 hover:-translate-y-1">
                <Zap className="text-[#ffbd59] mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-white font-bold mb-1">{dict.about.features.update}</h3>
                <p className="text-xs md:text-sm text-gray-500">{dict.about.features.updateDesc}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
