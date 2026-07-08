import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import {
  FiUsers, FiBriefcase, FiFileText,
  FiCheckCircle, FiClock, FiXCircle,
  FiTrash2, FiEye
} from 'react-icons/fi'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [])

const fetchData = async () => {
  try {
    const [statsRes, usersRes, jobsRes, companiesRes] = await Promise.all([
      api.get('/admin-panel/dashboard/'),
      api.get('/auth/users/'),          // ← /api/users/ → /auth/users/
      api.get('/admin-panel/jobs/'),
      api.get('/admin-panel/companies/'),
    ])
    setStats(statsRes.data)
    setUsers(usersRes.data)
    setJobs(jobsRes.data)
    setCompanies(companiesRes.data)
  } finally {
    setLoading(false)
  }
}

  const handleDeleteUser = async (pk) => {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/auth/users/${pk}/`)
      setUsers(users.filter(u => u.id !== pk))
    } catch {
      alert('Failed to delete user.')
    }
  }

  const handleDeleteJob = async (pk) => {
    if (!confirm('Delete this job?')) return
    try {
      await api.delete(`/admin-panel/jobs/${pk}/`)
      setJobs(jobs.filter(j => j.id !== pk))
    } catch {
      alert('Failed to delete job.')
    }
  }

  const handleDeleteCompany = async (pk) => {
    if (!confirm('Delete this company?')) return
    try {
      await api.delete(`/admin-panel/companies/${pk}/`)
      setCompanies(companies.filter(c => c.id !== pk))
    } catch {
      alert('Failed to delete company.')
    }
  }

  const roleBadge = {
    admin: 'bg-red-100 text-red-700',
    employer: 'bg-indigo-100 text-indigo-700',
    job_seeker: 'bg-green-100 text-green-700',
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 text-white">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage users, jobs and companies</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Users', value: stats?.total_users, icon: <FiUsers />, color: 'blue' },
            { label: 'Total Jobs', value: stats?.total_jobs, icon: <FiBriefcase />, color: 'indigo' },
            { label: 'Companies', value: stats?.total_companies, icon: <FiBriefcase />, color: 'purple' },
            { label: 'Applications', value: stats?.total_applications, icon: <FiFileText />, color: 'green' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-5">
              <div className={`text-${stat.color}-500 mb-2`}>{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Application Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Pending', value: stats?.pending_applications, icon: <FiClock />, color: 'yellow' },
            { label: 'Accepted', value: stats?.accepted_applications, icon: <FiCheckCircle />, color: 'green' },
            { label: 'Rejected', value: stats?.rejected_applications, icon: <FiXCircle />, color: 'red' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
              <div className={`text-${stat.color}-500 text-2xl`}>{stat.icon}</div>
              <div>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label} Applications</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['overview', 'users', 'jobs', 'companies'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">All Users ({users.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {u.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{u.username}</p>
                      <p className="text-gray-400 text-xs">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleBadge[u.role]}`}>
                      {u.role}
                    </span>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">All Jobs ({jobs.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {jobs.map(job => (
                <div key={job.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{job.title}</p>
                    <p className="text-gray-400 text-xs">{job.company_name} • {job.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg transition"
                    >
                      <FiEye size={15} />
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === 'companies' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">All Companies ({companies.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {companies.map(company => (
                <div key={company.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{company.name}</p>
                    <p className="text-gray-400 text-xs">{company.location}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCompany(company.id)}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3">Recent Users</h3>
              <div className="space-y-2">
                {users.slice(0, 5).map(u => (
                  <div key={u.id} className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">{u.username}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadge[u.role]}`}>{u.role}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3">Recent Jobs</h3>
              <div className="space-y-2">
                {jobs.slice(0, 5).map(job => (
                  <div key={job.id} className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">{job.title}</p>
                    <p className="text-xs text-gray-400">{job.company_name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard