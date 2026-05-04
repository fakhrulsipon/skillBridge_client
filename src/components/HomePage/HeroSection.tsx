// components/sections/HeroSection.tsx
import React from 'react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white">
      {/* Animated background blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-semibold">✨ SkillBridge</span>
            <span className="text-xs bg-white/30 rounded-full px-2 py-0.5">v2.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-pink-100">
            Connect. Learn. <br className="hidden md:block" />Grow Together.
          </h1>
          
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            SkillBridge connects passionate learners with expert tutors. 
            Browse profiles, check availability, and book sessions instantly — all in one seamless platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="bg-white text-indigo-700 px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Start Learning →
            </Link>
            <Link 
              href="/register" 
              className="bg-transparent border-2 border-white/80 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Become a Tutor
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-indigo-200">
            <div className="flex items-center gap-2">🎓 5,000+ Students</div>
            <div className="flex items-center gap-2">👨‍🏫 1,200+ Expert Tutors</div>
            <div className="flex items-center gap-2">⭐ 4.95 Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;