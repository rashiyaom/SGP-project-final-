// WhatsApp integration endpoint for admin notifications
// This generates WhatsApp messages with pre-populated text

const PRESET_MESSAGES = {
  confirmed: 'Your appointment has been confirmed! We look forward to meeting you. Thank you for choosing us.',
  rejected: 'We are unable to accommodate your appointment at the requested time. Please select another date/time or contact us for assistance.',
  rescheduled: 'Your appointment has been rescheduled to a new date and time. Please check your email for details.',
  reminder: 'Reminder: Your appointment is scheduled for tomorrow. Please confirm your attendance.',
  cancelled: 'Your appointment has been cancelled as per your request. Feel free to book another appointment anytime.'
}

export function generateWhatsAppLink(phoneNumber: string, message: string, appointmentId: string) {
  // Format: https://wa.me/[country-code][number]?text=[message]
  // Remove any special characters from phone number
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '')
  
  // If not starting with country code, assume India (+91)
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone
  
  // URL encode the message
  const encodedMessage = encodeURIComponent(`${message}\n\nAppointment ID: ${appointmentId}`)
  
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`
}

export function getPresetMessage(status: string, appointmentType: string, dateTime: string): string {
  let baseMessage = PRESET_MESSAGES[status as keyof typeof PRESET_MESSAGES] || ''
  
  if (status === 'confirmed') {
    baseMessage = `✅ Appointment Confirmed!\n\nYour ${appointmentType === 'online' ? '📹 Online Video Call' : '🏢 Offline Visit'} is scheduled for ${dateTime}.\n\nWe look forward to meeting you!`
  }
  
  if (status === 'rescheduled') {
    baseMessage = `📅 Appointment Rescheduled!\n\nYour new appointment is now scheduled for ${dateTime}.\n\nPlease confirm if this time works for you.`
  }
  
  return baseMessage
}
