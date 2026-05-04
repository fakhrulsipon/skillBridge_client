'use client'

import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import {
  CalendarDays,
  Clock3,
  LoaderCircle,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

type AvailabilitySlot = {
  id?: number
  dayOfWeek: number
  startTime: string
  endTime: string
}

type TutorProfileResponse = {
  id: number
  availability: AvailabilitySlot[]
  user: {
    id: number
    name: string
    email: string
    role: string
  }
}

const dayOptions = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
]

const emptySlot = (): AvailabilitySlot => ({
  dayOfWeek: 0,
  startTime: '09:00',
  endTime: '10:00',
})

const AvailabilityPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  const { token, user, isLoading: isAuthLoading } = useAuth()

  const [slots, setSlots] = useState<AvailabilitySlot[]>([emptySlot()])
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setIsLoadingProfile(false)
        return
      }

      try {
        const response = await fetch(`${baseUrl}/tutors/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const result = await response.json()

        if (response.ok && result.data) {
          const profile = result.data as TutorProfileResponse
          const availability = Array.isArray(profile.availability) ? profile.availability : []

          setSlots(availability.length ? availability : [emptySlot()])
          setHasProfile(true)
          return
        }

        if (response.status === 404) {
          setHasProfile(false)
          setSlots([emptySlot()])
          return
        }

        throw new Error(result.message || 'Failed to load availability')
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load availability'

        await Swal.fire({
          icon: 'error',
          title: 'Unable to load availability',
          text: message,
          confirmButtonColor: '#0284c7',
        })
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [baseUrl, token])

  const updateSlot = (
    index: number,
    field: keyof AvailabilitySlot,
    value: string | number,
  ) => {
    setSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [field]: value } : slot,
      ),
    )
  }

  const addSlot = () => {
    setSlots((current) => [...current, emptySlot()])
  }

  const removeSlot = (index: number) => {
    setSlots((current) => {
      if (current.length === 1) {
        return [emptySlot()]
      }

      return current.filter((_, slotIndex) => slotIndex !== index)
    })
  }

  const validationError = useMemo(() => {
    if (!slots.length) {
      return 'Add at least one availability slot.'
    }

    for (const slot of slots) {
      if (slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
        return 'Each day must be between Sunday and Saturday.'
      }

      if (!slot.startTime || !slot.endTime) {
        return 'Each slot needs both a start time and an end time.'
      }

      if (slot.startTime >= slot.endTime) {
        return 'Start time must be earlier than end time for every slot.'
      }
    }

    return ''
  }, [slots])

  const handleSubmit = async () => {
    if (!token) {
      await Swal.fire({
        icon: 'warning',
        title: 'Login required',
        text: 'Please sign in again to manage availability.',
        confirmButtonColor: '#0284c7',
      })
      return
    }

    if (!hasProfile) {
      await Swal.fire({
        icon: 'info',
        title: 'Create your tutor profile first',
        text: 'You need a tutor profile before you can publish availability.',
        confirmButtonColor: '#0284c7',
      })
      return
    }

    if (validationError) {
      await Swal.fire({
        icon: 'warning',
        title: 'Check your availability slots',
        text: validationError,
        confirmButtonColor: '#0284c7',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${baseUrl}/tutors/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slots: slots.map((slot) => ({
            dayOfWeek: Number(slot.dayOfWeek),
            startTime: slot.startTime,
            endTime: slot.endTime,
          })),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save availability')
      }

      const savedSlots = Array.isArray(result.data) ? (result.data as AvailabilitySlot[]) : []
      setSlots(savedSlots.length ? savedSlots : [emptySlot()])

      await Swal.fire({
        icon: 'success',
        title: 'Availability updated',
        text: result.message || 'Your availability slots have been saved successfully.',
        confirmButtonColor: '#0284c7',
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save availability'

      await Swal.fire({
        icon: 'error',
        title: 'Save failed',
        text: message,
        confirmButtonColor: '#0284c7',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthLoading || isLoadingProfile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-sky-600" />
          <span className="text-sm font-medium">Loading your availability...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-500 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5" />
              Tutor availability
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {user?.name ? `${user.name}'s Availability` : 'Set your availability'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-sky-50/90">
                Choose the days and times when students can book you. The backend accepts
                `dayOfWeek`, `startTime`, and `endTime` for each slot.
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
            {hasProfile ? `${slots.length} slot${slots.length > 1 ? 's' : ''} ready` : 'Tutor profile required'}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Weekly time slots</h2>
              <p className="mt-1 text-sm text-slate-500">
                Add one or more slots. Each slot must have a valid day and a start time earlier than the end time.
              </p>
            </div>

            <Button
              type="button"
              onClick={addSlot}
              className="rounded-2xl bg-sky-600 text-white hover:bg-sky-700"
            >
              <Plus className="h-4 w-4" />
              Add slot
            </Button>
          </div>

          {!hasProfile && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Please create your tutor profile first. The backend blocks availability updates until a tutor profile exists.
            </div>
          )}

          <div className="space-y-4">
            {slots.map((slot, index) => (
              <div
                key={`${slot.id ?? 'new'}-${index}`}
                className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <CalendarDays className="h-4 w-4 text-sky-600" />
                    Slot {index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Day</label>
                    <select
                      value={slot.dayOfWeek}
                      onChange={(event) =>
                        updateSlot(index, 'dayOfWeek', Number(event.target.value))
                      }
                      className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    >
                      {dayOptions.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Start time</label>
                    <div className="relative">
                      <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(event) =>
                          updateSlot(index, 'startTime', event.target.value)
                        }
                        className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">End time</label>
                    <div className="relative">
                      <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(event) =>
                          updateSlot(index, 'endTime', event.target.value)
                        }
                        className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Saving availability replaces your previous slots with this updated list.
            </p>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !hasProfile}
              className="h-11 rounded-2xl bg-sky-600 px-5 text-white hover:bg-sky-700"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save availability
                </>
              )}
            </Button>
          </div>
        </section>

        <aside className="space-y-4">
     

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Preview</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {slots.length ? (
                slots.map((slot, index) => (
                  <div
                    key={`preview-${slot.id ?? 'new'}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <p className="font-medium text-slate-800">
                      {dayOptions.find((day) => day.value === Number(slot.dayOfWeek))?.label}
                    </p>
                    <p className="mt-1 text-slate-500">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                ))
              ) : (
                <p>No slots added yet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default AvailabilityPage
