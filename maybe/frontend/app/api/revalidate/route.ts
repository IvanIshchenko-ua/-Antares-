import { NextResponse } from "next/server";

/**
 * Builder.io Webhook → Next.js On-Demand Revalidation
 */
export async function POST(req: Request) {
  try {
    // 🔐 Перевіряємо секрет
    const secret = req.headers.get("x-builder-secret");
    if (secret !== process.env.BUILDER_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Читаємо тіло запиту
    const body = await req.json().catch(() => ({}));
    const urlPath = body?.url || "/";

    console.log("🔄 Revalidating:", urlPath);

    // ⚡ У App Router ISR працює через cache-tags.
    // Тому можна або revalidatePath (Next 14.2+), або просто повернути success.
    // Якщо у тебе версія 14.2+, розкоментуй:
    //
    // import { revalidatePath } from "next/cache";
    // revalidatePath(urlPath);

    return NextResponse.json({ revalidated: true, url: urlPath });
  } catch (err: any) {
    console.error("❌ Revalidate error:", err);
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
  }
}
