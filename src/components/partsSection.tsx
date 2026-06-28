"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

// ── Gold shimmer divider ──────────────────────────────────────────────────────
function GoldDivider({ progress }: { progress: MotionValue<number> }) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="relative h-px w-full overflow-hidden">
      <div className="absolute inset-0 bg-white/5" />
      <motion.div
        className="absolute left-0 top-0 h-full"
        style={{
          width,
          background:
            "linear-gradient(90deg, transparent, #d4af37 30%, #fff7cc 50%, #d4af37 70%, transparent)",
          boxShadow: "0 0 12px rgba(212,175,55,0.6)",
        }}
      />
    </div>
  );
}

// ── Floating orb glow di belakang teks ───────────────────────────────────────
function GlowOrb({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        inset: "-40%",
        background:
          "radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.04) 45%, transparent 70%)",
        opacity,
        filter: "blur(40px)",
      }}
    />
  );
}

// ── Label "Bagian X" dengan line-through animasi ─────────────────────────────
function PartLabel({ text, active }: { text: string; active: MotionValue<number> }) {
  return (
    <motion.div className="flex items-center gap-3" style={{ opacity: active }}>
      <motion.div
        className="h-px bg-gold/50"
        style={{
          width: useTransform(active, [0, 1], ["0px", "32px"]),
          boxShadow: "0 0 6px rgba(212,175,55,0.6)",
        }}
      />
      <span
        className="text-xs uppercase tracking-[0.45em] font-medium"
        style={{ color: "rgba(212,175,55,0.65)" }}
      >
        {text}
      </span>
    </motion.div>
  );
}

// ── Panel utama tiap bagian ───────────────────────────────────────────────────
function PartPanel({
  label,
  heading,
  subheading,
  description,
  opacity,
  y,
  dividerProgress,
  glowOpacity,
}: {
  label: string;
  heading: string;
  subheading: string;
  description: string;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  dividerProgress: MotionValue<number>;
  glowOpacity: MotionValue<number>;
}) {
  // 3D tilt ringan berbasis opacity (proxy kehadiran)
  const rotateX = useTransform(opacity, [0, 1], [8, 0]);
  const springOpacity = useSpring(opacity, { stiffness: 60, damping: 20 });
  const springY = useSpring(y, { stiffness: 55, damping: 18 });

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{
        opacity: springOpacity,
        y: springY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow orb */}
      <GlowOrb opacity={glowOpacity} />

      {/* Konten */}
      <div className="relative z-10 space-y-5 md:space-y-7">
        {/* Label */}
        <PartLabel text={label} active={opacity} />

        {/* Heading 3D per huruf */}
        <div style={{ perspective: "800px" }}>
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              rotateX: useTransform(opacity, [0, 0.5, 1], [22, 6, 0]),
              opacity,
            }}
          >
            <h3
              className="font-serif font-light leading-none"
              style={{
                fontSize: "clamp(4.5rem, 10vw, 9rem)",
                color: "transparent",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                backgroundImage:
                  "linear-gradient(135deg, #f9e48a 0%, #d4af37 30%, #fff7cc 52%, #c8a400 75%, #f9e48a 100%)",
                backgroundSize: "200% 200%",
                filter: "drop-shadow(0 0 24px rgba(212,175,55,0.45)) drop-shadow(0 2px 4px rgba(0,0,0,0.8))",
                textShadow: "none",
                animation: "goldShimmer 4s ease-in-out infinite",
              }}
            >
              {heading}
            </h3>
          </motion.div>
        </div>

        {/* Sub-heading dengan huruf terpisah */}
        <motion.h4
          className="text-sm md:text-base uppercase tracking-[0.4em]"
          style={{
            color: "rgba(255,255,255,0.35)",
            opacity,
            letterSpacing: "0.4em",
          }}
        >
          {subheading}
        </motion.h4>

        {/* Divider emas animasi */}
        <GoldDivider progress={dividerProgress} />

        {/* Deskripsi dengan reveal per kata */}
        <motion.p
          className="text-base md:text-lg leading-relaxed font-light max-w-md"
          style={{
            color: "rgba(232,224,208,0.72)",
            opacity,
            y: useTransform(opacity, [0, 1], [16, 0]),
          }}
        >
          {description}
        </motion.p>

        {/* Roman numeral dekoratif */}
        <motion.div
          className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{
            opacity: useTransform(opacity, [0, 1], [0, 0.07]),
            fontFamily: "serif",
            fontSize: "clamp(6rem, 14vw, 14rem)",
            color: "#d4af37",
            lineHeight: 1,
            fontWeight: 100,
            filter: "blur(1px)",
          }}
        >
          {label.split(" ").pop()}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Komponen Utama ────────────────────────────────────────────────────────────
export default function PartsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // ── Opacity tiap panel ──────────────────────────────────────────────────────
  const opacityPart1 = useTransform(scrollYProgress, [0, 0.08, 0.3, 0.38], [0, 1, 1, 0]);
  const opacityPart2 = useTransform(scrollYProgress, [0.35, 0.43, 0.62, 0.7], [0, 1, 1, 0]);
  const opacityPart3 = useTransform(scrollYProgress, [0.68, 0.76, 0.93, 1], [0, 1, 1, 0]);

  // ── Y offset (masuk dari bawah) ─────────────────────────────────────────────
  const yPart1 = useTransform(scrollYProgress, [0, 0.12], [56, 0]);
  const yPart2 = useTransform(scrollYProgress, [0.38, 0.48], [56, 0]);
  const yPart3 = useTransform(scrollYProgress, [0.72, 0.82], [56, 0]);

  // ── Progress divider (0→1 saat panel aktif) ────────────────────────────────
  const divProgress1 = useTransform(scrollYProgress, [0.06, 0.22], [0, 1]);
  const divProgress2 = useTransform(scrollYProgress, [0.42, 0.58], [0, 1]);
  const divProgress3 = useTransform(scrollYProgress, [0.76, 0.90], [0, 1]);

  // ── Glow orb opacity ───────────────────────────────────────────────────────
  const glow1 = useTransform(scrollYProgress, [0, 0.15, 0.30], [0, 0.9, 0]);
  const glow2 = useTransform(scrollYProgress, [0.38, 0.50, 0.65], [0, 0.9, 0]);
  const glow3 = useTransform(scrollYProgress, [0.72, 0.83, 0.96], [0, 0.9, 0]);

  // ── Indikator scroll vertikal (3 dot) ─────────────────────────────────────
  const dot1 = useTransform(scrollYProgress, [0.05, 0.25], [0.3, 1]);
  const dot2 = useTransform(scrollYProgress, [0.40, 0.60], [0.3, 1]);
  const dot3 = useTransform(scrollYProgress, [0.73, 0.90], [0.3, 1]);

  return (
    <>
      {/* Keyframe shimmer untuk heading */}
      <style>{`
        @keyframes goldShimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="parts"
        className="relative h-[300vh] bg-transparent z-10"
      >
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
            {/* Placeholder kiri (model 3D global) */}
            <div className="hidden md:block" />

            {/* Kolom kanan: teks */}
            <div
              className="relative flex items-center justify-start px-6 md:px-12 lg:px-20"
              style={{ perspective: "1200px" }}
            >
              <div className="relative w-full max-w-xl min-h-[60vh]">

                {/* ── Indikator dot vertikal kiri ── */}
                <div className="absolute -left-6 md:-left-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
                  {[dot1, dot2, dot3].map((dotOpacity, i) => (
                    <motion.div
                      key={i}
                      style={{ opacity: dotOpacity }}
                      className="relative"
                    >
                      <motion.div
                        className="w-1 h-1 rounded-full bg-gold"
                        style={{
                          boxShadow: useTransform(
                            dotOpacity,
                            [0.3, 1],
                            ["0 0 0px rgba(212,175,55,0)", "0 0 8px rgba(212,175,55,0.9)"]
                          ),
                        }}
                      />
                      {/* Garis kecil ke bawah jika bukan terakhir */}
                      {i < 2 && (
                        <div className="w-px h-4 bg-white/10 mx-auto mt-1" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* ── Panel 1: Kepala ── */}
                <PartPanel
                  label="Bagian I"
                  heading="Kepala"
                  subheading="Simbol Kebijaksanaan"
                  description="The head represents thought, wisdom, and spiritual awareness — the crown of the wayang's cosmic identity."
                  opacity={opacityPart1}
                  y={yPart1}
                  dividerProgress={divProgress1}
                  glowOpacity={glow1}
                />

                {/* ── Panel 2: Tubuh ── */}
                <PartPanel
                  label="Bagian II"
                  heading="Tubuh"
                  subheading="Pengabdian dan Peran"
                  description="The body symbolizes responsibility, action, and devotion — the vessel through which purpose takes form."
                  opacity={opacityPart2}
                  y={yPart2}
                  dividerProgress={divProgress2}
                  glowOpacity={glow2}
                />

                {/* ── Panel 3: Dasar ── */}
                <PartPanel
                  label="Bagian III"
                  heading="Dasar"
                  subheading="Akar Tradisi"
                  description="The lower section represents cultural roots and continuity — the foundation that carries centuries of story."
                  opacity={opacityPart3}
                  y={yPart3}
                  dividerProgress={divProgress3}
                  glowOpacity={glow3}
                />

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
