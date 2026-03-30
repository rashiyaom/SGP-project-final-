'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, Phone, Mail, MapPin, Video, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail?: string
  userName?: string
  userId?: string
  source?: 'contact' | 'products' // Where the modal is opened from
}

export default function BookingModal({
  isOpen,
  onClose,
  userEmail,
  userName,
  userId
}: BookingModalProps) {
  const [step, setStep] = useState<'type' | 'details' | 'datetime' | 'confirm'>('type')
  const [appointmentType, setAppointmentType] = useState<'online' | 'offline' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: userName || '',
    email: userEmail || '',
    phone: '',
    date: '',
    time: '',
    purpose: '',
    // Offline specific
    location: '',
    address: '',
    city: '',
    pincode: '',
    // Online specific
    notes: ''
  })

  // Generate available time slots
  const timeSlots = useMemo(() => {
    const slots = []
    for (let hour = 9; hour < 18; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
        slots.push(timeStr)
      }
    }
    return slots
  }, [])

  // Generate available dates (next 30 days, excluding Sundays)
  const availableDates = useMemo(() => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      if (date.getDay() !== 0) { // Exclude Sundays
        dates.push(date)
      }
    }
    return dates
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectDate = (date: Date) => {
    setFormData(prev => ({
      ...prev,
      date: date.toISOString().split('T')[0]
    }))
  }

  const handleSelectTime = (time: string) => {
    setFormData(prev => ({
      ...prev,
      time
    }))
  }

  const validateStep = useCallback((): boolean => {
    if (step === 'type') {
      return appointmentType !== null
    }
    if (step === 'details') {
      if (appointmentType === 'online') {
        return !!(formData.name && formData.email && formData.phone && formData.purpose)
      } else {
        return !!(formData.name && formData.email && formData.phone && formData.location && formData.address && formData.city && formData.pincode)
      }
    }
    if (step === 'datetime') {
      return !!(formData.date && formData.time)
    }
    return true
  }, [step, appointmentType, formData])

  const handleNext = () => {
    if (!validateStep()) {
      setError('Please fill in all required fields')
      return
    }
    setError('')
    
    if (step === 'type') setStep('details')
    else if (step === 'details') setStep('datetime')
    else if (step === 'datetime') setStep('confirm')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      if (!userId) {
        setError('Please log in to book an appointment')
        setLoading(false)
        return
      }

      const payload = {
        userId,
        type: appointmentType,
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        date: new Date(formData.date),
        time: formData.time,
        purpose: formData.purpose,
        ...(appointmentType === 'online' ? {
          notes: formData.notes
        } : {
          location: formData.location,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode
        })
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': userEmail || formData.email // ✅ SECURITY: Send user email for auth
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to book appointment')
      }

      setSuccess(true)
      setTimeout(() => {
        setStep('type')
        setAppointmentType(null)
        setFormData({
          name: userName || '',
          email: userEmail || '',
          phone: '',
          date: '',
          time: '',
          purpose: '',
          location: '',
          address: '',
          city: '',
          pincode: '',
          notes: ''
        })
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Premium Modal */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Premium Header with Background Pattern */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-8">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-400/10 to-transparent rounded-full blur-3xl" />
              
              <div className="relative flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-amber-400" />
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Book Your Visit</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white leading-tight">Schedule Your<br />Experience</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all backdrop-blur-sm border border-white/20"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 flex gap-2">
                {(['type', 'details', 'datetime', 'confirm'] as const).map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ width: 0 }}
                    animate={{
                      width: step === s || (['type', 'details', 'datetime', 'confirm'].indexOf(step) > i) ? '100%' : '4px',
                      opacity: step === s || (['type', 'details', 'datetime', 'confirm'].indexOf(step) > i) ? 1 : 0.3
                    }}
                    className={`h-1 rounded-full ${
                      ['type', 'details', 'datetime', 'confirm'].indexOf(step) >= i
                        ? 'bg-gradient-to-r from-amber-400 to-amber-300'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8 bg-gradient-to-b from-white via-white to-slate-50">
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Type Selection */}
                    {step === 'type' && (
                      <div className="space-y-4">
                        <p className="text-sm text-slate-600 font-medium">Choose how you'd like to connect with our design experts:</p>
                        
                        <div className="space-y-3">
                          {/* Online Option */}
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setAppointmentType('online')}
                            className={`w-full relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                              appointmentType === 'online'
                                ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100/50'
                                : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                            }`}
                          >
                            {appointmentType === 'online' && (
                              <motion.div
                                layoutId="selection-bg"
                                className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent"
                              />
                            )}
                            <div className="relative p-5 flex items-start gap-4">
                              <div className={`mt-1 p-3 rounded-xl ${
                                appointmentType === 'online'
                                  ? 'bg-amber-400/20'
                                  : 'bg-slate-100'
                              }`}>
                                <Video size={24} className={appointmentType === 'online' ? 'text-amber-600' : 'text-slate-600'} />
                              </div>
                              <div className="text-left flex-1">
                                <p className="font-bold text-slate-900 text-lg">Video Consultation</p>
                                <p className="text-sm text-slate-500 mt-1">Connect from anywhere for personalized design guidance</p>
                              </div>
                              {appointmentType === 'online' && (
                                <CheckCircle2 size={24} className="text-amber-600 flex-shrink-0 mt-1" />
                              )}
                            </div>
                          </motion.button>

                          {/* Offline Option */}
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setAppointmentType('offline')}
                            className={`w-full relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                              appointmentType === 'offline'
                                ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100/50'
                                : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                            }`}
                          >
                            {appointmentType === 'offline' && (
                              <motion.div
                                layoutId="selection-bg"
                                className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent"
                              />
                            )}
                            <div className="relative p-5 flex items-start gap-4">
                              <div className={`mt-1 p-3 rounded-xl ${
                                appointmentType === 'offline'
                                  ? 'bg-amber-400/20'
                                  : 'bg-slate-100'
                              }`}>
                                <MapPin size={24} className={appointmentType === 'offline' ? 'text-amber-600' : 'text-slate-600'} />
                              </div>
                              <div className="text-left flex-1">
                                <p className="font-bold text-slate-900 text-lg">Showroom Visit</p>
                                <p className="text-sm text-slate-500 mt-1">Experience 500+ tiles and get hands-on expert assistance</p>
                              </div>
                              {appointmentType === 'offline' && (
                                <CheckCircle2 size={24} className="text-amber-600 flex-shrink-0 mt-1" />
                              )}
                            </div>
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {/* Details */}
                    {step === 'details' && appointmentType && (
                      <div className="space-y-5">
                        <div>
                          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 block">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all text-slate-900 placeholder:text-slate-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 block">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all text-slate-900 placeholder:text-slate-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 block">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all text-slate-900 placeholder:text-slate-400"
                          />
                        </div>

                        {appointmentType === 'online' && (
                          <>
                            <div>
                              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 block">What's Your Purpose?</label>
                              <textarea
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleInputChange}
                                placeholder="E.g., Design consultation, Product selection, Project planning..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all text-slate-900 placeholder:text-slate-400 resize-none"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 block">Additional Notes (Optional)</label>
                              <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Tell us anything important about your project..."
                                rows={2}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all text-slate-900 placeholder:text-slate-400 resize-none"
                              />
                            </div>
                          </>
                        )}

                        {appointmentType === 'offline' && (
                          <>
                            <div>
                              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 block">What Would You Like to Explore?</label>
                              <textarea
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleInputChange}
                                placeholder="E.g., Bathroom tiles, Kitchen design, Floor patterns..."
                                rows={2}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all text-slate-900 placeholder:text-slate-400 resize-none"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 block">Street Address</label>
                              <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter your address"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all text-slate-900 placeholder:text-slate-400"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 block">City</label>
                                <input
                                  type="text"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  placeholder="City"
                                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all text-slate-900 placeholder:text-slate-400"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 block">Pincode</label>
                                <input
                                  type="text"
                                  name="pincode"
                                  value={formData.pincode}
                                  onChange={handleInputChange}
                                  placeholder="Pincode"
                                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all text-slate-900 placeholder:text-slate-400"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Date & Time Selection */}
                    {step === 'datetime' && (
                      <div className="space-y-6">
                        {/* Date Selection */}
                        <div>
                          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 block flex items-center gap-2">
                            <Calendar size={14} />
                            Select Your Preferred Date
                          </label>
                          <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto pr-2">
                            {availableDates.map((date) => (
                              <motion.button
                                key={date.toISOString()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSelectDate(date)}
                                className={`p-3 rounded-xl border-2 text-center font-semibold transition-all ${
                                  formData.date === date.toISOString().split('T')[0]
                                    ? 'border-amber-400 bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg'
                                    : 'border-slate-200 bg-white text-slate-900 hover:border-amber-300 hover:shadow-md'
                                }`}
                              >
                                <div className="text-base">{date.getDate()}</div>
                                <div className="text-xs mt-1 opacity-75">
                                  {date.toLocaleDateString('en-IN', { weekday: 'short' })}
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Time Selection */}
                        {formData.date && (
                          <div>
                            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 block flex items-center gap-2">
                              <Clock size={14} />
                              Select Your Preferred Time
                            </label>
                            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-2">
                              {timeSlots.map((time) => (
                                <motion.button
                                  key={time}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSelectTime(time)}
                                  className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                                    formData.time === time
                                      ? 'border-amber-400 bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg'
                                      : 'border-slate-200 bg-white text-slate-900 hover:border-amber-300 hover:shadow-md'
                                  }`}
                                >
                                  {time}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Confirmation */}
                    {step === 'confirm' && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-5 space-y-4 border-2 border-slate-200">
                          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Booking Details</span>
                            <CheckCircle2 size={20} className="text-amber-600" />
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="text-sm text-slate-600 font-medium">Service Type:</span>
                              <span className="font-bold text-slate-900 text-right text-sm">
                                {appointmentType === 'online' ? '📹 Video Consultation' : '🏢 Showroom Visit'}
                              </span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="text-sm text-slate-600 font-medium">Name:</span>
                              <span className="font-bold text-slate-900 text-right text-sm">{formData.name}</span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="text-sm text-slate-600 font-medium">Email:</span>
                              <span className="font-bold text-slate-900 text-right text-xs break-all">{formData.email}</span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="text-sm text-slate-600 font-medium">Phone:</span>
                              <span className="font-bold text-slate-900 text-right text-sm">{formData.phone}</span>
                            </div>
                            <div className="h-px bg-slate-300" />
                            <div className="flex justify-between items-start pt-2">
                              <span className="text-sm text-slate-600 font-medium">Date & Time:</span>
                              <span className="font-bold text-amber-600 text-right text-sm">
                                {formatDateDisplay(formData.date)} at {formData.time}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
                          <p className="text-xs text-slate-700 text-center font-medium leading-relaxed">
                            ✓ A confirmation email will be sent to <span className="font-bold">{formData.email}</span><br/>
                            ✓ We'll also send a WhatsApp message to coordinate
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 text-red-700 p-4 rounded-xl text-sm font-medium"
                      >
                        ⚠️ {error}
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  /* Success Message */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="flex flex-col items-center justify-center h-full gap-4"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6 }}
                      className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h3>
                    <p className="text-slate-600 text-center text-sm leading-relaxed max-w-xs">
                      We've received your booking request. Check your email and WhatsApp for confirmation details.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {!success && (
              <div className="border-t border-slate-200 px-6 py-4 flex gap-3 bg-gradient-to-r from-slate-50 to-white">
                <Button
                  onClick={() => {
                    if (step === 'type') {
                      onClose()
                    } else if (step === 'details') {
                      setStep('type')
                    } else if (step === 'datetime') {
                      setStep('details')
                    } else if (step === 'confirm') {
                      setStep('datetime')
                    }
                  }}
                  variant="outline"
                  className="flex-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold"
                  disabled={loading}
                >
                  {step === 'type' ? 'Close' : 'Back'}
                </Button>
                <Button
                  onClick={() => {
                    if (step === 'confirm') {
                      handleSubmit()
                    } else {
                      handleNext()
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:shadow-xl rounded-xl font-semibold flex items-center justify-center gap-2 group"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      {step === 'confirm' ? 'Confirm Booking' : 'Next'}
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
