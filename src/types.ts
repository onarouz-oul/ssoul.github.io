
export interface User {
  id: string
  name: string
  username: string
  email: string
  avatarUrl: string
  niche: string
  onboarded: boolean
  createdAt: string
  updatedAt: string
}

export interface Link {
  id: string
  title: string
  url: string
  icon: string
  clicks: number
  order: number
  createdAt: string
  updatedAt: string
}

export interface LeadMagnet {
  id: string
  title: string
  description: string
  downloadUrl: string
  downloads: number
  createdAt: string
  updatedAt: string
}

export interface AnalyticsData {
  timeSeries: {
    date: string
    clicks: number
  }[]
  topLinks: {
    title: string
    clicks: number
  }[]
  sources: {
    name: string
    value: number
    change: number
  }[]
  locations: {
    id: string
    name: string
    value: number
  }[]
}
  