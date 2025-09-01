
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { GitHub } from 'lucide-react'

const Login = () => {
  const { login } = useAuth()

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data.type === 'oauth-callback') {
        login(event.data.code)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [login])

  const handleGitHubLogin = () => {
    const width = 600
    const height = 600
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    window.open(
      '/api/auth/github',
      'github-oauth',
      `width=${width},height=${height},top=${top},left=${left}`
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow dark:bg-dark-800">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to InfluencerOS
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your bio links and track analytics
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGitHubLogin}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <GitHub className="w-5 h-5 mr-2" />
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
  