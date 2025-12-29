"use client";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Apply",
      description:
        "Submit your application with business details and documentation.",
    },
    {
      number: "2",
      title: "Verify",
      description: "Our team reviews your application within 24-48 hours.",
    },
    {
      number: "3",
      title: "Setup",
      description: "Add your hotels, rooms, and set your pricing.",
    },
    {
      number: "4",
      title: "Go Live",
      description: "Start receiving bookings and earning revenue immediately.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get started in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 -translate-x-1/2"></div>
              )}

              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold mb-6 shadow-2xl">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
