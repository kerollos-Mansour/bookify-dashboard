"use client";

import { useState } from "react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      hotel: "Sunset Beach Resort",
      rating: 5,
      quote:
        "Bookify helped us increase our bookings by 300% in just 6 months! The platform is incredibly easy to use.",
      avatar: "👩",
    },
    {
      name: "Michael Chen",
      hotel: "Urban Hotels Group",
      rating: 5,
      quote:
        "The dashboard is incredibly intuitive. Managing multiple properties has never been simpler.",
      avatar: "👨",
    },
    {
      name: "Maria Garcia",
      hotel: "Casa Bella Hotel",
      rating: 5,
      quote:
        "Fast payouts and excellent support. Highly recommend to any hotel owner looking to grow!",
      avatar: "👩",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Partners Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Join thousands of successful hotel partners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl">
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {testimonial.hotel}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
