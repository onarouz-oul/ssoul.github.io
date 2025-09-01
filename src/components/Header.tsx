
import { useAuth } from '../context/AuthContext'
import { LogOut, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
  const { user, logout } = useAuth()
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  )

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
    document.documentElement.classList.toggle('dark', newMode)
  }

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          InfluencerOS
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 dark:text-gray-400"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          onClick={logout}
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 dark:text-gray-400"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}

export default Header
  