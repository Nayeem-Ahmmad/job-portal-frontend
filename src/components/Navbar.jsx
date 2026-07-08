import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiBriefcase, FiBell, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <FiBriefcase size={24} />
          <span>JobPortal BD</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/jobs" className="text-gray-600 hover:text-blue-600 font-medium transition">
            Jobs
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Seeker Links */}
              {user.role === 'job_seeker' && (
                <>
                  <Link to="/seeker/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition">
                    Dashboard
                  </Link>
                  <Link to="/seeker/applications" className="text-gray-600 hover:text-blue-600 font-medium transition">
                    Applications
                  </Link>
                  <Link to="/seeker/saved-jobs" className="text-gray-600 hover:text-blue-600 font-medium transition">
                    Saved Jobs
                  </Link>
                </>
              )}

              {/* Employer Links */}
              {user.role === 'employer' && (
                <>
                  <Link to="/employer/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition">
                    Dashboard
                  </Link>
                  <Link to="/employer/post-job" className="text-gray-600 hover:text-blue-600 font-medium transition">
                    Post Job
                  </Link>
                </>
              )}

              {/* Admin Links */}
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition">
                  Admin Panel
                </Link>
              )}

              {/* Notification */}
              <Link to="/notifications" className="text-gray-600 hover:text-blue-600 transition">
                <FiBell size={20} />
              </Link>

              {/* User Info */}
              <div className="flex items-center gap-2 text-gray-700">
                <FiUser size={18} />
                <span className="font-medium">{user.username}</span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
              >
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3">
          <Link to="/jobs" className="text-gray-600 hover:text-blue-600 font-medium">Jobs</Link>
          {!user ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
              <Link to="/register" className="text-gray-600 hover:text-blue-600 font-medium">Register</Link>
            </>
          ) : (
            <>
              {user.role === 'job_seeker' && (
                <>
                  <Link to="/seeker/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                  <Link to="/seeker/applications" className="text-gray-600 hover:text-blue-600">Applications</Link>
                  <Link to="/seeker/saved-jobs" className="text-gray-600 hover:text-blue-600">Saved Jobs</Link>
                </>
              )}
              {user.role === 'employer' && (
                <>
                  <Link to="/employer/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                  <Link to="/employer/post-job" className="text-gray-600 hover:text-blue-600">Post Job</Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-600">Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="text-red-500 text-left">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar