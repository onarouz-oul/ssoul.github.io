
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { 
  ArrowUp, 
  ArrowDown, 
  Link as LinkIcon, 
  Download as DownloadIcon 
} from 'lucide-react'
import StatCard from '../components/StatCard'
import SparklineChart from '../components/SparklineChart'

interface DashboardStats {
  totalClicks: number
  last30DaysClicks: number
  trend: number[]
  leadMagnetDownloads: number
  topLink: {
    title: string
    clicks: number
  }
}

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/analytics/dashboard')
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Welcome back, {user?.name}
      </h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">
        Here's what's happening with your links today.
      </p>

      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clicks"
          value={stats.totalClicks.toLocaleString()}
          icon={<LinkIcon className="w-5 h-5 text-primary-500" />}
          trend={
            stats.trend[stats.trend.length - 1] > stats.trend[0] ? (
              <span className="flex items-center text-green-600 dark:text-green-400">
                <ArrowUp className="w-4 h-4" />
                <span className="ml-1">
                  {Math.round(
                    ((stats.trend[stats.trend.length - 1] - stats.trend[0]) /
                      stats.trend[0]) *
                      100
                  )}
                  %
                </span>
              </span>
            ) : (
              <span className="flex items-center text-red-600 dark:text-red-400">
                <ArrowDown className="w-4 h-4" />
                <span className="ml-1">
                  {Math.round(
                    ((stats.trend[0] - stats.trend[stats.trend.length - 1]) /
                      stats.trend[0]) *
                      100
                  )}
                  %
                </span>
              </span>
            )
          }
        />

        <StatCard
          title="Last 30 Days"
          value={stats.last30DaysClicks.toLocaleString()}
          icon={<LinkIcon className="w-5 h-5 text-secondary-500" />}
          chart={<SparklineChart data={stats.trend} />}
        />

        <StatCard
          title="Lead Magnet Downloads"
          value={stats.leadMagnetDownloads.toLocaleString()}
          icon={<DownloadIcon className="w-5 h-5 text-green-500" />}
        />

        <StatCard
          title="Top Performing Link"
          value={stats.topLink.title}
          subValue={`${stats.topLink.clicks.toLocaleString()} clicks`}
          icon={<LinkIcon className="w-5 h-5 text-purple-500" />}
        />
      </div>
    </div>
  )
}

export default Dashboard
  