
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { X, Check } from 'lucide-react'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  downloadUrl: z.string().url('Invalid URL').min(1, 'Download URL is required'),
})

type FormData = z.infer<typeof schema>

interface LeadMagnetFormProps {
  leadMagnet?: {
    id: string
    title: string
    description: string
    downloadUrl: string
    downloads: number
    createdAt: string
  } | null
  onClose: () => void
  onSubmit: (data: Omit<FormData, 'id' | 'downloads' | 'createdAt'>) => void
}

const LeadMagnetForm = ({ leadMagnet, onClose, onSubmit }: LeadMagnetFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: leadMagnet?.title || '',
      description: leadMagnet?.description || '',
      downloadUrl: leadMagnet?.downloadUrl || '',
    },
  })

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
                {leadMagnet ? 'Edit Lead Magnet' : 'Add New Lead Magnet'}
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
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      {...register('description')}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="downloadUrl"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Download URL
                    </label>
                    <input
                      id="downloadUrl"
                      type="url"
                      {...register('downloadUrl')}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                    />
                    {errors.downloadUrl && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.downloadUrl.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                    >
                      {leadMagnet ? 'Update Lead Magnet' : 'Add Lead Magnet'}
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

export default LeadMagnetForm
  