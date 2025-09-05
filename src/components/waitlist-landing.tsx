import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, Instagram, Linkedin, Mail } from "lucide-react"
import VortexParticleSystem from "@/components/vortex-particle-system"
import { Logo } from "@/components/logo"

export default function WaitlistLanding() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [alreadyExists, setAlreadyExists] = useState(false)
  const [signupCount, setSignupCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    setLoading(true);
    setAlreadyExists(false);

    try {
      const res = await fetch(`${BACKEND_URL}/waitlist/put`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.result) {
        setIsSubmitted(true);
        setEmail("");
        setAlreadyExists(false);
        setSignupCount((prev) => (prev !== null ? prev + 1 : 1));
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        // treat as already exists
        setIsSubmitted(true);
        setAlreadyExists(true);

        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      }

    } catch (err) {
      console.error("Error submitting email:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching count from", BACKEND_URL + "/waitlist")
    const fetchCount = async () => {
      try {
        const res = await fetch(BACKEND_URL + "/waitlist")
        const data = await res.json()
        console.log(data)
        setSignupCount(data.object || 0)
      } catch (err) {
        console.error("Error fetching count:", err)
      }
    }
    fetchCount()
  }, [BACKEND_URL])

  return (
    <div className="min-h-screen min-w-screen bg-[#F0EEE6] dark:bg-gray-900 flex flex-col relative overflow-hidden font-sf-pro text-gray-900 dark:text-gray-100">

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
            <p className="lg:text-4xl md:text-3xl sm:text-3xl text-2xl font-light text-gray-900 tracking-tight font-sf-pro">
              Something amazing is coming
            </p>
            <p className="text-gray-700 lg:text-lg md:text-sm sm:text-sm leading-relaxed font-sf-pro">
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
                <div className={`h-12 flex items-center justify-center rounded-md backdrop-blur-sm border 
                  ${alreadyExists
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-green-50 border-green-200"}`}>
                  <span className={`font-medium font-sf-pro 
                    ${alreadyExists ? "text-yellow-800" : "text-green-800"}`}>
                    {alreadyExists ? "🙌 This email is already on the list!" : "🥳 You're on the list!"}
                  </span>
                </div>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setAlreadyExists(false);
                    setEmail("");
                  }}
           
                  className="w-full h-12 bg-gradient-to-r from-gray-900 via-gray-800 to-black hover:opacity-90 text-white font-medium shadow-lg font-sf-pro flex items-center justify-center"
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

          {/* Signup Counter (reserved space) */}
          <div className="pt-4 h-5">
            {signupCount !== null && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-gray-600 font-sf-pro"
              >
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
              </motion.p>
            )}
          </div>
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
            href="https://www.linkedin.com/company/inkloopinc"
            target="_blank"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:hi@inkloop.app"
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
