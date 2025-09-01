
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { X, Check, ChevronDown } from 'lucide-react'
import { icons } from '../lib/icons'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  icon: z.string().min(1, 'Icon is required'),
})

type FormData = z.infer<typeof schema>

interface LinkFormProps {
  link?: {
    id: string
    title: string
    url: string
    icon: string
    clicks: number
    order: number
  } | null
  onClose: () => void
  onSubmit: (data: Omit<FormData, 'id' | 'clicks' | 'order'>) => void
}

const LinkForm = ({ link, onClose, onSubmit }: LinkFormProps) => {
  const [iconPickerOpen, setIconPickerOpen] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: link?.title || '',
      url: link?.url || '',
      icon: link?.icon || 'Link',
    },
  })

  const selectedIcon = watch('icon')

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>
        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-dark-800 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
            <button
              type="button"
              className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-dark-800"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="sm:flex sm:items-start">
            <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                {link ? 'Edit Link' : 'Add New Link'}
              </h3>
              <div className="mt-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      {...register('title')}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="url"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      URL
                    </label>
                    <input
                      id="url"
                      type="url"
                      {...register('url')}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                    />
                    {errors.url && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.url.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="icon"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Icon
                    </label>
                    <div className="relative mt-1">
                      <button
                        type="button"
                        onClick={() => setIconPickerOpen(!iconPickerOpen)}
                        className="relative w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white sm:text-sm"
                      >
                        <span className="flex items-center">
                          {icons[selectedIcon] || icons.Link}
                          <span className="block ml-3 truncate">{selectedIcon}</span>
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 ml-3 pointer-events-none">
                          <ChevronDown
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </button>
                      {iconPickerOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg dark:bg-dark-800">
                          <ul className="py-1 overflow-auto text-base max-h-56 rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {Object.entries(icons).map(([name, Icon]) => (
                              <li
                                key={name}
                                className="relative py-2 pl-3 pr-9 text-gray-900 cursor-default select-none hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700"
                                onClick={() => {
                                  setValue('icon', name)
                                  setIconPickerOpen(false)
                                }}
                              >
                                <div className="flex items-center">
                                  <Icon className="w-5 h-5" />
                                  <span className="block ml-3 font-normal truncate">
                                    {name}
                                  </span>
                                </div>
                                {selectedIcon === name && (
                                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600 dark:text-primary-400">
                                    <Check className="w-5 h-5" />
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {errors.icon && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.icon.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                    >
                      {link ? 'Update Link' : 'Add Link'}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm dark:bg-dark-700 dark:text-gray-300 dark:hover:bg-dark-600"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LinkForm
  