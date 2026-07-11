"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Mail, MessageSquare, Send, User } from "lucide-react";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    setFormMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof ContactFormData, {
              type: "server",
              message: String(message),
            });
          });
        }
        setFormMessage({
          type: "error",
          text: result.message || "Please fix the highlighted fields.",
        });
        return;
      }

      setFormMessage({
        type: "success",
        text: result.message || "Your message has been sent successfully.",
      });
      reset();
      await Swal.fire({
        icon: "success",
        title: "Message sent",
        text: result.message || "Your message has been sent successfully.",
        confirmButtonColor: "#047857",
        confirmButtonText: "Continue",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "px-6 py-2 rounded-xl font-semibold",
        },
      });
    } catch {
      setFormMessage({
        type: "error",
        text: "Unable to send your message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas/50">
      <section className="bg-card border-b border-primary/15 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary">
              <Mail size={14} /> Contact SkillBridge
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
              Tell us how we can help.
            </h1>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              Send a message to the SkillBridge team and we will follow up with
              the right support.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-3xl border border-primary/10 bg-card p-8 shadow-sm"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    {...register("name", {
                      required: "Full name is required",
                      validate: (value) => {
                        const trimmed = value.trim();
                        if (!trimmed) return "Full name is required";
                        if (trimmed.length < 2)
                          return "Full name must be at least 2 characters";
                        return true;
                      },
                    })}
                    className="w-full rounded-xl border border-primary/15 bg-canvas/50 py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email address is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className="w-full rounded-xl border border-primary/15 bg-canvas/50 py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Subject
              </label>
              <input
                {...register("subject", {
                  required: "Subject is required",
                  validate: (value) => {
                    const trimmed = value.trim();
                    if (!trimmed) return "Subject is required";
                    if (trimmed.length < 3)
                      return "Subject must be at least 3 characters";
                    return true;
                  },
                })}
                className="w-full rounded-xl border border-primary/15 bg-canvas/50 px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                placeholder="How can we help?"
              />
              {errors.subject && (
                <p className="text-xs text-red-500">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="mt-5 space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Message
              </label>
              <div className="relative">
                <MessageSquare
                  className="absolute left-3 top-4 text-slate-400"
                  size={18}
                />
                <textarea
                  {...register("message", {
                    required: "Message is required",
                    validate: (value) => {
                      const trimmed = value.trim();
                      if (!trimmed) return "Message is required";
                      if (trimmed.length < 10)
                        return "Message must be at least 10 characters";
                      return true;
                    },
                  })}
                  className="h-36 w-full resize-none rounded-xl border border-primary/15 bg-canvas/50 py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                  placeholder="Write your message..."
                />
              </div>
              {errors.message && (
                <p className="text-xs text-red-500">
                  {errors.message.message}
                </p>
              )}
            </div>

            {formMessage && (
              <p
                className={`mt-5 text-xs ${
                  formMessage.type === "success"
                    ? "text-primary"
                    : "text-red-500"
                }`}
              >
                {formMessage.text}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-white transition hover:bg-primary hover:shadow-lg hover:shadow-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
