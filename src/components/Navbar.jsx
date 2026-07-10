import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import api from '../services/api'
import {
  FiBriefcase, FiBell, FiUser, FiLogOut,
  FiMenu, FiX, FiChevronDown
} from 'react-icons/fi'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/')
      setUnreadCount(res.data.filter(n => !n.is_read).length)
    } catch {
      console.error('Failed to fetch notifications')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-slate-900 sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="bg-violet-600 p-1.5 rounded-lg">
            <FiBriefcase className="text-white" size={20} />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Job<span className="text-violet-400">Portal</span> BD
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/jobs" className="text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-lg font-medium transition text-sm">
            Browse Jobs
          </Link>

          {!user ? (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/login" className="text-slate-300 hover:text-white px-4 py-2 rounded-lg font-medium transition text-sm">
                Login
              </Link>
              <Link to="/register" className="bg-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-violet-700 transition text-sm">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1 ml-2">
              {user.role === 'job_seeker' && (
                <>
                  <Link to="/seeker/dashboard" className="text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-lg font-medium transition text-sm">Dashboard</Link>
                  <Link to="/seeker/applications" className="text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-lg font-medium transition text-sm">Applications</Link>
                  <Link to="/seeker/saved-jobs" className="text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-lg font-medium transition text-sm">Saved</Link>
                </>
              )}
              {user.role === 'employer' && (
                <>
                  <Link to="/employer/dashboard" className="text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-lg font-medium transition text-sm">Dashboard</Link>
                  <Link to="/employer/post-job" className="bg-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-violet-700 transition text-sm">Post Job</Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-lg font-medium transition text-sm">Admin Panel</Link>
              )}

              {/* Notification Bell */}
              <Link to="/notifications" className="relative text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition ml-1">
                <FiBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative ml-1">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition"
                >
                  <div className="w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.username}</span>
                  <FiChevronDown size={14} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                    <Link
                      to={user.role === 'job_seeker' ? '/seeker/profile' : '/employer/profile'}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FiUser size={15} />
                      My Profile
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => { handleLogout(); setDropdownOpen(false) }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition w-full text-left"
                    >
                      <FiLogOut size={15} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-3 flex flex-col gap-1">
          <Link to="/jobs" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
          {!user ? (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="bg-violet-600 text-white px-3 py-2 rounded-lg text-sm text-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          ) : (
            <>
              {user.role === 'job_seeker' && (
                <>
                  <Link to="/seeker/dashboard" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/seeker/applications" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm" onClick={() => setMenuOpen(false)}>Applications</Link>
                  <Link to="/seeker/saved-jobs" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm" onClick={() => setMenuOpen(false)}>Saved Jobs</Link>
                  <Link to="/seeker/profile" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm" onClick={() => setMenuOpen(false)}>Profile</Link>
                </>
              )}
              {user.role === 'employer' && (
                <>
                  <Link to="/employer/dashboard" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/employer/post-job" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm" onClick={() => setMenuOpen(false)}>Post Job</Link>
                  <Link to="/employer/profile" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm" onClick={() => setMenuOpen(false)}>Company Profile</Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
              )}
              <Link to="/notifications" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                Notifications {unreadCount > 0 && <span className="bg-rose-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
              </Link>
              <button onClick={handleLogout} className="text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg text-sm text-left">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar