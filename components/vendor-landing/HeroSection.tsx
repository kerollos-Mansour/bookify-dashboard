"use client";

import { useState } from "react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-white">Bookify</div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-white hover:text-blue-300 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-white text-blue-900 rounded-full font-medium hover:bg-blue-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
          Partner with Bookify
        </h1>
        <p className="text-2xl md:text-3xl text-blue-200 mb-4 animate-fade-in-up animation-delay-200">
          Grow Your Hotel Business Globally
        </p>
        <p className="text-lg md:text-xl text-blue-100 mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
          Join thousands of hotels reaching millions of travelers worldwide
        </p>

        <a
          href="#application"
          className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-full hover:scale-105 transition-transform shadow-2xl animate-fade-in-up animation-delay-600"
        >
          Start Your Application →
        </a>

        {/* Stats Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in-up animation-delay-800">
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-bold text-white mb-2">10M+</div>
            <div className="text-blue-200">Annual Bookings</div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-bold text-white mb-2">150+</div>
            <div className="text-blue-200">Countries</div>
          </div>
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-bold text-white mb-2">95%</div>
            <div className="text-blue-200">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
    </section>
  );
}
