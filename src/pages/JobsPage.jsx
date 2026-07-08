import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { FiSearch, FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiSliders } from 'react-icons/fi'

const JobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    job_type: '',
    experience_level: '',
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async (params = {}) => {
    setLoading(true)
    try {
      const response = await api.get('/employer/jobs/', { params })
      setJobs(response.data)
    } catch {
      console.error('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs(filters)
  }

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value }
    setFilters(newFilters)
    fetchJobs(newFilters)
  }

  const clearFilters = () => {
    setFilters({ title: '', location: '', job_type: '', experience_level: '' })
    fetchJobs()
  }

  const jobTypeBadge = {
    full_time: { label: 'Full Time', class: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
    part_time: { label: 'Part Time', class: 'bg-amber-100 text-amber-700 border border-amber-200' },
    remote: { label: 'Remote', class: 'bg-blue-100 text-blue-700 border border-blue-200' },
    internship: { label: 'Internship', class: 'bg-purple-100 text-purple-700 border border-purple-200' },
  }

  const expBadge = {
    entry: { label: 'Entry Level', class: 'bg-gray-100 text-gray-600 border border-gray-200' },
    mid: { label: 'Mid Level', class: 'bg-orange-100 text-orange-600 border border-orange-200' },
    senior: { label: 'Senior Level', class: 'bg-red-100 text-red-600 border border-red-200' },
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Find Your Dream Job</h1>
          <p className="text-blue-200 mb-10 text-lg">Discover thousands of opportunities across Bangladesh</p>

          {/* Search */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                name="title"
                value={filters.title}
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                placeholder="Job title, company or keyword..."
                className="w-full pl-11 pr-4 py-3 rounded-xl text-gray-700 focus:outline-none bg-gray-50 focus:bg-white transition"
              />
            </div>
            <div className="w-px bg-gray-200 hidden md:block" />
            <div className="relative flex-1">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                placeholder="City or location..."
                className="w-full pl-11 pr-4 py-3 rounded-xl text-gray-700 focus:outline-none bg-gray-50 focus:bg-white transition"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition whitespace-nowrap"
            >
              Search Jobs
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-gray-500 font-medium">
            <FiSliders size={18} />
            <span className="text-sm">Filter by:</span>
          </div>

          <select
            name="job_type"
            value={filters.job_type}
            onChange={handleFilterChange}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          >
            <option value="">All Job Types</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="remote">Remote</option>
            <option value="internship">Internship</option>
          </select>

          <select
            name="experience_level"
            value={filters.experience_level}
            onChange={handleFilterChange}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          >
            <option value="">All Experience Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
          </select>

          {(filters.job_type || filters.experience_level) && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-700 font-medium ml-auto transition"
            >
              Clear Filters ×
            </button>
          )}

          <span className="text-sm text-gray-400 ml-auto">
            <span className="font-semibold text-gray-700">{jobs.length}</span> jobs found
          </span>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <FiBriefcase size={56} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-medium">No jobs found</p>
            <p className="text-sm mt-1">Try different keywords or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <Link
                to={`/jobs/${job.id}`}
                key={job.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 border border-transparent hover:border-blue-100 group"
              >
                {/* Company + Title */}
                <div className="mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-100 transition">
                    <FiBriefcase className="text-blue-600" size={22} />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition">
                    {job.title}
                  </h3>
                  <p className="text-blue-600 font-medium text-sm mt-1">{job.company_name}</p>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FiMapPin size={14} className="shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  {job.salary_min && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <FiDollarSign size={14} className="shrink-0" />
                      <span>
                        {Number(job.salary_min).toLocaleString()} – {Number(job.salary_max).toLocaleString()} BDT
                      </span>
                    </div>
                  )}
                  {job.deadline && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <FiClock size={14} className="shrink-0" />
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString('en-GB')}</span>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobsPage