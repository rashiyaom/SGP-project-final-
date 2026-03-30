'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import {
  Calendar, Clock, Video, MapPin, Phone, Mail, CheckCircle, 
  Clock4, XCircle, AlertCircle
} from 'lucide-react'

interface Appointment {
  _id: string
  type: 'online' | 'offline'
  date: string
  time: string
  purpose: string
  status: 'pending' | 'confirmed' | 'rejected' | 'rescheduled' | 'completed' | 'cancelled'
  address?: string
  city?: string
  pincode?: string
  adminNotes?: string
  createdAt: string
}

export default function MyAppointmentsPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }
    fetchAppointments()
  }, [isAuthenticated])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/appointments?userId=${user?._id}`)
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

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      confirmed: <CheckCircle className="w-5 h-5 text-green-600" />,
      pending: <Clock4 className="w-5 h-5 text-yellow-600" />,
      completed: <CheckCircle className="w-5 h-5 text-green-600" />,
      rejected: <XCircle className="w-5 h-5 text-red-600" />,
      cancelled: <XCircle className="w-5 h-5 text-gray-600" />,
      rescheduled: <AlertCircle className="w-5 h-5 text-blue-600" />
    }
    return icons[status]
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      rescheduled: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-300'
    }
    return colors[status]
  }

  const filteredAppointments = filterStatus === 'all'
    ? appointments
    : appointments.filter(a => a.status === filterStatus)

  const upcomingAppointments = appointments.filter(a => 
    new Date(a.date) > new Date() && ['confirmed', 'pending'].includes(a.status)
  )

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full" />
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-serif text-foreground mb-2">My Appointments</h1>
            <p className="text-muted-foreground">Track your scheduled visits and consultations</p>
          </motion.div>

          {/* Stats */}
          {upcomingAppointments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            >
              <div className="bg-gradient-to-br from-[#d4af37]/20 to-[#bfa14a]/10 border border-[#d4af37]/30 rounded-xl p-4">
                <p className="text-muted-foreground text-sm mb-1">Upcoming Appointments</p>
                <p className="text-3xl font-bold text-foreground">{upcomingAppointments.length}</p>
              </div>
              {upcomingAppointments[0] && (
                <div className="bg-green-100/50 border border-green-300 rounded-xl p-4">
                  <p className="text-muted-foreground text-sm mb-1">Next Appointment</p>
                  <p className="font-semibold text-foreground">
                    {new Date(upcomingAppointments[0].date).toLocaleDateString('en-IN')} at {upcomingAppointments[0].time}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {['all', 'pending', 'confirmed', 'completed', 'rescheduled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all text-sm ${
                  filterStatus === status
                    ? 'bg-[#d4af37] text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Appointments List */}
          {filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-border rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {appointment.type === 'online' ? (
                        <Video size={24} className="text-[#d4af37]" />
                      ) : (
                        <MapPin size={24} className="text-[#d4af37]" />
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {appointment.type === 'online' ? '📹 Video Consultation' : '🏢 Showroom Visit'}
                        </h3>
                        <p className="text-sm text-muted-foreground">{appointment.purpose}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-2 ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      {appointment.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-medium text-foreground">
                          {new Date(appointment.date).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="font-medium text-foreground">{appointment.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Confirmation Status</p>
                        <p className="font-medium text-foreground">
                          {appointment.status === 'confirmed' ? '✓ Confirmed' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {appointment.type === 'offline' && appointment.address && (
                    <div className="bg-muted/30 rounded-lg p-3 mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Visit Location</p>
                      <p className="font-medium text-foreground">
                        {appointment.address}, {appointment.city} - {appointment.pincode}
                      </p>
                    </div>
                  )}

                  {appointment.adminNotes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Admin Notes</p>
                      <p className="text-sm text-foreground">{appointment.adminNotes}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Calendar size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No appointments yet</h3>
              <p className="text-muted-foreground mb-6">
                Book a consultation or showroom visit to get started
              </p>
              <button
                onClick={() => router.push('/contact')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#bfa14a] text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Book Now
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
