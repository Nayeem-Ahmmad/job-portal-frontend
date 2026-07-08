import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { FiArrowLeft, FiUser, FiPlus, FiTrash2, FiSave } from 'react-icons/fi'

const SeekerProfilePage = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [allSkills, setAllSkills] = useState([])
  const [educations, setEducations] = useState([])
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [profileForm, setProfileForm] = useState({ bio: '', location: '' })
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', start_year: '', end_year: '' })
  const [expForm, setExpForm] = useState({ company_name: '', position: '', start_date: '', end_date: '', is_current: false })
  const [selectedSkill, setSelectedSkill] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [profileRes, skillsRes, allSkillsRes, eduRes, expRes] = await Promise.all([
        api.get('/seeker/profile/').catch(() => ({ data: null })),
        api.get('/seeker/my-skills/').catch(() => ({ data: [] })),
        api.get('/seeker/skills/').catch(() => ({ data: [] })),
        api.get('/seeker/education/').catch(() => ({ data: [] })),
        api.get('/seeker/experience/').catch(() => ({ data: [] })),
      ])
      if (profileRes.data) {
        setProfile(profileRes.data)
        setProfileForm({ bio: profileRes.data.bio || '', location: profileRes.data.location || '' })
      }
      setSkills(skillsRes.data)
      setAllSkills(allSkillsRes.data)
      setEducations(eduRes.data)
      setExperiences(expRes.data)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      if (profile) {
        await api.put('/seeker/profile/', profileForm)
      } else {
        await api.post('/seeker/profile/', profileForm)
      }
      setMessage('Profile saved successfully!')
      fetchData()
    } catch {
      setMessage('Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddSkill = async () => {
    if (!selectedSkill) return
    try {
      await api.post('/seeker/my-skills/', { skill_id: selectedSkill })
      fetchData()
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Failed to add skill.')
    }
  }

  const handleRemoveSkill = async (skillId) => {
    try {
      await api.delete('/seeker/my-skills/', { data: { skill_id: skillId } })
      fetchData()
    } catch {
      setMessage('Failed to remove skill.')
    }
  }

  const handleAddEducation = async (e) => {
    e.preventDefault()
    try {
      await api.post('/seeker/education/', eduForm)
      setEduForm({ degree: '', institution: '', start_year: '', end_year: '' })
      fetchData()
    } catch {
      setMessage('Failed to add education.')
    }
  }

  const handleDeleteEducation = async (id) => {
    try {
      await api.delete(`/seeker/education/${id}/`)
      fetchData()
    } catch {
      setMessage('Failed to delete education.')
    }
  }

  const handleAddExperience = async (e) => {
    e.preventDefault()
    try {
      await api.post('/seeker/experience/', expForm)
      setExpForm({ company_name: '', position: '', start_date: '', end_date: '', is_current: false })
      fetchData()
    } catch (err) {
      setMessage(err.response?.data?.end_date?.[0] || 'Failed to add experience.')
    }
  }

  const handleDeleteExperience = async (id) => {
    try {
      await api.delete(`/seeker/experience/${id}/`)
      fetchData()
    } catch {
      setMessage('Failed to delete experience.')
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

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <FiUser size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.username}</h1>
              <p className="text-blue-200">{user?.email}</p>
            </div>
          </div>
        </div>

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {message}
          </div>
        )}

        <div className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={3}
                  placeholder="Tell employers about yourself..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                <FiSave size={16} />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map(skill => (
                <span key={skill.id} className="flex items-center gap-1 bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full">
                  {skill.name}
                  <button onClick={() => handleRemoveSkill(skill.id)} className="hover:text-red-500 transition">×</button>
                </span>
              ))}
              {skills.length === 0 && <p className="text-gray-400 text-sm">No skills added yet</p>}
            </div>
            <div className="flex gap-2">
              <select
                value={selectedSkill}
                onChange={e => setSelectedSkill(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a skill...</option>
                {allSkills.filter(s => !skills.find(sk => sk.id === s.id)).map(skill => (
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
              </select>
              <button
                onClick={handleAddSkill}
                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
              >
                <FiPlus size={16} /> Add
              </button>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Education</h2>
            <div className="space-y-3 mb-4">
              {educations.map(edu => (
                <div key={edu.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                  <div>
                    <p className="font-medium text-gray-800">{edu.degree}</p>
                    <p className="text-sm text-gray-500">{edu.institution} • {edu.start_year} - {edu.end_year || 'Present'}</p>
                  </div>
                  <button onClick={() => handleDeleteEducation(edu.id)} className="text-red-400 hover:text-red-600 transition">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddEducation} className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Degree *"
                value={eduForm.degree}
                onChange={e => setEduForm({ ...eduForm, degree: e.target.value })}
                required
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Institution *"
                value={eduForm.institution}
                onChange={e => setEduForm({ ...eduForm, institution: e.target.value })}
                required
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Start Year *"
                value={eduForm.start_year}
                onChange={e => setEduForm({ ...eduForm, start_year: e.target.value })}
                required
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="End Year"
                value={eduForm.end_year}
                onChange={e => setEduForm({ ...eduForm, end_year: e.target.value })}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="col-span-2 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition"
              >
                <FiPlus size={16} /> Add Education
              </button>
            </form>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Experience</h2>
            <div className="space-y-3 mb-4">
              {experiences.map(exp => (
                <div key={exp.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                  <div>
                    <p className="font-medium text-gray-800">{exp.position}</p>
                    <p className="text-sm text-gray-500">{exp.company_name} • {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}</p>
                  </div>
                  <button onClick={() => handleDeleteExperience(exp.id)} className="text-red-400 hover:text-red-600 transition">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddExperience} className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Company Name *"
                value={expForm.company_name}
                onChange={e => setExpForm({ ...expForm, company_name: e.target.value })}
                required
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Position *"
                value={expForm.position}
                onChange={e => setExpForm({ ...expForm, position: e.target.value })}
                required
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                placeholder="Start Date *"
                value={expForm.start_date}
                onChange={e => setExpForm({ ...expForm, start_date: e.target.value })}
                required
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                placeholder="End Date"
                value={expForm.end_date}
                onChange={e => setExpForm({ ...expForm, end_date: e.target.value })}
                disabled={expForm.is_current}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <label className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
                <input
                  type="checkbox"
                  checked={expForm.is_current}
                  onChange={e => setExpForm({ ...expForm, is_current: e.target.checked, end_date: '' })}
                  className="rounded"
                />
                Currently working here
              </label>
              <button
                type="submit"
                className="col-span-2 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition"
              >
                <FiPlus size={16} /> Add Experience
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeekerProfilePage