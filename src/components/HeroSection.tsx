import { useEffect, useState } from "react";
import {
	motion,
	AnimatePresence,
	useMotionValue,
	useSpring,
	useTransform,
} from "framer-motion";

export default function HeroSection() {
	const [showCurtain, setShowCurtain] = useState(true);

	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const springConfig = { damping: 30, stiffness: 100, mass: 0.5 };
	const smoothX = useSpring(mouseX, springConfig);
	const smoothY = useSpring(mouseY, springConfig);

	const textX = useTransform(smoothX, [-0.5, 0.5], [25, -25]);
	const textY = useTransform(smoothY, [-0.5, 0.5], [15, -15]);

	const bgX = useTransform(smoothX, [-0.5, 0.5], [-40, 40]);
	const bgY = useTransform(smoothY, [-0.5, 0.5], [-30, 30]);

	const handleMouseMove = (e: any) => {
		mouseX.set(e.clientX / window.innerWidth - 0.5);
		mouseY.set(e.clientY / window.innerHeight - 0.5);
	};

	useEffect(() => {
		const timer = setTimeout(() => setShowCurtain(false), 300);
		return () => clearTimeout(timer);
	}, []);

	return (
		<section
			className="relative min-h-screen flex items-center overflow-hidden px-8 md:px-20 lg:px-32 py-24"
			onMouseMove={handleMouseMove}>
			{/* Latar cahaya pendar emas dengan Parallax (Diperbesar radiusnya agar menyelimuti canvas secara halus) */}
			<motion.div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"radial-gradient(circle at 40% 50%, rgba(212,175,55,0.18) 0%, transparent 65%)",
					filter: "blur(100px)",
					x: bgX,
					y: bgY,
					zIndex: 1,
				}}
			/>

			{/* Dua layar gunungan yang membuka */}
			<AnimatePresence>
				{showCurtain && (
					<>
						<motion.div
							key="left-curtain"
							initial={{ x: 0 }}
							animate={{ x: "-100%" }}
							exit={{ x: "-100%" }}
							transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
							className="absolute top-0 left-0 w-1/2 h-full bg-black z-30"
						/>
						<motion.div
							key="right-curtain"
							initial={{ x: 0 }}
							animate={{ x: "100%" }}
							exit={{ x: "100%" }}
							transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
							className="absolute top-0 right-0 w-1/2 h-full bg-black z-30"
						/>
					</>
				)}
			</AnimatePresence>

			{/* Konten utama diatur ke kiri (max-w diperlebar ke 5xl untuk mengakomodasi teks raksasa secara proporsional) */}
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }}
				style={{ x: textX, y: textY }}
				className="relative z-10 text-left max-w-5xl w-full pointer-events-auto">
				<h1 className="font-serif leading-[0.85] tracking-tighter select-none">
					<span
						className="block text-7xl md:text-[8rem] lg:text-[10rem] font-light text-white/40 opacity-90 drop-shadow-2xl"
						style={{
							WebkitTextStroke: "1px rgba(255,255,255,0.12)",
							fontFamily: "'Cormorant Garamond', Georgia, serif",
						}}>
						Wayang
					</span>
					<span
						className="block text-7xl md:text-[8rem] lg:text-[10rem] font-bold text-gold-glow mt-1"
						style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							color: "#D4AF37",
							textShadow:
								"0 4px 40px rgba(212,175,55,0.35), 0 0 80px rgba(212,175,55,0.15)",
						}}>
						Golek
					</span>
				</h1>

				{/* Deskripsi: Sedikit digeser margin-nya agar sejajar sempurna dengan tarikan huruf W pada Wayang */}
				<p className="mt-10 text-white/50 text-base md:text-xl leading-relaxed max-w-md font-light tracking-wide text-justify">
					Boneka kayu yang menanggung semesta — kisah dewa, raja, dan rakyat dalam
					satu panggung sinematik.
				</p>

				{/* Tombol CTA yang diperbesar secara elegan */}
				<motion.button
					whileHover={{ scale: 1.03, backgroundColor: "rgba(212,175,55,0.12)" }}
					whileTap={{ scale: 0.98 }}
					className="mt-12 group relative px-10 py-4 text-xs font-medium tracking-[0.25em] uppercase overflow-hidden rounded-[4px] transition-colors duration-300"
					style={{
						background:
							"linear-gradient(135deg, rgba(212,175,55,0.06), rgba(212,175,55,0.01))",
						border: "1px solid rgba(212,175,55,0.3)",
						color: "#D4AF37",
						boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
					}}>
					{/* Gloss sweep on hover */}
					<span
						className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"
						style={{
							background:
								"linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
						}}
					/>
					<span className="relative z-10">Mulai Eksplorasi</span>
				</motion.button>
			</motion.div>

			{/* 
        NOTE UNTUK ELEMEN 3D KAMU:
        Pastikan komponen model 3D / Spline / Canvas Three.js milikmu memiliki utility class seperti:
        "absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full z-0 pointer-events-none"
        Sehingga ia berdiri sejajar di kanan tanpa memakan space deteksi mouse dari text container ini.
      */}
		</section>
	);
}
