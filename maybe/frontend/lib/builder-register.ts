import { builder, Builder } from "@builder.io/react";

// 🔑 Ініціалізація Builder
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

// 📦 Компоненти
import Hero from "@/components/Hero";
import FacultiesGrid from "@/components/FacultiesGrid";
import GalleryGrid from "@/components/GalleryGrid";
import EventsGrid from "@/components/EventsGrid";
import ContactBlock from "@/components/ContactBlock";

// 📝 Реєстрація компонентів у Builder.io
Builder.registerComponent(Hero, {
  name: "Hero",
  inputs: [
    { name: "title", type: "string", defaultValue: "Заголовок" },
    { name: "subtitle", type: "string", defaultValue: "Підзаголовок" },
    { name: "backgroundImage", type: "file" },
  ],
});

Builder.registerComponent(FacultiesGrid, {
  name: "FacultiesGrid",
  inputs: [{ name: "limit", type: "number", defaultValue: 6 }],
});

Builder.registerComponent(GalleryGrid, {
  name: "GalleryGrid",
});

Builder.registerComponent(EventsGrid, {
  name: "EventsGrid",
});

Builder.registerComponent(ContactBlock, {
  name: "ContactBlock",
  inputs: [
    { name: "phone", type: "string" },
    { name: "email", type: "string" },
    { name: "address", type: "string" },
    { name: "image", type: "file" },
  ],
});
