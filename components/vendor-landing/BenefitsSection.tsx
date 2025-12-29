"use client";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: "📈",
      title: "Increased Visibility",
      description:
        "Reach millions of travelers searching for accommodations worldwide through our platform.",
    },
    {
      icon: "💻",
      title: "Easy Management",
      description:
        "Manage all your properties, rooms, and bookings from one intuitive dashboard.",
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      description:
        "Fast, reliable payment processing with weekly payouts directly to your bank account.",
    },
    {
      icon: "🎧",
      title: "24/7 Support",
      description:
        "Dedicated vendor support team available around the clock to help you succeed.",
    },
    {
      icon: "📊",
      title: "Real-time Analytics",
      description:
        "Track your performance with detailed insights, reports, and booking trends.",
    },
    {
      icon: "🎯",
      title: "Marketing Tools",
      description:
        "Promotional features, discount codes, and featured listings to boost your bookings.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Partner With Us?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to grow your hotel business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
