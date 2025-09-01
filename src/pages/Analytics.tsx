
import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Calendar, 
  ArrowUp, 
  ArrowDown,
  Globe,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  Github,
  Spotify,
  Twitch,
  Tiktok
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const dateRanges = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Last 90 Days', value: '90days' },
  { label: 'Custom', value: 'custom' }
]

const sourceIcons = {
  instagram: <Instagram className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  youtube: <Youtube className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  github: <Github className="w-4 h-4" />,
  spotify: <Spotify className="w-4 h-4" />,
  twitch: <Twitch className="w-4 h-4" />,
  tiktok: <Tiktok className="w-4 h-4" />,
  direct: <Globe className="w-4 h-4" />
}

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30days')
  const [loading, setLoading] = useState(true)
  const [timeSeriesData, setTimeSeriesData] = useState([])
  const [topLinksData, setTopLinksData] = useState([])
  const [sourcesData, setSourcesData] = useState([])
  const [locationsData, setLocationsData] = useState([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`/api/analytics?range=${dateRange}`)
        setTimeSeriesData(data.timeSeries)
        setTopLinksData(data.topLinks)
        setSourcesData(data.sources)
        setLocationsData(data.locations)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [dateRange])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Track your link performance and audience insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow dark:bg-dark-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Clicks Over Time
              </h2>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        if (dateRange === 'today') return value.split(' ')[1]
                        if (dateRange === '7days') return value.split(' ')[0]
                        return value
                      }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow dark:bg-dark-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Top Links by Clicks
              </h2>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topLinksData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow dark:bg-dark-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Click Sources
              </h2>
              <div className="flex items-center justify-between mt-4">
                <div className="h-64 w-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourcesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sourcesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {sourcesData.map((source, index) => (
                    <div key={source.name} className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-gray-100 dark:bg-dark-700">
                        {sourceIcons[source.name.toLowerCase()] || sourceIcons.direct}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white capitalize">
                          {source.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {source.value} clicks
                        </p>
                      </div>
                      <div className="flex items-center ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {source.change > 0 ? (
                          <ArrowUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className="ml-1">
                          {Math.abs(source.change)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow dark:bg-dark-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Click Locations
              </h2>
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposableMap>
                    <Geographies geography="/features.json">
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const country = locationsData.find(
                            (d) => d.id === geo.id
                          )
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill={country ? '#8b5cf6' : '#e2e8f0'}
                              stroke="#D6D6DA"
                              style={{
                                default: { outline: 'none' },
                                hover: { outline: 'none' },
                                pressed: { outline: 'none' }
                              }}
                            />
                          )
                        })
                      }
                    </Geographies>
                  </ComposableMap>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {locationsData.slice(0, 4).map((location) => (
                    <div key={location.id} className="flex items-center">
                      <span className="inline-block w-3 h-3 mr-2 rounded-full bg-primary-500"></span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {location.name}
                      </span>
                      <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        {location.value} clicks
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics
  