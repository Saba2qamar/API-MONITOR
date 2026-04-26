import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // sessionStorage clears when browser tab is closed
    const token = sessionStorage.getItem('token')
    const name = sessionStorage.getItem('name')
    const apiKey = sessionStorage.getItem('apiKey')
    return token ? { token, name, apiKey } : null
  })

  const login = (token, name, apiKey) => {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('name', name)
    sessionStorage.setItem('apiKey', apiKey)
    setUser({ token, name, apiKey })
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('name')
    sessionStorage.removeItem('apiKey')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)