
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from './Layout'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Layout>{children}</Layout>
}

export default PrivateRoute
  