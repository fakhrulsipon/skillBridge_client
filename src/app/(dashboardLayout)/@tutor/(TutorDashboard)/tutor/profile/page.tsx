'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import {
  AlertCircle,
  Briefcase,
  Check,
  Image as ImageIcon,
  Layers3,
  LoaderCircle,
  MapPin,
  Save,
  Sparkles,
  Star,
  UserRound,
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
  {/* ─── PREMIUM HERO SECTION ─── */}
  <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-500 p-8 text-white shadow-xl shadow-cyan-100">
    <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
    
    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
          <Sparkles size={14} className="text-yellow-200" /> Tutor Profile
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight leading-tight">
            {profile?.user?.name || user?.name
              ? `${profile?.user?.name || user?.name}&apos;s Profile`
              : 'Build your tutor profile'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-sky-50/90">
            Add the details students need to trust you, understand your experience,
            and book lessons with confidence.
          </p>
        </div>
      </div>

      <div className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-xs font-black uppercase tracking-widest shadow-lg backdrop-blur-sm ${profileStatus.tone}`}>
        <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
        {profileStatus.label}
      </div>
    </div>
  </section>

  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
    {/* ─── FORM SECTION ─── */}
    <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {hasExistingProfile ? 'Update tutor information' : 'Create tutor information'}
        </h2>
        <div className="mt-2 h-1 w-12 rounded-full bg-sky-500" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Bio Section */}
        <div className="space-y-3">
          <Label htmlFor="bio" className="text-xs font-black uppercase tracking-widest text-slate-500">Professional bio</Label>
          <Textarea
            id="bio"
            rows={6}
            placeholder="Tell students about your teaching style, strengths, and subject expertise."
            className="resize-none rounded-2xl border-slate-100 bg-slate-50/50 px-4 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-sky-500/5 transition-all outline-none"
            {...register('bio', {
              required: 'Bio is required',
              minLength: { value: 20, message: 'Bio should be at least 20 characters long' },
            })}
          />
          {errors.bio && <p className="text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle size={14}/> {errors.bio.message}</p>}
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Tutor categories</Label>
            <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500 uppercase">{selectedCategoryIds.length} selected</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {availableCategories.map((category) => {
              const isSelected = selectedCategoryIds.includes(String(category.id));
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={`group relative overflow-hidden flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-100'
                      : 'border-slate-100 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-600'
                  }`}
                >
                  {category.name}
                  {isSelected ? <Check size={14} /> : <Layers3 size={14} className="opacity-40 group-hover:opacity-100" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="hourlyRate" className="text-xs font-black uppercase tracking-widest text-slate-500">Hourly rate ($)</Label>
            <div className="group relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
              <Input
                id="hourlyRate"
                type="number"
                placeholder="1500"
                className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 pl-12 font-bold focus:bg-white transition-all"
                {...register('hourlyRate', { required: 'Hourly rate is required' })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-xs font-black uppercase tracking-widest text-slate-500">Experience (Years)</Label>
            <div className="group relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
              <Input
                id="experience"
                type="number"
                placeholder="3"
                className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 pl-12 font-bold focus:bg-white transition-all"
                {...register('experience', { required: 'Experience is required' })}
              />
            </div>
          </div>
        </div>

        {/* Location & Image */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-xs font-black uppercase tracking-widest text-slate-500">Location</Label>
            <div className="group relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
              <Input
                id="location"
                placeholder="Dhaka, Bangladesh"
                className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 pl-12 font-bold focus:bg-white transition-all"
                {...register('location', { required: 'Location is required' })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-xs font-black uppercase tracking-widest text-slate-500">Profile Image URL</Label>
            <div className="group relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
              <Input
                id="imageUrl"
                placeholder="https://..."
                className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 pl-12 font-bold focus:bg-white transition-all"
                {...register('imageUrl')}
              />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex flex-col gap-4 border-t border-slate-50 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold text-slate-400 italic">
            {hasExistingProfile ? 'Updates will take effect immediately on your profile.' : 'Ready to start your journey as a tutor?'}
          </p>

          <Button
            type="submit"
            disabled={isSubmitting || (!isDirty && hasExistingProfile)}
            className="h-14 min-w-[180px] rounded-2xl bg-sky-600 px-8 font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700 hover:-translate-y-1 transition-all active:scale-95"
          >
            {isSubmitting ? <LoaderCircle className="animate-spin" /> : <span className="flex items-center gap-2 uppercase tracking-widest text-xs"><Save size={18}/> {hasExistingProfile ? 'Update Profile' : 'Create Profile'}</span>}
          </Button>
        </div>
      </form>
    </section>

    {/* ─── SIDEBAR ─── */}
    <aside className="space-y-6">
      <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white p-1 shadow-sm transition-all hover:shadow-xl hover:shadow-sky-500/5">
        <div className="bg-slate-50/50 p-6 rounded-[28px]">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Live Preview</h3>
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-white shadow-md bg-sky-100">
                {profile?.imageUrl ? <img src={profile.imageUrl} className="h-full w-full object-cover" /> : <UserRound className="m-auto h-8 w-8 text-sky-600 mt-3" />}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 leading-none">Tutor Name</p>
                <p className="mt-1.5 font-black text-slate-800">{profile?.user?.name || user?.name || 'Your Name'}</p>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rating</span>
                <div className="flex items-center gap-1 font-black text-slate-800">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" /> {profile ? profile.avgRating.toFixed(1) : '0.0'}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reviews</span>
                <span className="font-black text-slate-800">{profile?.totalReviews || 0}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile?.categories?.map(({ category }) => (
                <span key={category.id} className="rounded-lg bg-sky-50 px-2 py-1 text-[10px] font-black text-sky-700 uppercase tracking-tighter border border-sky-100">
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-100 bg-slate-900 p-8 text-white">
        <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
          <Sparkles size={20} className="text-yellow-400" /> Pro Tips
        </h3>
        <ul className="mt-6 space-y-4">
          {[
            'Highlight your unique teaching method.',
            'Choose specialized categories.',
            'Use a professional photo URL.',
            'Be specific about your location.'
          ].map((tip, i) => (
            <li key={i} className="flex gap-3 text-sm font-medium text-slate-400">
              <span className="text-sky-500 font-black">0{i+1}.</span> {tip}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  </div>
</div>
  )
}

export default ProfilePage
