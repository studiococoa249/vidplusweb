import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import ImportForm from "./ImportForm";

export default async function ImportShortVideoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href={`/${lang}/admin/short/short-video`}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Download className="text-[#ffbd59]" size={28} />
            <span>Import API Drama</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Tarik data drama pendek dari provider eksternal</p>
        </div>
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 p-6 shadow-xl max-w-2xl">
        <ImportForm lang={lang} />
      </div>
    </div>
  );
}
