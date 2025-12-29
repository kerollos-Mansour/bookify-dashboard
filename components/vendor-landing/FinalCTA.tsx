"use client";

export default function FinalCTA() {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Grow Your Business?
        </h2>
        <p className="text-xl text-blue-100 mb-12">
          Join thousands of successful hotel partners on Bookify today
        </p>

        <a
          href="#application"
          className="inline-block px-10 py-5 bg-white text-blue-600 text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-2xl"
        >
          Start Your Application →
        </a>

        <p className="mt-8 text-blue-100">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-white font-semibold underline hover:text-blue-200"
          >
            Sign In
          </a>
        </p>
      </div>
    </section>
  );
}
