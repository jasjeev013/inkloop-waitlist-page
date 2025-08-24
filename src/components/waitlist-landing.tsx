import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, Instagram, Linkedin, Mail } from "lucide-react"
import VortexParticleSystem from "@/components/vortex-particle-system"
import { Logo } from "@/components/logo"

export default function WaitlistLanding() {

  const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [signupCount, setSignupCount] = useState(0)
  const [loading, setLoading] = useState(false) // 🚀 loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setLoading(true) // start loading
      try {
        const res = await fetch(
          "https://cors-anywhere.herokuapp.com/" + GOOGLE_SCRIPT_URL,
          {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: { "Content-Type": "application/json" },
          }
        )
        const data = await res.json()

        if (data.success) {
          setIsSubmitted(true)
          setSignupCount(data.count) // update count from sheet
          setEmail("")

          // 🎉 Confetti blast
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })
        }
      } catch (err) {
        console.error("Error storing email:", err)
      } finally {
        setLoading(false) // stop loading
      }
    }
  }

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(GOOGLE_SCRIPT_URL)
        const data = await res.json()
        setSignupCount(data.count)
      } catch (err) {
        console.error("Error fetching count:", err)
      }
    }
    fetchCount()
  }, [])

  return (
    <div className="min-h-screen min-w-screen bg-[#F0EEE6] flex flex-col relative overflow-hidden font-sf-pro">
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <VortexParticleSystem />
      </div>

      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <Logo variant="full" size="lg" className="justify-center" />

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <p className="text-4xl font-light text-gray-900 tracking-tight font-sf-pro">
              Something amazing is coming
            </p>
            <p className="text-gray-700 text-lg leading-relaxed font-sf-pro">
              Be the first to experience the future of productivity. Join our waitlist and get early access.
            </p>
          </motion.div>

          {/* Form / Success */}
          <div className="space-y-4">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-3"
              >
                <div className="h-12 flex items-center justify-center bg-green-50 border border-green-200 rounded-md backdrop-blur-sm">
                  <span className="text-green-800 font-medium font-sf-pro">
                    ✓ You're on the list!
                  </span>
                </div>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="w-full h-12 border-gray-400 backdrop-blur-sm font-sf-pro text-white hover:text-white/50"
                >
                  Add Another Email
                </Button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSubmit}
                className="space-y-3"
              >
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-center border-gray-400 focus:border-gray-900 focus:ring-gray-900 bg-white/80 backdrop-blur-sm font-sf-pro"
                  required
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-gray-900 via-gray-800 to-black hover:opacity-90 text-white font-medium shadow-lg font-sf-pro flex items-center justify-center"
                >
                  {loading ? (
                    <span className="animate-pulse">Joining...</span>
                  ) : (
                    "Join Waitlist"
                  )}
                </Button>
              </motion.form>
            )}
          </div>

          {/* Animated Signup Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-4"
          >
            <p className="text-sm text-gray-600 font-sf-pro">
              <motion.span
                key={signupCount}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="font-semibold text-gray-900"
              >
                {signupCount.toLocaleString()}
              </motion.span>{" "}
              people already joined
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="p-6 flex justify-between items-center relative z-10">
        <div className="flex space-x-4">
          <a
            href="https://x.com/inkloopinc"
            target="_blank"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </a>
          <a
            href="https://www.instagram.com/inkloop.inc"
            target="_blank"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
        </div>
        <div className="flex space-x-4">
          <a
            href="#"
            target="_blank"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:inloop.app@gmail.com"
            target="_blank"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Mail"
          >
            <Mail size={20} />
          </a>
        </div>
      </footer>
    </div>
  )
}
