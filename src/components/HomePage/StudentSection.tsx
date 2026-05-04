// components/sections/StudentSection.tsx
import React from 'react';
import { Calendar, Search, Clock, Star, Users, Award } from 'lucide-react';

const StudentSection = () => {
  const features = [
    {
      icon: Search,
      title: 'Find Your Perfect Tutor',
      description: 'Filter by subject, price, rating, and availability to match with the ideal expert for your learning goals.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Calendar,
      title: 'Real-time Availability',
      description: 'View tutor calendars in real-time and book sessions that fit your schedule — no back-and-forth messages.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Clock,
      title: 'Instant Booking',
      description: 'Book and pay for sessions instantly. Receive confirmation and reminders automatically.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Star,
      title: 'Verified Reviews',
      description: 'Read authentic reviews from other learners to make confident choices about your education.',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const stats = [
    { icon: Users, value: '98%', label: 'Student Satisfaction' },
    { icon: Award, value: '10k+', label: 'Sessions Completed' },
    { icon: Clock, value: '24/7', label: 'Global Access' }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">For Learners</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-5 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Your Learning Journey, <br />Simplified
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            SkillBridge gives students everything you need to discover, connect, and learn from the best tutors worldwide.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-gray-500 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-lg transition-all duration-300">
            Browse Tutors Now →
          </button>
          <p className="text-sm text-gray-400 mt-4">Free to browse. Pay per session or subscribe.</p>
        </div>
      </div>
    </section>
  );
};

export default StudentSection;