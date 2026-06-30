import React from 'react';
import { getDictionary } from '../dictionaries';
import {
  Zap, Search, TrendingUp, Star, Heart, Layers, Eye, Play,
  Swords, PlayCircle, ChevronRight, Home, Flame, Compass, User,
  Smartphone, MonitorPlay, Send
} from 'lucide-react';
import LanguageDropdown from '../components/LanguageDropdown';

const Instagram = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const Twitter = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const Youtube = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/></svg>
);

// Data statis untuk dirender di komponen
const trendingData = [
  { id: 1, title: "Balas Dendam Istri Konglomerat", desc: "Kembali dari kematian untuk menghancurkan keluarga suaminya.", views: "1.5M", rating: "9.8", img: "https://placehold.co/800x800/1c2235/ffbd59?text=Balas+Dendam+Sempurna", isLarge: true },
  { id: 2, title: "Rahasia Gelap Menantu", desc: "98 Episode • Tamat", img: "https://placehold.co/400x600/2a3655/fff?text=Rahasia+Gelap" },
  { id: 3, title: "Gadis Desa Pembawa Hoki", desc: "Update Ep 45", img: "https://placehold.co/400x600/1e293b/fff?text=Gadis+Desa" },
  { id: 4, title: "Identitas Asli Tuan Muda", desc: "60 Episode • Tamat", img: "https://placehold.co/400x600/0f172a/fff?text=Tuan+Muda", hiddenMobile: true },
  { id: 5, title: "Misteri Harta Karun", desc: "Update Ep 12", img: "https://placehold.co/400x600/172033/fff?text=Misteri+Harta", hiddenTablet: true }
];

const loveData = [
  { id: 1, title: "Cinta Kontrak CEO", eps: "50 Eps", views: "890K" },
  { id: 2, title: "Pernikahan Kilat", eps: "Tamat", views: "1.2M" },
  { id: 3, title: "Mantan Suami Memohon", eps: "Update Ep 30", views: "750K" },
  { id: 4, title: "Sekretaris Penggoda", eps: "65 Eps", views: "500K" },
  { id: 5, title: "Cinta Pertama Bertemu", eps: "Tamat", views: "2.1M" },
  { id: 6, title: "Jodoh Sang Dokter", eps: "Update Ep 15", views: "320K" }
];

const actionData = [
  "Raja Bawah Tanah", "Pengawal Bayaran", "Kode Pembunuh",
  "Kebangkitan Naga", "Misi Berbahaya", "Pewaris Tahta"
];

export default async function DramaShortApp({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'id');

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-200 font-sans selection:bg-[#ffbd59] selection:text-black pb-20 md:pb-0">


      {/* Top Navigation Bar (Header) */}
      <header className="fixed top-0 w-full z-50 glass-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-3 md:py-4 flex justify-between items-center w-full">
          {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 md:h-10 w-auto object-contain" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-[#ffbd59] font-semibold transition">{dict.home.nav.home}</a>
          <a href="#trending" className="text-gray-400 hover:text-white transition">{dict.home.nav.trending}</a>
          <a href="#romantis" className="text-gray-400 hover:text-white transition">{dict.home.nav.romance}</a>
          <a href="#aksi" className="text-gray-400 hover:text-white transition">{dict.home.nav.action}</a>
        </nav>

        {/* Search & User Profile */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Search Bar Desktop */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={dict.home.searchPlaceholder}
              className="w-full bg-[#121622] border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#ffbd59] transition"
            />
          </div>
          {/* Search Icon Mobile */}
          <button className="md:hidden text-gray-300 hover:text-[#ffbd59] transition">
            <Search size={22} />
          </button>

          <LanguageDropdown currentLang={lang} />

          {/* User Profile Desktop */}
          <div className="hidden md:flex items-center gap-3 cursor-pointer group">
            <img src="https://placehold.co/100x100/ffbd59/000?text=U" alt="User" className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-[#ffbd59] transition object-cover" />
          </div>
        </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto pt-24 px-4 md:px-8 lg:px-12 scroll-smooth">

        <div className="hidden md:block mb-8">
          <h1 className="text-2xl font-bold text-white">{dict.home.greeting}</h1>
          <p className="text-gray-400 text-sm mt-1">{dict.home.greetingDesc}</p>
        </div>

        {/* Section: Trending (Bento Grid Layout) */}
        <section id="trending" className="mb-14">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {dict.home.topTrending} <TrendingUp size={24} className="text-[#ffbd59]" />
            </h2>
            <a href="#" className="text-sm text-gray-400 hover:text-[#ffbd59] font-medium transition">{dict.home.more}</a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[220px] md:auto-rows-[280px]">
            {trendingData.map((item, index) => (
              <div
                key={item.id}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer
                  ${item.isLarge ? 'col-span-2 row-span-1 md:row-span-2' : 'col-span-1 row-span-1'}
                  ${item.hiddenMobile ? 'hidden md:block' : ''}
                  ${item.hiddenTablet ? 'hidden lg:block' : ''}
                `}
              >
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

                {item.isLarge ? (
                  <>
                    <div className="absolute top-4 left-4 bg-[#ffbd59] text-black font-extrabold px-3 py-1 rounded-lg text-sm shadow-lg">
                      #1 TRENDING
                    </div>
                    <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                      <div className="flex gap-2 mb-2">
                        <span className="bg-black/60 backdrop-blur text-white text-[10px] px-2 py-1 rounded">{item.views} Ditonton</span>
                        <span className="bg-black/60 backdrop-blur text-[#ffbd59] text-[10px] px-2 py-1 rounded flex items-center gap-1">
                          <Star size={10} className="fill-current" /> {item.rating}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-white leading-tight mb-1 group-hover:text-[#ffbd59] transition">{item.title}</h3>
                      <p className="text-xs md:text-sm text-gray-300 line-clamp-1 md:line-clamp-2">{item.desc}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur rounded px-1.5 py-0.5 text-[10px] text-white">#{index + 1}</div>
                    <div className="absolute bottom-0 p-3 w-full">
                      <h3 className="font-semibold text-sm text-white group-hover:text-[#ffbd59] transition leading-snug">{item.title}</h3>
                      <p className="text-[10px] text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section: Romantis */}
        <section id="romantis" className="mb-14">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {dict.home.romance} <Heart size={24} className="text-pink-500 fill-current" />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loveData.map((item, index) => (
              <div key={item.id} className="bg-[#121622] border border-gray-800 rounded-2xl p-3 flex gap-4 items-center group cursor-pointer hover:bg-[#1c2235] hover:border-pink-500/30 transition duration-300">
                <div className="w-20 h-28 md:w-24 md:h-32 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img src={`https://placehold.co/300x400/4c1d95/f9a8d4?text=Love+${index + 1}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute bottom-1 right-1 bg-black/70 px-1 rounded text-[8px] text-white backdrop-blur-sm flex items-center gap-1">
                    <Smartphone size={10} className="text-pink-400" /> Vert
                  </div>
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <span className="text-[10px] font-semibold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full mb-1.5 inline-block">Romantis</span>
                  <h3 className="text-base font-bold text-white group-hover:text-pink-400 transition truncate">{item.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Layers size={12} /> {item.eps}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Eye size={12} /> {item.views}</span>
                    <button className="w-8 h-8 rounded-full bg-[#07090e] text-white group-hover:bg-pink-500 group-hover:text-black flex items-center justify-center transition">
                      <Play size={12} className="fill-current ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Aksi */}
        <section id="aksi" className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {dict.home.action} <Swords size={24} className="text-red-500" />
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {actionData.map((title, index) => (
              <div
                key={index}
                className={`group cursor-pointer 
                  ${index > 3 ? 'hidden lg:block' : ''} 
                  ${index === 5 ? 'hidden xl:block lg:hidden' : ''}
                `}
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3">
                  <img src={`https://placehold.co/400x533/171717/ef4444?text=Action+${index + 1}`} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />

                  <div className="absolute bottom-2 left-2 right-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-2.5 transform translate-y-1 group-hover:translate-y-0 transition duration-300">
                    <h3 className="font-bold text-sm text-white truncate leading-tight">{title}</h3>
                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-[9px] text-gray-300 bg-black/60 px-1.5 py-0.5 rounded">Action</span>
                      <PlayCircle size={18} className="text-red-500" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer (Desktop & Tablet Only) */}
      <footer className="hidden md:block bg-[#121622] border-t border-white/5 pt-16 pb-12 px-4 md:px-8 lg:px-12 mt-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand & Info */}
          <div className="col-span-1 lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
            </a>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {dict.home.footer.desc}
            </p>
            <div className="flex gap-3">
              <button className="bg-[#07090e] border border-gray-700 hover:border-[#ffbd59] transition px-3 py-1.5 rounded-lg flex items-center gap-2">
                <Smartphone size={20} className="text-white" />
                <div className="text-left">
                  <div className="text-[8px] text-gray-400 uppercase leading-none">Download on the</div>
                  <div className="text-xs font-semibold text-white leading-tight">App Store</div>
                </div>
              </button>
              <button className="bg-[#07090e] border border-gray-700 hover:border-[#ffbd59] transition px-3 py-1.5 rounded-lg flex items-center gap-2">
                <MonitorPlay size={20} className="text-[#ffbd59]" />
                <div className="text-left">
                  <div className="text-[8px] text-gray-400 uppercase leading-none">Get it on</div>
                  <div className="text-xs font-semibold text-white leading-tight">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">{dict.home.footer.explore}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { label: dict.home.links.home, href: '/' },
                { label: dict.home.links.about, href: '/about' },
                { label: dict.home.links.topTrending, href: '#trending' },
                { label: dict.home.links.romance, href: '#romantis' },
                { label: dict.home.links.action, href: '#aksi' }
              ].map((link, i) => (
                <li key={i}><a href={link.href} className="hover:text-[#ffbd59] transition flex items-center gap-2"><ChevronRight size={12} /> {link.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-5">{dict.home.footer.support}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { label: dict.home.links.faq, href: '#' },
                { label: dict.home.links.vip, href: '#' },
                { label: dict.home.links.terms, href: '#' },
                { label: dict.home.links.privacy, href: '/privacy' },
                { label: dict.home.links.contact, href: '/contact' }
              ].map((link, i) => (
                <li key={i}><a href={link.href} className="hover:text-white transition">{link.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-5">{dict.home.footer.stayConnected}</h4>
            <div className="flex gap-3 mb-6">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-[#07090e] border border-gray-700 flex items-center justify-center text-gray-400 hover:text-black hover:bg-[#ffbd59] hover:border-[#ffbd59] transition duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-400 mb-2">{dict.home.footer.subscribe}</p>
            <div className="relative">
              <input type="email" placeholder={dict.home.footer.emailPlaceholder} className="w-full bg-[#07090e] border border-gray-700 rounded-xl py-2.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-[#ffbd59] transition" />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#ffbd59] rounded-lg flex items-center justify-center text-black hover:bg-[#e5a545] transition">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">{dict.home.footer.copyright}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>{dict.home.footer.designedWith}</span>
            <Heart size={12} className="text-red-500 fill-current mx-1" />
            <span>{dict.home.footer.forLovers}</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation (Floating App Style) */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-[#121622]/90 backdrop-blur-xl border border-gray-800 rounded-3xl z-50 flex justify-around py-3 px-2 shadow-2xl">
        <a href="#" className="flex flex-col items-center text-[#ffbd59] w-16">
          <Home size={20} className="mb-1" />
          <span className="text-[10px] font-medium">Home</span>
        </a>
        <a href="#trending" className="flex flex-col items-center text-gray-400 hover:text-white transition w-16">
          <Flame size={20} className="mb-1" />
          <span className="text-[10px] font-medium">Trend</span>
        </a>
        <div className="relative -top-7">
          <a href="#" className="w-14 h-14 bg-[#ffbd59] rounded-full flex items-center justify-center shadow-[0_5px_20px_rgba(255,189,89,0.4)] text-black border-4 border-[#07090e] hover:scale-105 transition">
            <Play size={20} className="fill-current ml-1" />
          </a>
        </div>
        <a href="#" className="flex flex-col items-center text-gray-400 hover:text-white transition w-16">
          <Compass size={20} className="mb-1" />
          <span className="text-[10px] font-medium">Jelajah</span>
        </a>
        <a href="#" className="flex flex-col items-center text-gray-400 hover:text-white transition w-16">
          <div className="w-6 h-6 rounded-full border border-gray-500 mb-1 overflow-hidden">
            <img src="https://placehold.co/100x100/ffbd59/000?text=U" alt="Profile" />
          </div>
          <span className="text-[10px] font-medium">Profil</span>
        </a>
      </nav>
    </div>
  );
}