
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  BarChart2, 
  Download, 
  Settings 
} from 'lucide-react'

const Sidebar = () => {
  const { pathname } = useLocation()
  const { user } = useAuth()

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/links', icon: LinkIcon, label: 'Links' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/lead-magnets', icon: Download, label: 'Lead Magnets' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-dark-700">
          <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
            InfluencerOS
          </h1>
        </div>
        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <div className="flex items-center px-4 py-3 mb-4 rounded-lg bg-gray-100 dark:bg-dark-700">
            <div className="flex-shrink-0">
              <img
                className="w-10 h-10 rounded-full"
                src={user?.avatarUrl || 'https://i.pravatar.cc/300'}
                alt="User avatar"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                @{user?.username || 'username'}
              </p>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  pathname === item.path
                    ? 'bg-primary-50 text-primary-600 dark:bg-dark-700 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
  