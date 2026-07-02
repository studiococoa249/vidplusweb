"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { 
  LayoutDashboard, Users, CreditCard, History, 
  Image as ImageIcon, Settings, LogOut, Menu, X, ExternalLink,
  Tags, PlaySquare, UserRound, Server
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const lang = params.lang as string || "id";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: `/${lang}/admin`, icon: LayoutDashboard, exact: true },
    { name: "Genres", href: `/${lang}/admin/short/genre`, icon: Tags, exact: false },
    { name: "Short Videos", href: `/${lang}/admin/short/short-video`, icon: PlaySquare, exact: false },
    { name: "Actor", href: `/${lang}/admin/actor`, icon: UserRound, exact: false },
    { name: "Users", href: `/${lang}/admin/user`, icon: Users, exact: false },
    { name: "Membership Plans", href: `/${lang}/admin/plan`, icon: CreditCard, exact: false },
    { name: "Transaction History", href: `/${lang}/admin/history-trx`, icon: History, exact: false },
    { name: "ImageKit API", href: `/${lang}/admin/imagekit-api`, icon: ImageIcon, exact: false },
    { name: "Rapid API", href: `/${lang}/admin/rapid-api`, icon: Server, exact: false },
    { name: "Payment Gateway", href: `/${lang}/admin/payment-gateway`, icon: Settings, exact: false },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-200 font-sans selection:bg-[#ffbd59] selection:text-black flex">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#121622] border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <Link href={`/${lang}/admin`} className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
            </Link>
            <button className="lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-2 pb-4">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-[#ffbd59]/10 text-[#ffbd59] font-medium" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-[#121622] border-b border-gray-800 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-white hidden sm:block">
              Adminpanel.
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href={`/${lang}`}
              target="_blank"
              className="hidden sm:flex items-center gap-2 text-sm text-gray-400 hover:text-[#ffbd59] transition-colors"
            >
              <ExternalLink size={16} />
              <span>Visit Site</span>
            </Link>
            <div className="h-6 w-px bg-gray-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[#ffbd59] font-bold">
                A
              </div>
              <span className="text-sm font-medium hidden sm:block">Admin User</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
