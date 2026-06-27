import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function HeroSection() {
  const [showCurtain, setShowCurtain] = useState(true)

  // Mouse Parallax Setup
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 30, stiffness: 100, mass: 0.5 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // Teks bergerak berlawanan arah mouse
  const textX = useTransform(smoothX, [-0.5, 0.5], [40, -40])
  const textY = useTransform(smoothY, [-0.5, 0.5], [30, -30])

  // Background mengikuti mouse perlahan
  const bgX = useTransform(smoothX, [-0.5, 0.5], [-30, 30])
  const bgY = useTransform(smoothY, [-0.5, 0.5], [-20, 20])

  const handleMouseMove = (e) => {
    // Normalisasi koordinat mouse dari -0.5 ke 0.5
    mouseX.set(e.clientX / window.innerWidth - 0.5)
    mouseY.set(e.clientY / window.innerHeight - 0.5)
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowCurtain(false), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-24"
      onMouseMove={handleMouseMove}
    >
      {/* Latar cahaya pendar emas dengan Parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          x: bgX,
          y: bgY
        }}
      />

      {/* Dua layar gunungan yang membuka */}
      <AnimatePresence>
        {showCurtain && (
          <>
            <motion.div
              key="left-curtain"
              initial={{ x: 0 }}
              animate={{ x: '-100%' }}
              exit={{ x: '-100%' }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 left-0 w-1/2 h-full bg-black z-30"
            />
            <motion.div
              key="right-curtain"
              initial={{ x: 0 }}
              animate={{ x: '100%' }}
              exit={{ x: '100%' }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 right-0 w-1/2 h-full bg-black z-30"
            />
          </>
        )}
      </AnimatePresence>

      {/* Konten utama dengan Parallax */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ x: textX, y: textY }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        <h1 className="font-serif text-6xl md:text-8xl font-bold leading-tight bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
          Mahakarya Bayangan & Cahaya
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
          Eksplorasi wayang kulit Nusantara secara interaktif
        </p>

        {/* Tombol CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full font-medium flex items-center gap-2 mx-auto hover:bg-amber-500/20 transition-all duration-300 group"
          style={{
            boxShadow: '0 0 20px rgba(212,175,55,0.25)',
          }}
        >
          Mulai Eksplorasi
        </motion.button>
      </motion.div>
    </section>
  )
}