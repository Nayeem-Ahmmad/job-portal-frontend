import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import {
  FiArrowLeft, FiUser, FiCheckCircle,
  FiXCircle, FiClock, FiDownload
} from 'react-icons/fi'

const ApplicantsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [applicants, setApplicants] = useState([])
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [jobRes, appRes] = await Promise.all([
        api.get(`/employer/jobs/${id}/`),
        api.get(`/employer/jobs/${id}/applicants/`),
      ])
      setJob(jobRes.data)
      setApplicants(appRes.data)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (appId, status) => {
    setUpdating(appId)
    try {
      await api.put(`/employer/applications/${appId}/status/`, { status })
      setApplicants(applicants.map(app =>
        app.id === appId ? { ...app, status } : app
      ))
    } catch {
      alert('Failed to update status.')
    } finally {
      setUpdating(null)
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
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate('/employer/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition mb-6"
        >
          <FiArrowLeft />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 mb-6 text-white">
          <h1 className="text-2xl font-bold">{job?.title}</h1>
          <p className="text-indigo-200 mt-1">
            {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total', value: applicants.length, color: 'blue' },
            { label: 'Accepted', value: applicants.filter(a => a.status === 'accepted').length, color: 'green' },
            { label: 'Rejected', value: applicants.filter(a => a.status === 'rejected').length, color: 'red' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-4 text-center">
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Applicants List */}
        {applicants.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
            <FiUser size={48} className="mx-auto mb-3 opacity-20" />
            <p>No applicants yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map(app => (
              <div key={app.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                      <FiUser className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{app.seeker_username}</h3>
                      <p className="text-sm text-gray-500">Applied for: {app.job_title}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${statusConfig[app.status]?.class}`}>
                    {statusConfig[app.status]?.icon}
                    {statusConfig[app.status]?.label}
                  </span>
                </div>

                {/* Cover Letter */}
                {app.cover_letter && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Cover Letter</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{app.cover_letter}</p>
                  </div>
                )}

                {/* Actions */}
                {app.status === 'pending' && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleStatusChange(app.id, 'accepted')}
                      disabled={updating === app.id}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <FiCheckCircle size={16} />
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(app.id, 'rejected')}
                      disabled={updating === app.id}
                      className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600 transition disabled:opacity-50"
                    >
                      <FiXCircle size={16} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicantsPage