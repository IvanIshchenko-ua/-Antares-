type GalleryItem = {
  id: number;
  image: string;
  caption?: string;
};

export default function GalleryGrid() {
  // 🟡 Поки що мокові дані
  const items: GalleryItem[] = [
    { id: 1, image: "/img/gallery1.jpg", caption: "Подія 1" },
    { id: 2, image: "/img/gallery2.jpg", caption: "Подія 2" },
    { id: 3, image: "/img/gallery3.jpg", caption: "Подія 3" },
    { id: 4, image: "/img/gallery4.jpg", caption: "Подія 4" },
    { id: 5, image: "/img/gallery5.jpg", caption: "Подія 5" },
    { id: 6, image: "/img/gallery6.jpg", caption: "Подія 6" },
  ];

  return (
    <section className="py-10 bg-gray-100">
      <h2 className="text-center text-2xl font-bold mb-6">Галерея</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((i) => (
          <div key={i.id} className="relative">
            <img
              src={i.image}
              alt={i.caption}
              className="rounded-lg object-cover w-full h-32"
            />
            {i.caption && (
              <p className="text-center text-sm mt-1 text-gray-600">{i.caption}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
