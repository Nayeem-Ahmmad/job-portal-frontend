import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { FiBookmark, FiMapPin, FiArrowLeft, FiTrash2, FiBriefcase } from 'react-icons/fi'

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  const fetchSavedJobs = async () => {
    try {
      const response = await api.get('/seeker/saved-jobs/')
      setSavedJobs(response.data)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (jobId) => {
    try {
      await api.delete('/seeker/saved-jobs/', { data: { job_id: jobId } })
      setSavedJobs(savedJobs.filter(s => s.id !== jobId))
    } catch {
      alert('Failed to remove job.')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        <Link to="/seeker/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-6">
          <FiArrowLeft /> Back to Dashboard
        </Link>

        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 mb-6 text-white">
          <h1 className="text-2xl font-bold">Saved Jobs</h1>
          <p className="text-purple-200 mt-1">{savedJobs.length} saved jobs</p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
            <FiBookmark size={48} className="mx-auto mb-3 opacity-20" />
            <p>No saved jobs yet</p>
            <Link to="/jobs" className="text-blue-600 text-sm mt-2 inline-block hover:underline">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map(saved => (
              <div key={saved.id} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                      <FiBriefcase className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{saved.job_title}</h3>
                      <p className="text-purple-600 font-medium text-sm">{saved.company_name}</p>
                      <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                        <FiMapPin size={13} />
                        <span>{saved.job_location}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(saved.id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
                <div className="mt-4 flex gap-3">
                  <Link
                    to={`/jobs/${saved.id}`}
                    className="flex-1 text-center bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                  >
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

export default SavedJobsPage