
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { Moon, Sun, Save, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
  niche: z.string().min(1, 'Please select a niche'),
})

type FormData = z.infer<typeof schema>

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

const Settings = () => {
  const { user } = useAuth()
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  )
  const [avatar, setAvatar] = useState(user?.avatarUrl || '')
  const [isEditing, setIsEditing] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      niche: user?.niche || '',
    },
  })

  useEffect(() => {
    if (user) {
      setValue('name', user.name)
      setValue('username', user.username)
      setValue('niche', user.niche)
      setAvatar(user.avatarUrl || '')
    }
  }, [user, setValue])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
    document.documentElement.classList.toggle('dark', newMode)
  }

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
      await axios.put('/api/users/profile', {
        ...data,
        avatar,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="p-6 bg-white rounded-lg shadow dark:bg-dark-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Profile
              </h2>
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="flex items-center px-3 py-1 text-sm font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-300 dark:border-dark-600 dark:hover:bg-dark-600"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1 text-sm font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img
                      className="w-16 h-16 rounded-full"
                      src={avatar || 'https://i.pravatar.cc/300'}
                      alt="User avatar"
                    />
                    {isEditing && (
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 bg-primary-500 rounded-full cursor-pointer"
                      >
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </label>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Profile photo
                    </p>
                    {isEditing && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        JPG, GIF or PNG. Max size of 2MB
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Full Name
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          id="name"
                          type="text"
                          {...register('name')}
                          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.name.message}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {user?.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Username
                    </label>
                    {isEditing ? (
                      <>
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
                          <p className="mt-1 text-sm text-red-600">
                            {errors.username.message}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        @{user?.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="niche"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Niche
                    </label>
                    {isEditing ? (
                      <>
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
                          <p className="mt-1 text-sm text-red-600">
                            {errors.niche.message}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {user?.niche}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="p-6 bg-white rounded-lg shadow dark:bg-dark-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Preferences
            </h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Toggle between light and dark theme
                  </p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    darkMode ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transition-transform duration-200 ease-in-out transform bg-white rounded-full ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                  <span className="sr-only">Toggle dark mode</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
  