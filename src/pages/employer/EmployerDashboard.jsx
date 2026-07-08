import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import {
  FiBriefcase, FiUsers, FiPlusCircle,
  FiCheckCircle, FiClock, FiXCircle,
  FiArrowRight, FiEdit, FiTrash2, FiEye
} from 'react-icons/fi'

const EmployerDashboard = () => {
  const { user } = useAuth()
  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [companyRes, jobsRes] = await Promise.all([
        api.get('/employer/profile/').catch(() => ({ data: null })),
        api.get('/employer/jobs/').catch(() => ({ data: [] })),
      ])
      setCompany(companyRes.data)
      setJobs(jobsRes.data)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    try {
      await api.delete(`/employer/jobs/${id}/`)
      setJobs(jobs.filter(j => j.id !== id))
    } catch {
      alert('Failed to delete job.')
    }
  }

  const jobTypeBadge = {
    full_time: { label: 'Full Time', class: 'bg-emerald-100 text-emerald-700' },
    part_time: { label: 'Part Time', class: 'bg-amber-100 text-amber-700' },
    remote: { label: 'Remote', class: 'bg-blue-100 text-blue-700' },
    internship: { label: 'Internship', class: 'bg-purple-100 text-purple-700' },
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
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FiBriefcase size={30} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {company?.name || `Welcome, ${user?.username}!`} 👋
                </h1>
                <p className="text-indigo-200 mt-1">Employer Dashboard</p>
              </div>
            </div>
            <Link
              to="/employer/post-job"
              className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-xl font-semibold hover:bg-indigo-50 transition"
            >
              <FiPlusCircle size={18} />
              Post Job
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Jobs', value: jobs.length, icon: <FiBriefcase />, color: 'indigo' },
            { label: 'Active Jobs', value: jobs.filter(j => j.is_active).length, icon: <FiCheckCircle />, color: 'green' },
            { label: 'Closed Jobs', value: jobs.filter(j => !j.is_active).length, icon: <FiXCircle />, color: 'red' },
            { label: 'Pending Review', value: jobs.filter(j => j.is_active).length, icon: <FiClock />, color: 'yellow' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-5">
              <div className={`text-${stat.color}-500 mb-2`}>{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Company Profile */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Company Profile</h2>
              <Link to="/employer/profile" className="text-blue-600 text-sm hover:underline">Edit</Link>
            </div>
            {company ? (
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Company:</span> {company.name}</p>
                <p><span className="font-medium">Location:</span> {company.location || 'Not set'}</p>
                {company.website && (
                  <p>
                    <span className="font-medium">Website:</span>{' '}
                    <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      {company.website}
                    </a>
                  </p>
                )}
                {company.description && (
                  <p className="text-gray-500 text-xs mt-2 line-clamp-3">{company.description}</p>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm mb-3">No company profile yet</p>
                <Link
                  to="/employer/profile"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
                >
                  Create Profile
                </Link>
              </div>
            )}
          </div>

          {/* Jobs List */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">My Job Posts</h2>
              <Link
                to="/employer/post-job"
                className="flex items-center gap-1 text-indigo-600 text-sm hover:underline"
              >
                <FiPlusCircle size={14} />
                Add New
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FiBriefcase size={36} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">No jobs posted yet</p>
                <Link
                  to="/employer/post-job"
                  className="text-indigo-600 text-sm mt-2 inline-block hover:underline"
                >
                  Post your first job
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800 text-sm">{job.title}</p>
                        {jobTypeBadge[job.job_type] && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${jobTypeBadge[job.job_type].class}`}>
                            {jobTypeBadge[job.job_type].label}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">{job.location}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Link
                        to={`/employer/jobs/${job.id}/applicants`}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="View Applicants"
                      >
                        <FiUsers size={16} />
                      </Link>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                        title="View Job"
                      >
                        <FiEye size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                        title="Delete Job"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { to: '/employer/post-job', label: 'Post New Job', icon: <FiPlusCircle />, color: 'indigo' },
            { to: '/employer/profile', label: 'Company Profile', icon: <FiBriefcase />, color: 'blue' },
            { to: '/jobs', label: 'Browse Jobs', icon: <FiEye />, color: 'green' },
            { to: '/notifications', label: 'Notifications', icon: <FiCheckCircle />, color: 'purple' },
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
              <FiArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-indigo-500 transition" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmployerDashboard