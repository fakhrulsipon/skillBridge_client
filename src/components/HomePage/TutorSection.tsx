// components/sections/TutorSection.tsx
import React from 'react';
import { CalendarCheck, BarChart3, Wallet, Clock, Users, ShieldCheck, Settings, TrendingUp } from 'lucide-react';

const TutorSection = () => {
  const tutorBenefits = [
    {
      icon: CalendarCheck,
      title: 'Manage Your Availability',
      description: 'Set your teaching hours, block time slots, and let students book instantly — complete control.',
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      icon: BarChart3,
      title: 'Track Sessions & Progress',
      description: 'View upcoming sessions, track earnings, and monitor student feedback in one dashboard.',
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Wallet,
      title: 'Seamless Payments',
      description: 'Get paid automatically after each session. Flexible payout options and transparent fees.',
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Grow Your Student Base',
      description: 'Reach thousands of motivated learners actively looking for your expertise.',
      bg: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  const steps = [
    { step: '1', title: 'Create Profile', desc: 'Showcase your expertise, credentials, and teaching style.' },
    { step: '2', title: 'Set Your Rates', desc: 'Choose your hourly rate and package options.' },
    { step: '3', title: 'Get Booked', desc: 'Students find you and book sessions instantly.' },
    { step: '4', title: 'Teach & Earn', desc: 'Deliver amazing sessions and build your reputation.' }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-slate-50 to-indigo-50/40">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left side - Text */}
          <div>
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">For Tutors</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-5">
              Empower Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Teaching Career</span>
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Join a community of expert educators who are shaping the future of learning. 
              SkillBridge gives you the tools to manage, grow, and monetize your teaching passion.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Verified tutor badge & profile protection</span>
              </div>
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-indigo-600" />
                <span className="text-gray-700">Customizable session types (1-on-1, group, workshops)</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Analytics dashboard to optimize your reach</span>
              </div>
            </div>

            <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-md">
              Apply to Become a Tutor →
            </button>
          </div>

          {/* Right side - Steps */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-600" />
              Get Started in 4 Easy Steps
            </h3>
            <div className="space-y-6">
              {steps.map((item) => (
                <div key={item.step} className="flex gap-4 items-start group">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {item.step}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-lg">{item.title}</div>
                    <div className="text-gray-500 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutorBenefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className={`w-12 h-12 rounded-xl ${benefit.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${benefit.iconColor}`} />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{benefit.title}</h4>
                <p className="text-gray-500 text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Testimonial */}
        <div className="mt-16 bg-indigo-900 text-white rounded-3xl p-8 md:p-10 text-center">
          <p className="text-xl md:text-2xl italic mb-4">
            SkillBridge helped me triple my student base in just 3 months. The platform makes scheduling and payments effortless.
          </p>
          <div className="flex justify-center items-center gap-3">
            <div className="w-10 h-10 bg-indigo-400 rounded-full flex items-center justify-center font-bold">JD</div>
            <div>
              <div className="font-semibold">Jessica Diaz</div>
              <div className="text-indigo-300 text-sm">Mathematics Tutor • 500+ sessions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorSection;