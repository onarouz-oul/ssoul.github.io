
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Upload } from 'lucide-react'

const niches = [
  'Fitness',
  'Beauty',
  'Business',
  'Technology',
  'Lifestyle',
  'Travel',
  'Food',
  'Fashion',
  'Health',
  'Finance',
]

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  niche: z.string().min(1, 'Please select a niche'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
})

type FormData = z.infer<typeof schema>

const Onboarding = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState(user?.avatarUrl || '')
  const [step, setStep] = useState(1)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
    },
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatar(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('/api/users/onboard', {
        ...data,
        avatar,
      })
      navigate('/')
    } catch (error) {
      console.error('Onboarding failed:', error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow dark:bg-dark-800">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Complete your profile
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Let's set up your InfluencerOS account
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              className="w-24 h-24 rounded-full"
              src={avatar || 'https://i.pravatar.cc/300'}
              alt="User avatar"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 bg-primary-500 rounded-full cursor-pointer"
            >
              <Upload className="w-4 h-4 text-white" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="niche"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Niche
                </label>
                <select
                  id="niche"
                  {...register('niche')}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                >
                  <option value="">Select a niche</option>
                  {niches.map((niche) => (
                    <option key={niche} value={niche}>
                      {niche}
                    </option>
                  ))}
                </select>
                {errors.niche && (
                  <p className="mt-1 text-sm text-red-600">{errors.niche.message}</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <div className="flex mt-1 rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 dark:bg-dark-700 dark:border-dark-600 dark:text-gray-400">
                  influenceros.com/
                </span>
                <input
                  id="username"
                  type="text"
                  {...register('username')}
                  className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-dark-700 dark:border-dark-600 dark:text-gray-300 dark:hover:bg-dark-600"
              >
                Back
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 ml-auto text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 ml-auto text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Complete Setup
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Onboarding
  