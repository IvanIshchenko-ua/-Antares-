type Faculty = {
  id: number;
  title: string;
  image?: string;
};

type FacultiesGridProps = {
  limit?: number;
};

export default function FacultiesGrid({ limit = 6 }: FacultiesGridProps) {
  // 🟡 Поки що мокові дані (потім підключимо Strapi)
  const faculties: Faculty[] = [
    { id: 1, title: "Математика", image: "/img/math.jpg" },
    { id: 2, title: "Фізика", image: "/img/physics.jpg" },
    { id: 3, title: "Інформатика", image: "/img/it.jpg" },
    { id: 4, title: "Біологія", image: "/img/biology.jpg" },
    { id: 5, title: "Хімія", image: "/img/chemistry.jpg" },
    { id: 6, title: "Література", image: "/img/literature.jpg" },
  ];

  return (
    <section className="py-10 bg-white">
      <h2 className="text-center text-2xl font-bold mb-6">Наші відділи</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {faculties.slice(0, limit).map((f) => (
          <div key={f.id} className="border rounded-lg shadow p-4 text-center">
            {f.image && (
              <img
                src={f.image}
                alt={f.title}
                className="mx-auto mb-2 rounded h-32 object-cover"
              />
            )}
            <h3 className="text-lg font-semibold">{f.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
