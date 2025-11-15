type EventItem = {
  id: number;
  title: string;
  date: string;
  image?: string;
};

export default function EventsGrid() {
  // 🟡 Поки що мокові дані
  const events: EventItem[] = [
    { id: 1, title: "Наукова конференція", date: "2025-10-01", image: "/img/event1.jpg" },
    { id: 2, title: "День відкритих дверей", date: "2025-10-15", image: "/img/event2.jpg" },
    { id: 3, title: "Олімпіада з фізики", date: "2025-11-05", image: "/img/event3.jpg" },
    { id: 4, title: "Випускний вечір", date: "2025-12-01", image: "/img/event4.jpg" },
  ];

  return (
    <section className="py-10 bg-white">
      <h2 className="text-center text-2xl font-bold mb-6">Наші заходи</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {events.map((e) => (
          <div key={e.id} className="border rounded-lg shadow p-4">
            {e.image && (
              <img
                src={e.image}
                alt={e.title}
                className="rounded mb-2 h-32 w-full object-cover"
              />
            )}
            <h3 className="text-lg font-semibold">{e.title}</h3>
            <p className="text-sm text-gray-500">{e.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
