"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PartsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Progress scroll atas 300vh section ini
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Opacity & transisi masuk tiap bagian
  const opacityPart1 = useTransform(scrollYProgress, [0, 0.1, 0.3, 0.4], [0, 1, 1, 0]);
  const opacityPart2 = useTransform(scrollYProgress, [0.35, 0.45, 0.65, 0.75], [0, 1, 1, 0]);
  const opacityPart3 = useTransform(scrollYProgress, [0.7, 0.8, 0.95, 1], [0, 1, 1, 0]);

  const yPart1 = useTransform(scrollYProgress, [0, 0.15], [48, 0]);
  const yPart2 = useTransform(scrollYProgress, [0.4, 0.5], [48, 0]);
  const yPart3 = useTransform(scrollYProgress, [0.75, 0.85], [48, 0]);

  // Radial glow di belakang teks aktif (emisi emas halus)
  const glow1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [0, 0.12, 0]);
  const glow2 = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 0.12, 0]);
  const glow3 = useTransform(scrollYProgress, [0.75, 0.85, 0.9], [0, 0.12, 0]);

  const glowBg1 = useTransform(glow1, (v) => `radial-gradient(circle at 50% 50%, rgba(212,175,55,${v}) 0%, transparent 75%)`);
  const glowBg2 = useTransform(glow2, (v) => `radial-gradient(circle at 50% 50%, rgba(212,175,55,${v}) 0%, transparent 75%)`);
  const glowBg3 = useTransform(glow3, (v) => `radial-gradient(circle at 50% 50%, rgba(212,175,55,${v}) 0%, transparent 75%)`);

  return (
    <section
      ref={sectionRef}
      id="parts"
      className="relative h-[300vh] bg-transparent z-10"
    >
      {/* Container sticky yang menempel di viewport */}
      <div className="sticky top-0 h-screen flex items-center">
        {/* Grid dua kolom: kiri untuk model 3D (kosong), kanan untuk teks */}
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
          {/* Placeholder untuk model 3D (sudah dirender secara global) */}
          <div className="hidden md:block" />

          {/* Kolom teks */}
          <div className="relative flex items-center justify-start px-6 md:px-12 lg:px-20">
            <div className="relative w-full max-w-xl">
              {/* ── Bagian 1: Kepala ── */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-center"
                style={{ opacity: opacityPart1, y: yPart1 }}
              >
                <motion.div className="absolute inset-0 -z-10" style={{ background: glowBg1 }} />
                <div className="space-y-6 md:space-y-8">
                  <span className="text-xs md:text-sm uppercase tracking-[0.4em] text-gold-dim/60 font-medium">
                    Bagian Pertama
                  </span>
                  <h3 className="font-serif text-7xl sm:text-8xl md:text-9xl font-light leading-none text-gold-glow">
                    Kepala
                  </h3>
                  <h4 className="text-sm md:text-base uppercase tracking-[0.35em] text-white/40">
                    Simbol Kebijaksanaan
                  </h4>
                  {/* Garis emas */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                  <p className="text-base md:text-lg leading-relaxed font-light max-w-md text-[#e8e0d0]/70">
                    The head represents thought, wisdom, and spiritual awareness.
                  </p>
                </div>
              </motion.div>

              {/* ── Bagian 2: Tubuh ── */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-center"
                style={{ opacity: opacityPart2, y: yPart2 }}
              >
                <motion.div className="absolute inset-0 -z-10" style={{ background: glowBg2 }} />
                <div className="space-y-6 md:space-y-8">
                  <span className="text-xs md:text-sm uppercase tracking-[0.4em] text-gold-dim/60 font-medium">
                    Bagian Kedua
                  </span>
                  <h3 className="font-serif text-7xl sm:text-8xl md:text-9xl font-light leading-none text-gold-glow">
                    Tubuh
                  </h3>
                  <h4 className="text-sm md:text-base uppercase tracking-[0.35em] text-white/40">
                    Pengabdian dan Peran
                  </h4>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                  <p className="text-base md:text-lg leading-relaxed font-light max-w-md text-[#e8e0d0]/70">
                    The body symbolizes responsibility, action, and devotion.
                  </p>
                </div>
              </motion.div>

              {/* ── Bagian 3: Dasar ── */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-center"
                style={{ opacity: opacityPart3, y: yPart3 }}
              >
                <motion.div className="absolute inset-0 -z-10" style={{ background: glowBg3 }} />
                <div className="space-y-6 md:space-y-8">
                  <span className="text-xs md:text-sm uppercase tracking-[0.4em] text-gold-dim/60 font-medium">
                    Bagian Ketiga
                  </span>
                  <h3 className="font-serif text-7xl sm:text-8xl md:text-9xl font-light leading-none text-gold-glow">
                    Dasar
                  </h3>
                  <h4 className="text-sm md:text-base uppercase tracking-[0.35em] text-white/40">
                    Akar Tradisi
                  </h4>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                  <p className="text-base md:text-lg leading-relaxed font-light max-w-md text-[#e8e0d0]/70">
                    The lower section represents cultural roots and continuity.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}