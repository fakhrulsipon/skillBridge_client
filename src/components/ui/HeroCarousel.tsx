'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    badge: '🎓 #1 Tutoring Platform',
    title: 'Learn From',
    highlight: 'Expert Tutors',
    subtitle: 'Anywhere, Anytime',
    description:
      'Connect with 1,200+ verified tutors across 50+ subjects. Book sessions instantly and start learning today.',
    cta: 'Find a Tutor',
    ctaHref: '/tutors',
    bg: 'from-blue-950 via-blue-900 to-indigo-950',
    orb1: 'bg-blue-500/30',
    orb2: 'bg-indigo-500/20',
    accent: 'from-blue-400 to-indigo-400',
    stats: [
      { value: '10K+', label: 'Students' },
      { value: '1.2K+', label: 'Tutors' },
      { value: '50+', label: 'Subjects' },
    ],
    emoji: '📚',
  },
  {
    id: 2,
    badge: '💻 Tech & Programming',
    title: 'Master',
    highlight: 'Coding Skills',
    subtitle: 'With Pro Developers',
    description:
      'Learn Python, JavaScript, React, and more from industry professionals with real-world experience.',
    cta: 'Explore Coding',
    ctaHref: '/tutors?category=Programming',
    bg: 'from-emerald-950 via-teal-900 to-cyan-950',
    orb1: 'bg-emerald-500/30',
    orb2: 'bg-teal-500/20',
    accent: 'from-emerald-400 to-cyan-400',
    stats: [
      { value: '200+', label: 'Dev Tutors' },
      { value: '4.9★', label: 'Rating' },
      { value: '24/7', label: 'Available' },
    ],
    emoji: '💻',
  },
  {
    id: 3,
    badge: '🎵 Arts & Music',
    title: 'Unlock Your',
    highlight: 'Creative Talent',
    subtitle: 'With Artist Mentors',
    description:
      'From guitar to graphic design, discover passionate tutors who will help you express your creativity.',
    cta: 'Start Creating',
    ctaHref: '/tutors?category=Music',
    bg: 'from-rose-950 via-pink-900 to-purple-950',
    orb1: 'bg-rose-500/30',
    orb2: 'bg-purple-500/20',
    accent: 'from-rose-400 to-purple-400',
    stats: [
      { value: '300+', label: 'Art Tutors' },
      { value: '15+', label: 'Art Forms' },
      { value: '98%', label: 'Satisfaction' },
    ],
    emoji: '🎨',
  },
  {
    id: 4,
    badge: '📐 Mathematics',
    title: 'Conquer',
    highlight: 'Math & Science',
    subtitle: 'Fear No Equation',
    description:
      'Top-rated math and science tutors make complex topics simple. From algebra to quantum physics.',
    cta: 'Find Math Tutor',
    ctaHref: '/tutors?category=Mathematics',
    bg: 'from-amber-950 via-orange-900 to-red-950',
    orb1: 'bg-amber-500/30',
    orb2: 'bg-orange-500/20',
    accent: 'from-amber-400 to-orange-400',
    stats: [
      { value: '500+', label: 'Math Tutors' },
      { value: '92%', label: 'Pass Rate' },
      { value: '1-on-1', label: 'Sessions' },
    ],
    emoji: '📐',
  },
]

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ])

  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    })
  }, [emblaApi])

  return (
    <div className="relative w-full overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`min-w-full relative bg-gradient-to-br ${slide.bg} min-h-[600px] flex items-center`}
          >
            {/* Background Grid */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />

            {/* Orbs */}
            <div
              className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full ${slide.orb1} blur-3xl pointer-events-none`}
            />
            <div
              className={`absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full ${slide.orb2} blur-2xl pointer-events-none`}
            />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-20 grid lg:grid-cols-2 gap-12 items-center w-full">

              {/* Left Text */}
              <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/80 text-sm backdrop-blur-sm">
                  <span>{slide.badge}</span>
                </div>

                {/* Heading */}
                <div className="space-y-1">
                  <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {slide.title}
                  </h1>
                  <h1
                    className={`text-5xl lg:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r ${slide.accent}`}
                  >
                    {slide.highlight}
                  </h1>
                  <h2 className="text-2xl lg:text-3xl font-medium text-white/60 mt-2">
                    {slide.subtitle}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-white/60 text-lg leading-relaxed max-w-md">
                  {slide.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex items-center gap-4 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-zinc-900 hover:bg-white/90 font-semibold px-6"
                  >
                    <Link href={slide.ctaHref}>
                      {slide.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className="text-white hover:bg-white/10 border border-white/20"
                  >
                    <Link href="/register">Become a Tutor</Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 pt-4">
                  {slide.stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Emoji Card */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative">
                  {/* Main Card */}
                  <div className="w-72 h-72 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-9xl">{slide.emoji}</span>
                  </div>

                  {/* Floating Cards */}
                  <div className="absolute -top-6 -right-8 bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-3">
                    <div className="text-white text-sm font-medium">⭐ Top Rated</div>
                    <div className="text-white/50 text-xs">4.9 / 5.0</div>
                  </div>
                  <div className="absolute -bottom-6 -left-8 bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-3">
                    <div className="text-white text-sm font-medium">🔥 Trending</div>
                    <div className="text-white/50 text-xs">200+ bookings today</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`transition-all rounded-full ${
              index === selectedIndex
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}