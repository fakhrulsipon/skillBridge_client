"use client";

import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Shield,
  Clock,
  Award,
  ChevronRight,
  MapPin,
  Mail,
} from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Find a Tutor", href: "/tutors" },
    { name: "How it Works", href: "/#how-it-works" },
    { name: "Become a Tutor", href: "/register" },
    { name: "Student Dashboard", href: "/student/dashboard" },
    { name: "Help Center", href: "/help" },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "#",
      color: "text-[#1877f2]",
      bg: "bg-[#1877f2]/10",
    },
    {
      icon: Twitter,
      href: "#",
      color: "text-[#1da1f2]",
      bg: "bg-[#1da1f2]/10",
    },
    {
      icon: Instagram,
      href: "#",
      color: "text-[#e4405f]",
      bg: "bg-[#e4405f]/10",
    },
    {
      icon: Linkedin,
      href: "#",
      color: "text-[#0a66c2]",
      bg: "bg-[#0a66c2]/10",
    },
  ];

  const trustBadges = [
    { icon: Shield, text: "Secure Payments", description: "SSL encrypted" },
    { icon: Clock, text: "24/7 Support", description: "Always here" },
    { icon: Award, text: "Verified Tutors", description: "Vetted experts" },
    { icon: Globe, text: "Global Community", description: "100+ countries" },
  ];

  return (
    <footer className="relative bg-white border-t border-slate-100 overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="flex justify-between items-center mb-20">
          {/* Brand Section */}
          <div className="space-y-8">
            <Logo />
            <p className="text-slate-500 max-w-sm text-lg leading-relaxed">
              Empowering the next generation of learners through personalized,
              expert-led 1-on-1 mentorship. Your growth starts here.
            </p>
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Follow our journey
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className={`h-12 w-12 rounded-2xl ${social.bg} flex items-center justify-center transition-all hover:scale-110`}
                  >
                    <social.icon className={`h-5 w-5 ${social.color}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">
              Platform
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-500 font-bold hover:text-indigo-600 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight
                      size={14}
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-slate-100">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <badge.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">
                  {badge.text}
                </p>
                <p className="text-xs font-bold text-slate-400">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row justify-center items-center gap-6">
          <p className="text-sm font-bold text-slate-400">
            © {currentYear} SkillBridge. Built with excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
