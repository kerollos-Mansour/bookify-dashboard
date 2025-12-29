"use client";

import { useState } from "react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How long does the approval process take?",
      answer:
        "Our team reviews applications within 24-48 hours. You'll receive an email notification once your application is approved or if we need additional information.",
    },
    {
      question: "What commission does Bookify charge?",
      answer:
        "We charge a 15% commission on completed bookings. There are no upfront costs or monthly fees - you only pay when you earn.",
    },
    {
      question: "How do I receive payments?",
      answer:
        "Payments are processed weekly via bank transfer. You'll receive your earnings minus the platform commission directly to your registered bank account.",
    },
    {
      question: "Can I manage multiple properties?",
      answer:
        "Yes! You can add and manage unlimited properties from a single vendor account. Each property can have its own rooms, pricing, and settings.",
    },
    {
      question: "What support is available?",
      answer:
        "We offer 24/7 email support, live chat during business hours, and a comprehensive help center with guides and tutorials.",
    },
    {
      question: "Can I set my own prices?",
      answer:
        "Absolutely! You have full control over your room rates and can update them anytime. You can also create promotional discounts and special offers.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to know
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <span className="text-2xl text-blue-500">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 py-5 bg-gray-50 dark:bg-gray-750">
                  <p className="text-gray-700 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
