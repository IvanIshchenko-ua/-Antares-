type HeroProps = {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
};

export default function Hero({ title, subtitle, backgroundImage }: HeroProps) {
  return (
    <section
      className="relative h-[60vh] flex items-center justify-center text-center text-white"
      style={{ backgroundImage: `url(${backgroundImage || "/img/baner.jpg"})`, backgroundSize: "cover" }}
    >
      <div className="bg-black/50 p-8 rounded-xl">
        <h1 className="text-4xl font-bold">{title || "Антарес"}</h1>
        <p className="text-lg mt-2">{subtitle || "Школа майбутнього"}</p>
      </div>
    </section>
  );
}
