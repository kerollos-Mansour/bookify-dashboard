"use client";

export default function FeaturesSection() {
  const features = [
    {
      title: "Hotel Management Dashboard",
      description:
        "Manage all your properties from one centralized, easy-to-use dashboard with real-time updates.",
      image: "🏨",
    },
    {
      title: "Room Inventory Control",
      description:
        "Control pricing, availability, and room details with our intuitive calendar system.",
      image: "🛏️",
    },
    {
      title: "Booking Management",
      description:
        "View and manage all bookings, guest information, and special requests in one place.",
      image: "📅",
    },
    {
      title: "Financial Reports",
      description:
        "Track revenue, commissions, and payouts with detailed financial analytics and reports.",
      image: "💰",
    },
  ];

  return (
    <section className="py-20 px-6 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-blue-200">
            Everything you need to manage your hotel business
          </p>
        </div>

        <div className="space-y-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-12`}
            >
              <div className="flex-1">
                <div className="text-8xl mb-6">{feature.image}</div>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-xl text-blue-200">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
