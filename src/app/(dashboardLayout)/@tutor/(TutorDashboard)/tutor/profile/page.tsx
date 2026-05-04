'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import {
  Briefcase,
  Check,
  Image as ImageIcon,
  Layers3,
  LoaderCircle,
  MapPin,
  Save,
  Sparkles,
  Wallet,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type TutorProfileFormData = {
  bio: string
  categoryIds: string[]
  hourlyRate: string
  experience: string
  location: string
  imageUrl: string
}

type CategoryOption = {
  id: number
  name: string
  icon?: string | null
}

type TutorProfileResponse = {
  id: number
  bio: string
  hourlyRate: number
  experience: number
  location: string
  imageUrl: string | null
  isApproved: boolean
  avgRating: number
  totalReviews: number
  categories: {
    categoryId: number
    category: CategoryOption
  }[]
  user: {
    id: number
    name: string
    email: string
    role: string
  }
}

const ProfilePage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  const { token, user, isLoading: isAuthLoading } = useAuth()
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasExistingProfile, setHasExistingProfile] = useState(false)
  const [profile, setProfile] = useState<TutorProfileResponse | null>(null)
  const [availableCategories, setAvailableCategories] = useState<CategoryOption[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<TutorProfileFormData>({
    defaultValues: {
      bio: '',
      categoryIds: [],
      hourlyRate: '',
      experience: '',
      location: '',
      imageUrl: '',
    },
  })

  const selectedCategoryIds = watch('categoryIds')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseUrl}/tutors/categories`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Failed to load categories')
        }

        setAvailableCategories((result.data as CategoryOption[]) ?? [])
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load categories'

        await Swal.fire({
          icon: 'error',
          title: 'Unable to load categories',
          text: message,
          confirmButtonColor: '#0284c7',
        })
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [baseUrl])

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
          const fetchedProfile = result.data as TutorProfileResponse
          setProfile(fetchedProfile)
          setHasExistingProfile(true)
          reset({
            bio: fetchedProfile.bio ?? '',
            categoryIds: fetchedProfile.categories.map(({ categoryId }) => String(categoryId)),
            hourlyRate: String(fetchedProfile.hourlyRate ?? ''),
            experience: String(fetchedProfile.experience ?? ''),
            location: fetchedProfile.location ?? '',
            imageUrl: fetchedProfile.imageUrl ?? '',
          })
          return
        }

        if (response.status === 404) {
          setHasExistingProfile(false)
          setProfile(null)
          return
        }

        throw new Error(result.message || 'Failed to load tutor profile')
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load tutor profile'

        await Swal.fire({
          icon: 'error',
          title: 'Unable to load profile',
          text: message,
          confirmButtonColor: '#0284c7',
        })
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [baseUrl, reset, token])

  const toggleCategory = (categoryId: number) => {
    const nextCategoryId = String(categoryId)
    const nextValue = selectedCategoryIds.includes(nextCategoryId)
      ? selectedCategoryIds.filter((id) => id !== nextCategoryId)
      : [...selectedCategoryIds, nextCategoryId]

    setValue('categoryIds', nextValue, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const onSubmit = async (data: TutorProfileFormData) => {
    if (!token) {
      await Swal.fire({
        icon: 'warning',
        title: 'Login required',
        text: 'Please sign in again to manage your tutor profile.',
        confirmButtonColor: '#0284c7',
      })
      return
    }

    if (data.categoryIds.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Category required',
        text: 'Please select at least one tutor category.',
        confirmButtonColor: '#0284c7',
      })
      return
    }

    setIsSubmitting(true)

    const payload = {
      bio: data.bio.trim(),
      categoryIds: data.categoryIds.map((id) => Number(id)),
      hourlyRate: Number(data.hourlyRate),
      experience: Number(data.experience),
      location: data.location.trim(),
      imageUrl: data.imageUrl.trim(),
    }

    try {
      const endpoint = hasExistingProfile ? `${baseUrl}/tutors/me` : `${baseUrl}/tutors`
      const method = hasExistingProfile ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save tutor profile')
      }

      const savedProfile = result.data as TutorProfileResponse

      setProfile(savedProfile)
      setHasExistingProfile(true)
      reset({
        bio: savedProfile.bio ?? payload.bio,
        categoryIds: savedProfile.categories.map(({ categoryId }) => String(categoryId)),
        hourlyRate: String(savedProfile.hourlyRate ?? payload.hourlyRate),
        experience: String(savedProfile.experience ?? payload.experience),
        location: savedProfile.location ?? payload.location,
        imageUrl: savedProfile.imageUrl ?? payload.imageUrl,
      })

      await Swal.fire({
        icon: 'success',
        title: hasExistingProfile ? 'Profile updated' : 'Profile created',
        text:
          result.message ||
          (hasExistingProfile
            ? 'Your tutor profile has been updated successfully.'
            : 'Your tutor profile has been created successfully.'),
        confirmButtonColor: '#0284c7',
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save tutor profile'

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

  const profileStatus = useMemo(() => {
    if (!profile) {
      return {
        label: 'Profile not created yet',
        tone: 'bg-amber-50 text-amber-700 border-amber-200',
      }
    }

    return profile.isApproved
      ? {
          label: 'Approved tutor profile',
          tone: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        }
      : {
          label: 'Pending approval',
          tone: 'bg-amber-50 text-amber-700 border-amber-200',
        }
  }, [profile])

  if (isAuthLoading || isLoadingProfile || isLoadingCategories) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600 shadow-sm">
          <LoaderCircle className="h-5 w-5 animate-spin text-sky-600" />
          <span className="text-sm font-medium">Loading your tutor profile...</span>
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
              Tutor profile
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {profile?.user?.name || user?.name
                  ? `${profile?.user?.name || user?.name}'s Profile`
                  : 'Build your tutor profile'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-sky-50/90">
                Add the details students need to trust you, understand your experience,
                and book lessons with confidence.
              </p>
            </div>
          </div>

          <div className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${profileStatus.tone}`}>
            {profileStatus.label}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              {hasExistingProfile ? 'Update your tutor information' : 'Create your tutor information'}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="bio">Professional bio</Label>
              <Textarea
                id="bio"
                rows={6}
                placeholder="Tell students about your teaching style, strengths, and subject expertise."
                className="resize-none rounded-2xl border-slate-200 bg-slate-50/60 px-4 py-3"
                {...register('bio', {
                  required: 'Bio is required',
                  minLength: {
                    value: 20,
                    message: 'Bio should be at least 20 characters long',
                  },
                })}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label>Tutor categories</Label>
                <span className="text-sm text-slate-500">
                  {selectedCategoryIds.length} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {availableCategories.map((category) => {
                  const isSelected = selectedCategoryIds.includes(String(category.id))

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        isSelected
                          ? 'border-sky-200 bg-sky-50 text-sky-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-sky-100 hover:bg-slate-50'
                      }`}
                    >
                      <span>{category.name}</span>
                      {isSelected ? <Check className="h-4 w-4" /> : <Layers3 className="h-4 w-4 text-slate-400" />}
                    </button>
                  )
                })}
              </div>

              {selectedCategoryIds.length === 0 && (
                <p className="text-sm text-slate-500">
                  Select at least one category that matches your teaching area.
                </p>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly rate</Label>
                <div className="relative">
                  <Wallet className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="hourlyRate"
                    type="number"
                    min="0"
                    placeholder="1500"
                    className="h-11 rounded-2xl border-slate-200 bg-slate-50/60 pl-10"
                    {...register('hourlyRate', {
                      required: 'Hourly rate is required',
                      validate: (value) =>
                        Number(value) > 0 || 'Hourly rate must be greater than 0',
                    })}
                  />
                </div>
                {errors.hourlyRate && (
                  <p className="text-sm text-red-500">{errors.hourlyRate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience in years</Label>
                <div className="relative">
                  <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    placeholder="3"
                    className="h-11 rounded-2xl border-slate-200 bg-slate-50/60 pl-10"
                    {...register('experience', {
                      required: 'Experience is required',
                      validate: (value) =>
                        Number(value) >= 0 || 'Experience cannot be negative',
                    })}
                  />
                </div>
                {errors.experience && (
                  <p className="text-sm text-red-500">{errors.experience.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="location"
                    placeholder="Dhaka, Bangladesh"
                    className="h-11 rounded-2xl border-slate-200 bg-slate-50/60 pl-10"
                    {...register('location', {
                      required: 'Location is required',
                    })}
                  />
                </div>
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Profile image URL</Label>
                <div className="relative">
                  <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/photo.jpg"
                    className="h-11 rounded-2xl border-slate-200 bg-slate-50/60 pl-10"
                    {...register('imageUrl')}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {hasExistingProfile
                  ? 'Changes will update your existing tutor profile.'
                  : 'Your first save will create a new tutor profile.'}
              </p>

              <Button
                type="submit"
                disabled={isSubmitting || (!isDirty && hasExistingProfile)}
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
                    {hasExistingProfile ? 'Update profile' : 'Create profile'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Profile summary</h3>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="text-slate-400">Tutor name</p>
                <p className="mt-1 font-medium text-slate-700">
                  {profile?.user?.name || user?.name || 'Not available yet'}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Email</p>
                <p className="mt-1 font-medium text-slate-700">
                  {profile?.user?.email || user?.email || 'Sign in to load your account'}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Categories</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile?.categories?.length ? (
                    profile.categories.map(({ category }) => (
                      <span
                        key={category.id}
                        className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
                      >
                        {category.name}
                      </span>
                    ))
                  ) : (
                    <p className="font-medium text-slate-700">No category selected yet</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-slate-400">Reviews</p>
                <p className="mt-1 font-medium text-slate-700">
                  {profile ? `${profile.totalReviews} total reviews` : 'No profile yet'}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Average rating</p>
                <p className="mt-1 font-medium text-slate-700">
                  {profile ? profile.avgRating.toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">What to include</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Share your teaching style and the outcomes students can expect.</li>
              <li>Choose the categories that best represent the subjects you teach.</li>
              <li>Set a realistic hourly rate and total years of experience.</li>
              <li>Add a clear location and optional profile photo URL.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ProfilePage
