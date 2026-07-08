import { useState, useEffect } from 'react'
import api from '../services/api'
import { FiBell, FiCheck, FiCheckCircle } from 'react-icons/fi'

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/')
      setNotifications(res.data)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read/`)
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      ))
    } catch {
      console.error('Failed to mark as read')
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all/')
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
    } catch {
      console.error('Failed to mark all as read')
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-blue-200 mt-1">{unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
              >
                <FiCheckCircle size={16} />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
            <FiBell size={48} className="mx-auto mb-3 opacity-20" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`bg-white rounded-2xl shadow-sm p-5 flex items-start justify-between transition ${
                  !n.is_read ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${n.is_read ? 'bg-gray-100' : 'bg-blue-100'}`}>
                    <FiBell className={n.is_read ? 'text-gray-400' : 'text-blue-600'} size={16} />
                  </div>
                  <div>
                    <p className={`text-sm ${n.is_read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>
                {!n.is_read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="text-blue-600 hover:text-blue-800 transition shrink-0"
                    title="Mark as read"
                  >
                    <FiCheck size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage