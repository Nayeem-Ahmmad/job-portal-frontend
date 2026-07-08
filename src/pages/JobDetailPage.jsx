import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  FiMapPin, FiBriefcase, FiDollarSign, FiClock,
  FiBookmark, FiArrowLeft, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi'

const JobDetailPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [saving, setSaving] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    try {
      const response = await api.get(`/employer/jobs/${id}/`)
      setJob(response.data)
    } catch {
      navigate('/jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    setApplying(true)
    try {
      await api.post('/seeker/applications/', {
        job_id: id,
        cover_letter: coverLetter
      })
      setMessage({ type: 'success', text: 'Application submitted successfully!' })
      setShowApplyForm(false)
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to apply. Please try again.'
      })
    } finally {
      setApplying(false)
    }
  }

  const handleSave = async () => {
    if (!user) return navigate('/login')
    setSaving(true)
    try {
      await api.post('/seeker/saved-jobs/', { job_id: id })
      setMessage({ type: 'success', text: 'Job saved successfully!' })
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to save job.'
      })
    } finally {
      setSaving(false)
    }
  }

  const jobTypeBadge = {
    full_time: { label: 'Full Time', class: 'bg-emerald-100 text-emerald-700' },
    part_time: { label: 'Part Time', class: 'bg-amber-100 text-amber-700' },
    remote: { label: 'Remote', class: 'bg-blue-100 text-blue-700' },
    internship: { label: 'Internship', class: 'bg-purple-100 text-purple-700' },
  }

  const expBadge = {
    entry: { label: 'Entry Level', class: 'bg-gray-100 text-gray-600' },
    mid: { label: 'Mid Level', class: 'bg-orange-100 text-orange-600' },
    senior: { label: 'Senior Level', class: 'bg-red-100 text-red-600' },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    )
  }

  if (!job) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-6"
        >
          <FiArrowLeft />
          <span>Back to Jobs</span>
        </button>

        {/* Message */}
        {message.text && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-6 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success'
              ? <FiCheckCircle size={18} />
              : <FiAlertCircle size={18} />
            }
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Main Content */}
          <div className="md:col-span-2 space-y-5">

            {/* Job Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <FiBriefcase className="text-blue-600" size={26} />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
                  <p className="text-blue-600 font-semibold mt-1">{job.company_name}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {jobTypeBadge[job.job_type] && (
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${jobTypeBadge[job.job_type].class}`}>
                        {jobTypeBadge[job.job_type].label}
                      </span>
                    )}
                    {expBadge[job.experience_level] && (
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${expBadge[job.experience_level].class}`}>
                        {expBadge[job.experience_level].label}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FiMapPin className="text-blue-500" />
                  <span>{job.location}</span>
                </div>
                {job.salary_min && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FiDollarSign className="text-green-500" />
                    <span>{Number(job.salary_min).toLocaleString()} – {Number(job.salary_max).toLocaleString()} BDT</span>
                  </div>
                )}
                {job.deadline && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FiClock className="text-orange-500" />
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString('en-GB')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Job Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {/* Apply Form */}
            {showApplyForm && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Apply for this Job</h2>
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Tell the employer why you're the best fit for this role..."
                      rows={5}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={applying}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplyForm(false)}
                      className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Action Buttons */}
            {user?.role === 'job_seeker' && (
              <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
                <button
                  onClick={() => setShowApplyForm(!showApplyForm)}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  {showApplyForm ? 'Hide Form' : '🚀 Apply Now'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 border-2 border-blue-200 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition disabled:opacity-50"
                >
                  <FiBookmark />
                  {saving ? 'Saving...' : 'Save Job'}
                </button>
              </div>
            )}

            {/* Company Info */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3">Company Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Company:</span> {job.company_name}</p>
                <p><span className="font-medium">Location:</span> {job.company_location || job.location}</p>
              </div>
            </div>

            {/* Job Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3">Job Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Job Type</span>
                  <span className="font-medium text-gray-700">{jobTypeBadge[job.job_type]?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-medium text-gray-700">{expBadge[job.experience_level]?.label}</span>
                </div>
                {job.deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deadline</span>
                    <span className="font-medium text-gray-700">
                      {new Date(job.deadline).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailPage