import { getRotatedImageKitConfig } from "@/utils/imagekit";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileName = (formData.get("fileName") as string) || "actor-banner";

    if (!file) {
      return Response.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    // Ambil config ImageKit yang di-rotasi
    const config = await getRotatedImageKitConfig();
    if (!config) {
      return Response.json(
        { error: "Tidak ada konfigurasi ImageKit yang tersedia." },
        { status: 500 }
      );
    }

    // Konversi file ke base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Upload ke ImageKit menggunakan REST API langsung (tidak perlu SDK)
    const credentials = Buffer.from(`${config.secret_key}:`).toString("base64");

    const ikFormData = new FormData();
    ikFormData.append("file", `data:${file.type};base64,${base64}`);
    ikFormData.append("fileName", fileName);
    ikFormData.append("folder", "/actors");
    ikFormData.append("useUniqueFileName", "true");

    const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      body: ikFormData,
    });

    if (!uploadRes.ok) {
      const errBody = await uploadRes.text();
      console.error("ImageKit upload error:", errBody);
      return Response.json({ error: "Gagal upload ke ImageKit." }, { status: 500 });
    }

    const result = await uploadRes.json();

    return Response.json({
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      accountName: config.name, // untuk debugging
    });
  } catch (err) {
    console.error("ImageKit upload route error:", err);
    return Response.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
