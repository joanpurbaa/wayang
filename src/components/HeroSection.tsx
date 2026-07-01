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
			className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-16 lg:px-24"
			onMouseMove={handleMouseMove}>
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

			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }}
				style={{ x: textX, y: textY }}
				className="relative z-0 w-full pointer-events-auto">
				<h1 className="font-serif leading-[0.78] tracking-tighter select-none w-full">
					<span
						className="z-0 block w-full text-right text-[3.5rem] sm:text-7xl md:text-[7.5rem] lg:text-[9rem] xl:text-[30rem] font-light text-white/55 drop-shadow-2xl pr-2 md:pr-8"
						style={{
							WebkitTextStroke: "1px rgba(255,255,255,0.15)",
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							letterSpacing: "-0.02em",
						}}>
						Jagat
						<span
							className="block w-full text-left text-[3.5rem] sm:text-7xl md:text-[7.5rem] lg:text-[9rem] xl:text-[20rem] font-bold text-gold-glow mt-1 md:mt-2 -ml-1"
							style={{
								fontFamily: "'Cormorant Garamond', Georgia, serif",
								color: "#D4AF37",
								letterSpacing: "-0.02em",
								textShadow:
									"0 4px 40px rgba(212,175,55,0.35), 0 0 100px rgba(212,175,55,0.18)",
							}}>
							Wayang
						</span>
					</span>
				</h1>

				<p className="relative z-20 mt-8 md:mt-10 text-white/50 text-base md:text-3xl leading-relaxed w-full font-light tracking-wide text-justify [text-align-last:justify]">
					Boneka kayu yang menanggung semesta — kisah dewa, raja, dan rakyat dalam
					satu panggung sinematik.
				</p>
			</motion.div>
		</section>
	);
}
