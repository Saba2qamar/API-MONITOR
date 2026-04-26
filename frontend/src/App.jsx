import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './components/Dashboard'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'

function AppContent() {
  const { user } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  if (user) {
    return <Dashboard />
  }

  if (showLogin) {
    return (
      <LoginPage
        onSwitch={() => setShowLogin(false)}
        onBack={() => setShowLogin(false)}
      />
    )
  }

  return (
    <LandingPage onLogin={() => setShowLogin(true)} />
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App