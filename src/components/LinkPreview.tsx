
import { Link as LinkIcon } from 'lucide-react'
import { icons } from '../lib/icons'

interface LinkPreviewProps {
  links: {
    id: string
    title: string
    url: string
    icon: string
    clicks: number
    order: number
  }[]
}

const LinkPreview = ({ links }: LinkPreviewProps) => {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow dark:bg-dark-800">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
          Link Preview
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          This is how your bio link will appear
        </p>

        <div className="mt-6">
          <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg dark:bg-dark-700">
            <div className="w-16 h-16 mb-4 overflow-hidden bg-white rounded-full dark:bg-dark-800">
              <img
                className="w-full h-full"
                src="https://i.pravatar.cc/300"
                alt="Profile"
              />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              @username
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fitness Influencer
            </p>

            <div className="w-full mt-6 space-y-3">
              {links.length > 0 ? (
                links.map((link) => {
                  const Icon = icons[link.icon] || LinkIcon
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-3 space-x-3 text-left transition-colors bg-white rounded-lg shadow-sm hover:bg-gray-50 dark:bg-dark-600 dark:hover:bg-dark-500"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary-50 dark:bg-dark-700">
                        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {link.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {link.url.replace(/^https?:\/\//, '').split('/')[0]}
                        </p>
                      </div>
                    </a>
                  )
                })
              ) : (
                <div className="px-4 py-3 text-sm text-center text-gray-500 bg-white rounded-lg shadow-sm dark:bg-dark-600 dark:text-gray-400">
                  No links added yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LinkPreview
  