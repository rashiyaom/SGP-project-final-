'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, X } from 'lucide-react'
import BookingModal from './booking-modal'

interface BookingButtonProps {
  userId?: string
  userName?: string
  userEmail?: string
  source?: 'products' | 'contact'
}

export default function BookingButton({
  userId,
  userName,
  userEmail,
  source = 'products'
}: BookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-30"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-[#d4af37] to-[#bfa14a] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        >
          <MessageSquare size={24} />

          {/* Tooltip */}
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full mb-3 right-0 bg-foreground text-background px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
            >
              Book a Visit
              <div className="absolute top-full right-4 -mt-1 w-2 h-2 bg-foreground rotate-45" />
            </motion.div>
          )}
        </motion.button>

        {/* Pulse animation */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-[#d4af37] opacity-25 pointer-events-none"
        />
      </motion.div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userId={userId}
        userName={userName}
        userEmail={userEmail}
        source={source}
      />
    </>
  )
}
