'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, Phone, Mail, MapPin, Video, MessageCircle,
  CheckCircle, XCircle, Edit2, Eye, Trash2, Send
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { generateWhatsAppLink, getPresetMessage } from '@/lib/whatsapp-integration'

interface Appointment {
  _id: string
  userName: string
  userEmail: string
  userPhone: string
  type: 'online' | 'offline'
  date: string
  time: string
  purpose: string
  address?: string
  city?: string
  pincode?: string
  status: 'pending' | 'confirmed' | 'rejected' | 'rescheduled' | 'completed' | 'cancelled'
  createdAt: string
}

export default function AdminAppointmentsPage() {
  const { isAuthenticated, user, isAdmin } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])

  // ✅ SECURITY: Protect route - only admins can access
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/admin/login')
      return
    }
  }, [isAuthenticated, isAdmin, router])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/admin/login')
      return
    }
    fetchAppointments()
  }, [isAuthenticated, isAdmin, router])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/appointments', {
        headers: {
          'x-user-email': user?.email || '' // ✅ SECURITY: Send user email for auth
        }
      })
      const data = await response.json()
      if (data.success) {
        setAppointments(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedAppointment || !newStatus) return

    try {
      const dateTime = `${new Date(selectedAppointment.date).toLocaleDateString()} at ${selectedAppointment.time}`
      
      const response = await fetch(`/api/appointments?id=${selectedAppointment._id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': user?.email || '' // ✅ SECURITY: Send user email for auth
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNotes,
          updatedAt: new Date()
        })
      })

      if (response.ok) {
        fetchAppointments()
        setShowStatusModal(false)
        setNewStatus('')
        setAdminNotes('')
      }
    } catch (error) {
      console.error('Failed to update appointment:', error)
    }
  }

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return

    try {
      const response = await fetch(`/api/appointments?id=${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'x-user-email': user?.email || '' // ✅ SECURITY: Send user email for auth
        }
      })

      if (response.ok) {
        fetchAppointments()
      }
    } catch (error) {
      console.error('Failed to delete appointment:', error)
    }
  }

  const sendWhatsAppMessage = (appointment: Appointment, status: string) => {
    const dateTime = `${new Date(appointment.date).toLocaleDateString('en-IN')} at ${appointment.time}`
    const message = getPresetMessage(status, appointment.type, dateTime)
    const whatsappLink = generateWhatsAppLink(appointment.userPhone, message, appointment._id)
    window.open(whatsappLink, '_blank')
  }

  const filteredAppointments = filterStatus === 'all'
    ? appointments
    : appointments.filter(a => a.status === filterStatus)

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      rescheduled: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-purple-100 text-purple-800 border-purple-300',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-serif text-foreground mb-2">Appointments</h1>
          <p className="text-muted-foreground">Manage customer bookings and meetings</p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'confirmed', 'completed', 'rejected', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                filterStatus === status
                  ? 'bg-[#d4af37] text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-sm">
                ({filteredAppointments.length})
              </span>
            </button>
          ))}
        </div>

        {/* Appointments Grid */}
        {filteredAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAppointments.map((appointment) => (
              <motion.div
                key={appointment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-border rounded-xl p-4 hover:shadow-lg transition-all bg-card"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{appointment.userName}</h3>
                    <p className={`text-xs font-medium px-2 py-1 rounded border mt-1 w-fit ${getStatusColor(appointment.status)}`}>
                      {appointment.status.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment)
                        setShowDetailModal(true)
                      }}
                      className="p-2 hover:bg-muted rounded-lg transition-all"
                      title="View details"
                    >
                      <Eye size={18} className="text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(appointment._id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm mb-4">
                  {/* Type */}
                  <div className="flex items-center gap-2">
                    {appointment.type === 'online' ? (
                      <Video size={16} className="text-[#d4af37]" />
                    ) : (
                      <MapPin size={16} className="text-[#d4af37]" />
                    )}
                    <span className="text-muted-foreground">
                      {appointment.type === 'online' ? 'Online Video Call' : 'Showroom Visit'}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#d4af37]" />
                    <span className="text-muted-foreground">
                      {new Date(appointment.date).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#d4af37]" />
                    <span className="text-muted-foreground">{appointment.time}</span>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-[#d4af37]" />
                    <span className="text-muted-foreground text-xs truncate">{appointment.userEmail}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-[#d4af37]" />
                    <span className="text-muted-foreground">{appointment.userPhone}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedAppointment(appointment)
                      setNewStatus(appointment.status)
                      setShowStatusModal(true)
                    }}
                    className="flex-1 bg-[#d4af37] hover:bg-[#bfa14a] text-white py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    <Edit2 size={14} className="inline mr-1" />
                    Update Status
                  </button>
                  <button
                    onClick={() => sendWhatsAppMessage(appointment, appointment.status)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    <MessageCircle size={14} className="inline mr-1" />
                    WhatsApp
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No appointments found</p>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && selectedAppointment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusModal(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 z-50"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Update Appointment Status</h3>

              {/* Status Selection */}
              <div className="space-y-2 mb-4">
                {['confirmed', 'rescheduled', 'rejected', 'completed', 'cancelled'].map((status) => (
                  <label key={status} className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-muted transition-all">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={newStatus === status}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="font-medium capitalize">{status}</span>
                  </label>
                ))}
              </div>

              {/* Admin Notes */}
              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground block mb-2">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this appointment..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="flex-1 px-4 py-2 bg-[#d4af37] hover:bg-[#bfa14a] text-white rounded-lg font-medium transition-all"
                >
                  Update
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Detail View Modal */}
      <AnimatePresence>
        {showDetailModal && selectedAppointment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailModal(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 z-50 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">{selectedAppointment.userName}</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedAppointment.type === 'online' ? '📹 Online Video Call' : '🏢 Showroom Visit'}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {new Date(selectedAppointment.date).toLocaleDateString('en-IN')} at {selectedAppointment.time}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedAppointment.userEmail}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedAppointment.userPhone}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Purpose</p>
                  <p className="font-medium">{selectedAppointment.purpose}</p>
                </div>

                {selectedAppointment.type === 'offline' && selectedAppointment.address && (
                  <>
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-medium">{selectedAppointment.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-muted-foreground">City</p>
                        <p className="font-medium">{selectedAppointment.city}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pincode</p>
                        <p className="font-medium">{selectedAppointment.pincode}</p>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className={`font-medium px-2 py-1 rounded w-fit ${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status.toUpperCase()}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Booked On</p>
                  <p className="font-medium">{new Date(selectedAppointment.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full mt-6 px-4 py-2 bg-[#d4af37] hover:bg-[#bfa14a] text-white rounded-lg font-medium transition-all"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
