type ContactBlockProps = {
  phone?: string;
  email?: string;
  address?: string;
  image?: string;
};

export default function ContactBlock({
  phone,
  email,
  address,
  image,
}: ContactBlockProps) {
  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Зображення */}
        <div>
          <img
            src={image || "/img/contact.jpg"}
            alt="Контакти"
            className="rounded-lg shadow-md w-full object-cover"
          />
        </div>

        {/* Контактна інформація */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Контакти</h2>
          {phone && (
            <p className="mb-2">
              <strong>Телефон:</strong>{" "}
              <a href={`tel:${phone}`} className="text-blue-600 underline">
                {phone}
              </a>
            </p>
          )}
          {email && (
            <p className="mb-2">
              <strong>Email:</strong>{" "}
              <a href={`mailto:${email}`} className="text-blue-600 underline">
                {email}
              </a>
            </p>
          )}
          {address && (
            <p className="mb-2">
              <strong>Адреса:</strong> {address}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
