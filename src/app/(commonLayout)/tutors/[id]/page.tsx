"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Mail,
  MapPin,
  MessageSquareQuote,
  ShieldCheck,
  Star,
  Wallet,
  BookOpen,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

// Types
type Category = { id: number; name: string; icon?: string | null };

type AvailabilitySlot = {
  id?: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type TutorProfile = {
  id: number;
  bio: string;
  hourlyRate: number;
  experience: number;
  location: string;
  imageUrl: string | null;
  isApproved: boolean;
  avgRating: number;
  totalReviews: number;
  user: { id: number; name: string; email: string };
  categories: { categoryId: number; category: Category }[];
  availability?: AvailabilitySlot[];
};

type TutorReview = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  student: { id: number; name: string };
};

const dayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const durationOptions = [
  { label: "30 minutes", value: "30" },
  { label: "60 minutes", value: "60" },
  { label: "90 minutes", value: "90" },
  { label: "120 minutes", value: "120" },
];

const Stars = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((v) => (
      <Star key={v} size={size} className={v <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
    ))}
  </div>
);

const TutorAvatar = ({ tutor }: { tutor: TutorProfile }) => {
  const initials = tutor.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const gradients = [
    "from-indigo-400 to-cyan-400",
    "from-emerald-400 to-teal-400",
    "from-rose-400 to-orange-400",
    "from-purple-400 to-pink-400",
    "from-blue-400 to-indigo-400",
  ];
  const gradient = gradients[tutor.id % gradients.length];

  return tutor.imageUrl ? (
    <img src={tutor.imageUrl} alt={tutor.user.name} className="h-full w-full object-cover rounded-[40px]" />
  ) : (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} rounded-[40px] shadow-lg`}>
      <span className="text-4xl font-bold text-white tracking-tighter">{initials}</span>
    </div>
  );
};

export default function TutorDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const { user, token } = useAuth();
  const tutorId = Number(params.id);

  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [reviews, setReviews] = useState<TutorReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ scheduledAt: "", duration: "60", note: "" });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tRes, rRes] = await Promise.all([
          fetch(`${baseUrl}/tutors/${tutorId}`, { cache: "no-store" }),
          fetch(`${baseUrl}/review/tutor/${tutorId}`, { cache: "no-store" }),
        ]);
        const tResult = await tRes.json();
        const rResult = await rRes.json();
        if (tRes.ok) setTutor(tResult.data);
        if (rRes.ok) setReviews(Array.isArray(rResult.data) ? rResult.data : []);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [baseUrl, tutorId]);

  const estimatedPrice = useMemo(() => {
    return tutor ? (tutor.hourlyRate / 60) * Number(bookingForm.duration) : 0;
  }, [bookingForm.duration, tutor]);

  const handleBooking = async () => {
    if (!user || !token) {
      router.push("/login"); return;
    }
    if (user.role !== "STUDENT") {
      await Swal.fire({ icon: "warning", title: "Student account required", confirmButtonColor: "#6366f1" }); return;
    }
    if (!bookingForm.scheduledAt) {
      await Swal.fire({ icon: "warning", title: "Select a time", confirmButtonColor: "#6366f1" }); return;
    }

    setIsBooking(true);
    try {
      const res = await fetch(`${baseUrl}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tutorProfileId: tutorId, scheduledAt: bookingForm.scheduledAt, duration: Number(bookingForm.duration), note: bookingForm.note.trim() }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed");
      await Swal.fire({ icon: "success", title: "Booked!", text: result.message, confirmButtonColor: "#6366f1" });
      setBookingForm({ scheduledAt: "", duration: "60", note: "" });
    } catch (e: any) {
      await Swal.fire({ icon: "error", title: "Failed", text: e.message, confirmButtonColor: "#6366f1" });
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
    </div>
  );

  if (!tutor) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Tutor not found</h1>
        <Button asChild className="mt-4"><Link href="/tutors">Back to Tutors</Link></Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* ─── HEADER AREA ─── */}
      <section className="bg-white border-b border-slate-200 pt-10 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <Link href="/tutors" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors mb-10">
            <ArrowLeft size={16} /> Back to all tutors
          </Link>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="w-40 h-40 flex-shrink-0">
              <TutorAvatar tutor={tutor} />
            </div>
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                <ShieldCheck size={12} /> Verified Expert
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">{tutor.user.name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-2"><MapPin size={16} className="text-indigo-500" /> {tutor.location}</span>
                <span className="flex items-center gap-2"><Mail size={16} className="text-indigo-500" /> {tutor.user.email}</span>
                <span className="flex items-center gap-2"><BookOpen size={16} className="text-indigo-500" /> {tutor.experience} Years Experience</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {tutor.categories.map(c => (
                  <span key={c.categoryId} className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                    {c.category.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 text-white rounded-[32px] p-8 min-w-[240px] shadow-2xl">
              <div className="text-sm opacity-60 font-bold uppercase tracking-widest mb-1">Hourly Rate</div>
              <div className="text-4xl font-bold">${tutor.hourlyRate}</div>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Star className="fill-amber-400 text-amber-400" size={20} />
                </div>
                <div>
                  <div className="text-lg font-bold">{tutor.avgRating.toFixed(1)}</div>
                  <div className="text-[10px] opacity-60 uppercase font-bold tracking-wider">{tutor.totalReviews} Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTENT AREA ─── */}
      <div className="mx-auto max-w-7xl px-6 -mt-10 pb-20">
        <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          <div className="space-y-8">
            {/* Bio Card */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Sparkles className="text-indigo-600" size={20} /> Professional Bio
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{tutor.bio}</p>
            </div>

            {/* Availability */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CalendarDays className="text-indigo-600" size={20} /> Weekly Availability
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {tutor.availability?.map((slot, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700">{dayLabels[slot.dayOfWeek]}</span>
                    <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-lg shadow-sm">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                ))}
                {!tutor.availability?.length && <p className="text-slate-400 col-span-full py-10 text-center italic">No slots listed yet.</p>}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MessageSquareQuote className="text-indigo-600" size={20} /> Student Feedback
              </h2>
              <div className="space-y-6">
                {reviews.map(r => (
                  <div key={r.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-bold text-slate-900">{r.student.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                      <Stars rating={r.rating} size={14} />
                    </div>
                    <p className="text-sm text-slate-600 italic">"{r.comment}"</p>
                  </div>
                ))}
                {!reviews.length && <p className="text-slate-400 text-center py-10 italic">No reviews yet.</p>}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <aside>
            <div className="sticky top-24 bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl shadow-indigo-100/50 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <CalendarDays size={120} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Book Session</h2>
              <p className="text-sm text-slate-500 mb-8">Choose a time and duration to start learning.</p>

              <div className="space-y-6 relative">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date & Time</Label>
                  <Input 
                    type="datetime-local" 
                    value={bookingForm.scheduledAt}
                    onChange={e => setBookingForm(f => ({ ...f, scheduledAt: e.target.value }))}
                    className="h-12 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Session Length</Label>
                  <Select value={bookingForm.duration} onValueChange={v => setBookingForm(f => ({ ...f, duration: v }))}>
                    <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {durationOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Notes (Optional)</Label>
                  <Textarea 
                    placeholder="Mention specific topics..."
                    value={bookingForm.note}
                    onChange={e => setBookingForm(f => ({ ...f, note: e.target.value }))}
                    className="rounded-2xl bg-slate-50 border-slate-200 resize-none h-32"
                  />
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm font-bold text-slate-500">Estimated Price</div>
                    <div className="text-2xl font-bold text-indigo-600">${estimatedPrice.toFixed(2)}</div>
                  </div>
                  <Button 
                    onClick={handleBooking}
                    disabled={isBooking}
                    className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-100"
                  >
                    {isBooking ? <LoaderCircle className="animate-spin" /> : "Confirm Booking"}
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
