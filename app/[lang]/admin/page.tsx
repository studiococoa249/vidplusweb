import { LayoutDashboard, Users, CreditCard, History } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

export default async function AdminDashboardPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  // Fetch some basic stats
  const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: planCount } = await supabase.from('plan_membership').select('*', { count: 'exact', head: true });
  const { count: trxCount } = await supabase.from('membership_history').select('*', { count: 'exact', head: true });

  const stats = [
    { label: "Total Pengguna", value: userCount || 0, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", href: `/${lang}/admin/user` },
    { label: "Total Transaksi", value: trxCount || 0, icon: History, color: "text-green-400", bg: "bg-green-400/10", href: `/${lang}/admin/history-trx` },
    { label: "Paket Tersedia", value: planCount || 0, icon: CreditCard, color: "text-[#ffbd59]", bg: "bg-[#ffbd59]/10", href: `/${lang}/admin/plan` },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <LayoutDashboard className="text-[#ffbd59]" size={28} />
          <span>Dashboard</span>
        </h1>
        <p className="text-gray-400">Ringkasan aktivitas platform Vidplus+ Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={stat.label} 
              href={stat.href}
              className="bg-[#121622] rounded-xl border border-gray-800 p-6 flex items-center gap-4 hover:border-[#ffbd59]/50 hover:shadow-[0_0_20px_rgba(255,189,89,0.1)] transition-all group"
            >
              <div className={`p-4 rounded-full ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-16 h-16 bg-[#ffbd59]/10 rounded-full flex items-center justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Selamat Datang di Admin Panel</h2>
        <p className="text-gray-400 max-w-md">
          Gunakan menu navigasi di sebelah kiri untuk mengelola konten, integrasi API, serta pengaturan platform Anda.
        </p>
      </div>
    </div>
  );
}
