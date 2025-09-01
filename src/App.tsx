
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './pages/Dashboard'
import Links from './pages/Links'
import Analytics from './pages/Analytics'
import LeadMagnets from './pages/LeadMagnets'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/links" element={<Links />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/lead-magnets" element={<LeadMagnets />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
  