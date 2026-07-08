import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FiSearch, FiBriefcase, FiUsers,
  FiTrendingUp, FiArrowRight, FiCheckCircle
} from 'react-icons/fi'

const HomePage = () => {
  const { user } = useAuth()

  const features = [
    { icon: <FiSearch size={24} />, title: 'Smart Job Search', desc: 'Search thousands of jobs by title, location, salary and more.' },
    { icon: <FiBriefcase size={24} />, title: 'Easy Apply', desc: 'Apply to jobs with one click and track your applications.' },
    { icon: <FiUsers size={24} />, title: 'Top Companies', desc: 'Connect with the best companies across Bangladesh.' },
    { icon: <FiTrendingUp size={24} />, title: 'Career Growth', desc: 'Find jobs that match your skills and experience level.' },
  ]

  const stats = [
    { value: '500+', label: 'Active Jobs' },
    { value: '200+', label: 'Companies' },
    { value: '10K+', label: 'Job Seekers' },
    { value: '95%', label: 'Success Rate' },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <FiCheckCircle size={16} />
            <span>Bangladesh's #1 Job Portal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="text-yellow-400"> Career</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Connect with top employers and discover thousands of job opportunities across Bangladesh
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition shadow-lg"
            >
              <FiSearch size={20} />
              Browse Jobs
            </Link>
            {!user && (
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 bg-blue-500/30 border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500/50 transition"
              >
                Get Started Free
                <FiArrowRight size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-12 px-4 shadow-sm">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-gray-500 mt-1 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Why Choose JobPortal BD?</h2>
            <p className="text-gray-500 mt-3 text-lg">Everything you need to land your dream job</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition group">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      {!user && (
        <div className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of professionals finding their dream jobs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition"
            >
              🔍 I'm Looking for a Job
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition"
            >
              🏢 I'm Hiring
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-white font-bold text-lg mb-2">
          <FiBriefcase />
          <span>JobPortal BD</span>
        </div>
        <p className="text-sm">© 2026 JobPortal BD. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default HomePage