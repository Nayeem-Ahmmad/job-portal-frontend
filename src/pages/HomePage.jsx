import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FiSearch, FiBriefcase, FiUsers,
  FiTrendingUp, FiArrowRight, FiCheckCircle,
  FiMapPin, FiStar
} from 'react-icons/fi'

const HomePage = () => {
  const { user } = useAuth()

  const features = [
    { icon: <FiSearch size={22} />, title: 'Smart Job Search', desc: 'Filter by title, location, salary, type and experience level.' },
    { icon: <FiBriefcase size={22} />, title: 'Easy Apply', desc: 'Apply with cover letter and track every application.' },
    { icon: <FiUsers size={22} />, title: 'Top Companies', desc: 'Connect with leading companies across Bangladesh.' },
    { icon: <FiTrendingUp size={22} />, title: 'Career Growth', desc: 'Find roles that match your skills and ambitions.' },
  ]

  const stats = [
    { value: '500+', label: 'Active Jobs' },
    { value: '200+', label: 'Companies' },
    { value: '10K+', label: 'Job Seekers' },
    { value: '95%', label: 'Success Rate' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <div className="bg-slate-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 to-slate-900 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-500/30 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-8">
            <FiStar size={14} />
            Bangladesh's #1 Job Portal
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Find Your
            <span className="text-violet-400"> Perfect</span>
            <br />Career Today
          </h1>
          <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with top employers and discover thousands of opportunities across Bangladesh
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="flex items-center justify-center gap-2 bg-violet-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-violet-700 transition shadow-lg shadow-violet-500/25"
            >
              <FiSearch size={20} />
              Browse Jobs
            </Link>
            {!user && (
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 border border-slate-600 text-slate-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition"
              >
                Get Started Free
                <FiArrowRight size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-slate-500 mt-1 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose JobPortal BD?</h2>
            <p className="text-slate-500 mt-3 text-lg">Everything you need to land your dream job</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-100 transition group">
                <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-600 group-hover:text-white transition">
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      {!user && (
        <div className="py-20 px-4 bg-slate-900 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-slate-400 mb-10 text-lg">Join thousands of professionals finding their dream jobs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-violet-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-violet-700 transition">
              🔍 I'm Looking for a Job
            </Link>
            <Link to="/register" className="border border-slate-600 text-slate-300 px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition">
              🏢 I'm Hiring
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-white font-bold text-lg mb-2">
          <div className="bg-violet-600 p-1 rounded-lg">
            <FiBriefcase size={16} />
          </div>
          <span>Job<span className="text-violet-400">Portal</span> BD</span>
        </div>
        <p className="text-sm">© 2026 JobPortal BD. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default HomePage