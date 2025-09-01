
import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string
  subValue?: string
  icon?: ReactNode
  trend?: ReactNode
  chart?: ReactNode
}

const StatCard = ({
  title,
  value,
  subValue,
  icon,
  trend,
  chart,
}: StatCardProps) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-dark-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        {icon}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
        {subValue && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {subValue}
          </p>
        )}
        {trend && <div className="mt-2">{trend}</div>}
        {chart && <div className="mt-4 h-12">{chart}</div>}
      </div>
    </div>
  )
}

export default StatCard
  