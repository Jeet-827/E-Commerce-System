import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from './store/Usercontext'

const ProtectRoute = () => {
  const { user, loading } = useUser()

  // While checking cookie — show nothing (prevents /login flash on refresh)
  if (loading) return null

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />

  // Logged in → render the child route
  return <Outlet />
}

export default ProtectRoute