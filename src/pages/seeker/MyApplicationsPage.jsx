import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import {
  FiBriefcase, FiClock, FiCheckCircle,
  FiXCircle, FiArrowLeft, FiEye
} from 'react-icons/fi'

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await api.get('/seeker/applications/')
      setApplications(response.data)
    } finally {
      setLoading(false)
    }
  }

  const statusConfig = {
    pending: {
      label: 'Pending',
      class: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      icon: <FiClock size={14} />
    },
    accepted: {
      label: 'Accepted',
      class: 'bg-green-100 text-green-700 border border-green-200',
      icon: <FiCheckCircle size={14} />
    },
    rejected: {
      label: 'Rejected',
      class: 'bg-red-100 text-red-700 border border-red-200',
      icon: <FiXCircle size={14} />
    },
  }

  const filtered = filter === 'all'
    ? applications
    : applications.filter(a => a.status === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <Link
          to="/seeker/dashboard"
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-6"
        >
          <FiArrowLeft />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-6 text-white">
          <h1 className="text-2xl font-bold">My Applications</h1>
          <p className="text-blue-200 mt-1">{applications.length} total applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total', value: applications.length, color: 'blue', key: 'all' },
            { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: 'green', key: 'accepted' },
            { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, color: 'yellow', key: 'pending' },
          ].map((stat, i) => (
            <button
              key={i}
              onClick={() => setFilter(stat.key)}
              className={`bg-white rounded-2xl shadow-sm p-4 text-center transition hover:shadow-md ${
                filter === stat.key ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </button>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {['all', 'pending', 'accepted', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
            <FiBriefcase size={48} className="mx-auto mb-3 opacity-20" />
            <p>No applications found</p>
            <Link to="/jobs" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(app => (
              <div key={app.id} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <FiBriefcase className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{app.job_title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Applied on {new Date(app.applied_at).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>

                  <span className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full ${statusConfig[app.status]?.class}`}>
                    {statusConfig[app.status]?.icon}
                    {statusConfig[app.status]?.label}
                  </span>
                </div>

                {/* Cover Letter */}
                {app.cover_letter && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Your Cover Letter</p>
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{app.cover_letter}</p>
                  </div>
                )}

                {/* View Job */}
                <div className="mt-4">
                  <Link
                    to={`/jobs/${app.id}`}
                    className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
                  >
                    <FiEye size={14} />
                    View Job
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyApplicationsPage