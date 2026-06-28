import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const STORIES = [
  {
    number: '01',
    title: 'Sang Hyang Widhi',
    desc: 'Kisah awal mula para dewa menurunkan bayangan suci ke alam semesta, melahirkan tradisi wayang sebagai cermin kehidupan.',
  },
  {
    number: '02',
    title: 'Pandawa Lima',
    desc: 'Perjalanan lima bersaudara dalam menegakkan dharma melawan angkara murka, simbol pertarungan abadi antara kebaikan dan kejahatan.',
  },
  {
    number: '03',
    title: 'Bharatayuddha',
    desc: 'Perang dahsyat di padang Kurusetra yang mengubah tatanan semesta, di mana wayang menjadi saksi bisu sekaligus pencerita kebijaksanaan.',
  },
]

// Komponen terpisah untuk Kartu agar bisa memakai useTransform lokal
const StoryCard = ({ story, index, scrollYProgress, totalCards }) => {
  // Tentukan range scroll untuk kartu ini
  const start = index / totalCards
  const end = (index + 1) / totalCards
  
  // Efek Inner Parallax: saat kartu bergeser ke kiri (scroll maju), gambar bergeser ke kanan
  const imgX = useTransform(scrollYProgress, [start, end], ['-15%', '15%'])

  return (
    <div
      className="min-w-[80vw] h-[80vh] bg-[#111] border border-[#333] rounded-2xl p-10 md:p-14 flex flex-col justify-center relative overflow-hidden"
      style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}
    >
      {/* Angka besar samar */}
      <span className="absolute -top-8 -left-4 text-[16rem] font-serif text-white/[0.03] select-none leading-none">
        {story.number}
      </span>

      <div className="relative z-10 space-y-6">
        <h2 className="font-serif text-4xl md:text-5xl text-amber-400">
          {story.title}
        </h2>
        <p className="text-white/60 max-w-xl leading-relaxed text-lg">
          {story.desc}
        </p>

        {/* Ilustrasi dengan Inner Parallax */}
        <div className="mt-8 w-full h-48 bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden relative">
          <motion.img 
            src="https://placehold.co/600x400/transparent/white?text=Ilustrasi+Cerita"
            alt={story.title}
            className="absolute inset-0 w-full h-full object-cover scale-[1.2] pointer-events-none"
            style={{ x: imgX }}
          />
        </div>
      </div>
    </div>
  )
}

export default function LoreSection() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0vw', '-164vw'])

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <motion.div style={{ x }} className="flex gap-[12vw] px-[10vw]">
          {STORIES.map((story, index) => (
            <StoryCard 
              key={story.number} 
              story={story} 
              index={index} 
              scrollYProgress={scrollYProgress}
              totalCards={STORIES.length}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}