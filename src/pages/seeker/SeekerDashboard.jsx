import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import {
  FiUser, FiBriefcase, FiBookmark, FiCheckCircle,
  FiClock, FiXCircle, FiArrowRight
} from 'react-icons/fi'

const SeekerDashboard = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState([])
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [profileRes, appRes, savedRes] = await Promise.all([
        api.get('/seeker/profile/').catch(() => ({ data: null })),
        api.get('/seeker/applications/').catch(() => ({ data: [] })),
        api.get('/seeker/saved-jobs/').catch(() => ({ data: [] })),
      ])
      setProfile(profileRes.data)
      setApplications(appRes.data)
      setSavedJobs(savedRes.data)
    } finally {
      setLoading(false)
    }
  }

  const statusConfig = {
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700', icon: <FiClock size={14} /> },
    accepted: { label: 'Accepted', class: 'bg-green-100 text-green-700', icon: <FiCheckCircle size={14} /> },
    rejected: { label: 'Rejected', class: 'bg-red-100 text-red-700', icon: <FiXCircle size={14} /> },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <FiUser size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user?.username}! 👋</h1>
              <p className="text-blue-200 mt-1">Job Seeker Dashboard</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Applied', value: applications.length, icon: <FiBriefcase />, color: 'blue' },
            { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, icon: <FiClock />, color: 'yellow' },
            { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, icon: <FiCheckCircle />, color: 'green' },
            { label: 'Saved Jobs', value: savedJobs.length, icon: <FiBookmark />, color: 'purple' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-5">
              <div className={`text-${stat.color}-500 mb-2`}>{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">My Profile</h2>
              <Link to="/seeker/profile" className="text-blue-600 text-sm hover:underline">Edit</Link>
            </div>
            {profile ? (
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Username:</span> {user?.username}</p>
                <p><span className="font-medium">Email:</span> {user?.email}</p>
                <p><span className="font-medium">Location:</span> {profile.location || 'Not set'}</p>
                <p><span className="font-medium">Bio:</span> {profile.bio || 'Not set'}</p>
                {profile.skills?.length > 0 && (
                  <div>
                    <span className="font-medium">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.skills.map(skill => (
                        <span key={skill.id} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm mb-3">No profile yet</p>
                <Link
                  to="/seeker/profile"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  Create Profile
                </Link>
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Recent Applications</h2>
              <Link to="/seeker/applications" className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
                View all <FiArrowRight size={14} />
              </Link>
            </div>
            {applications.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FiBriefcase size={36} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">No applications yet</p>
                <Link to="/jobs" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map(app => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{app.job_title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">Applied recently</p>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${statusConfig[app.status]?.class}`}>
                      {statusConfig[app.status]?.icon}
                      {statusConfig[app.status]?.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { to: '/jobs', label: 'Browse Jobs', icon: <FiBriefcase />, color: 'blue' },
            { to: '/seeker/applications', label: 'My Applications', icon: <FiCheckCircle />, color: 'green' },
            { to: '/seeker/saved-jobs', label: 'Saved Jobs', icon: <FiBookmark />, color: 'purple' },
            { to: '/seeker/profile', label: 'Edit Profile', icon: <FiUser />, color: 'indigo' },
          ].map((link, i) => (
            <Link
              key={i}
              to={link.to}
              className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition group"
            >
              <div className={`text-${link.color}-500 group-hover:scale-110 transition`}>
                {link.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{link.label}</span>
              <FiArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-blue-500 transition" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SeekerDashboard