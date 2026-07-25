import { Routes, Route } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Navbar from './components/Navbar'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import JobsPage from './pages/JobsPage'
import JobDetailPage from './pages/JobDetailPage'
import NotificationsPage from './pages/NotificationsPage'

import SeekerDashboard from './pages/seeker/SeekerDashboard'
import MyApplicationsPage from './pages/seeker/MyApplicationsPage'
import SavedJobsPage from './pages/seeker/SavedJobsPage'
import SeekerProfilePage from './pages/seeker/SeekerProfilePage'

import EmployerDashboard from './pages/employer/EmployerDashboard'
import PostJobPage from './pages/employer/PostJobPage'
import ApplicantsPage from './pages/employer/ApplicantsPage'
import CompanyProfilePage from './pages/employer/CompanyProfilePage'

import AdminDashboard from './pages/admin/AdminDashboard'
import HomePage from './pages/HomePage'



function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SpeedInsights />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Seeker */}
        <Route path="/seeker/dashboard" element={<SeekerDashboard />} />
        <Route path="/seeker/applications" element={<MyApplicationsPage />} />
        <Route path="/seeker/saved-jobs" element={<SavedJobsPage />} />
        <Route path="/seeker/profile" element={<SeekerProfilePage />} />

        {/* Employer */}
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/post-job" element={<PostJobPage />} />
        <Route path="/employer/jobs/:id/applicants" element={<ApplicantsPage />} />
        <Route path="/employer/profile" element={<CompanyProfilePage />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<HomePage />} />



      </Routes>
    </div>
  )
}

export default App