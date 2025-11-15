"use client";

import { BuilderComponent } from "@builder.io/react";
import { builder } from "@builder.io/sdk";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "@/lib/builder-register";

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

export default function Page() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const urlPath = pathname === "" ? "/" : pathname;

  useEffect(() => {
    async function fetchContent() {
      console.log("🔎 Запит до Builder:", urlPath);
      const page = await builder.get("page", { url: urlPath }).toPromise();
      console.log("📦 Відповідь від Builder:", page);
      setContent(page);
      setLoading(false);
    }
    fetchContent();
  }, [urlPath]);

  if (loading) {
    return <h1 style={{ textAlign: "center", marginTop: "50px" }}>Сторінка завантажується…</h1>;
  }

  if (!content?.data) {
    return (
      <h1 style={{ textAlign: "center", marginTop: "50px" }}>
        ❌ Сторінку не знайдено в Builder.io для URL: <code>{urlPath}</code>
      </h1>
    );
  }

  return <BuilderComponent model="page" content={content} />;
}
