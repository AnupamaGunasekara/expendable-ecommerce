'use client'

import { useState } from 'react'
import { newsletterAPI } from '@/lib/api'
import { FiMail } from 'react-icons/fi'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setMessage('')
    setSuccess(false)

    try {
      await newsletterAPI.subscribe(email)
      setMessage('Thank you for subscribing! Check your email for confirmation.')
      setSuccess(true)
      setEmail('')
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      )
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <FiMail className="mx-auto text-primary mb-4" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Newsletter
          </h2>
          <p className="text-gray-300 mb-8">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            Be the first to know about new arrivals and exclusive promotions.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-primary focus:outline-none focus:bg-white/20 transition-all placeholder:text-gray-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                success
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                  : 'bg-red-500/20 border border-red-500/50 text-red-400'
              }`}
            >
              {message}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
