"use client";
import { useRef, useState, useEffect } from "react";
import {
	motion,
	useScroll,
	useTransform,
	useSpring,
	AnimatePresence,
} from "framer-motion";
import { SEJARAH_WAYANG, type EraData } from "../data/sejarahWayang";

const TOTAL_SISI = SEJARAH_WAYANG.length;
const SUDUT_PER_SISI = 360 / TOTAL_SISI;
const RADIUS_VW = 62;

function useActiveEra(rotateY: any, totalEra: number) {
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const unsubscribe = rotateY.on("change", (deg: number) => {
			const raw = Math.round(-deg / SUDUT_PER_SISI);
			const idx = Math.min(totalEra - 1, Math.max(0, raw));
			setActiveIndex(idx);
		});
		return () => unsubscribe();
	}, [rotateY, totalEra]);

	return activeIndex;
}

function TimelineMarkers({
	eras,
	activeIndex,
}: {
	eras: EraData[];
	activeIndex: number;
}) {
	return (
		<div className="hidden lg:flex flex-col gap-8 absolute left-12 top-1/2 -translate-y-1/2 z-30">
			{eras.map((era, i) => {
				const isActive = i === activeIndex;
				const isPast = i < activeIndex;
				return (
					<div key={era.id} className="flex items-center gap-4 group">
						<div className="relative flex items-center justify-center">
							<div
								className="rounded-full transition-all duration-500"
								style={{
									width: isActive ? "12px" : "7px",
									height: isActive ? "12px" : "7px",
									background: isActive || isPast ? era.warna : "rgba(255,255,255,0.15)",
									boxShadow: isActive
										? `0 0 16px 2px rgba(${era.r},${era.g},${era.b},0.6)`
										: "none",
								}}
							/>
							{i < eras.length - 1 && (
								<div
									className="absolute top-full left-1/2 -translate-x-1/2 w-px"
									style={{
										height: "32px",
										background: isPast
											? `rgba(${era.r},${era.g},${era.b},0.4)`
											: "rgba(255,255,255,0.1)",
									}}
								/>
							)}
						</div>
						<span
							className="text-[10px] tracking-[0.3em] uppercase font-medium transition-opacity duration-500"
							style={{
								color: isActive ? era.warna : "rgba(255,255,255,0.25)",
								opacity: isActive ? 1 : 0.6,
							}}>
							{era.nomor}
						</span>
					</div>
				);
			})}
		</div>
	);
}

function MuseumWall({
	era,
	index,
	isActive,
}: {
	era: EraData;
	index: number;
	isActive: boolean;
}) {
	return (
		<div
			className="absolute top-0 left-0 w-full h-full"
			style={{
				transform: `rotateY(${index * SUDUT_PER_SISI}deg) translateZ(-${RADIUS_VW}vw)`,
				backfaceVisibility: "hidden",
			}}>
			<div className="relative w-full h-full overflow-hidden">
				<motion.div
					className="absolute inset-0"
					initial={{ scale: 1.08 }}
					animate={{
						scale: isActive ? 1 : 1.08,
						filter: isActive ? "brightness(1)" : "brightness(0.45)",
					}}
					transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
					style={{
						backgroundImage: `url(${era.image})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>

				<div
					className="absolute inset-0"
					style={{
						background: `linear-gradient(180deg,
              rgba(5,4,3,0.8) 0%,
              rgba(5,4,3,0.3) 30%,
              rgba(5,4,3,0.4) 60%,
              rgba(5,4,3,0.95) 100%
            )`,
					}}
				/>
				<div
					className="absolute inset-0"
					style={{
						background: `linear-gradient(90deg,
              rgba(5,4,3,0.92) 0%,
              rgba(5,4,3,0.75) 30%,
              rgba(5,4,3,0.4) 60%,
              transparent 100%
            )`,
					}}
				/>
				{isActive && (
					<div
						className="absolute inset-0 pointer-events-none"
						style={{
							background: `radial-gradient(ellipse at 20% 70%, rgba(${era.r},${era.g},${era.b},0.2) 0%, transparent 60%)`,
						}}
					/>
				)}
			</div>
		</div>
	);
}

function EraContent({ era }: { era: EraData }) {
	return (
		<motion.div
			key={era.id}
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -24 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="relative z-10 max-w-2xl px-6 md:px-16 lg:px-28 select-none">
			<div className="flex items-center gap-5 mb-5">
				<span
					className="text-8xl md:text-9xl font-light leading-none"
					style={{
						fontFamily: "'Cormorant Garamond', Georgia, serif",
						color: era.warna,
						textShadow: `0 4px 40px rgba(${era.r},${era.g},${era.b},0.4)`,
					}}>
					{era.nomor}
				</span>
				<div className="flex flex-col gap-1.5">
					<div
						className="h-px w-16"
						style={{ background: era.warna, opacity: 0.6 }}
					/>
					<span
						className="text-[12px] tracking-[0.35em] uppercase font-semibold"
						style={{ color: "rgba(255,255,255,0.6)" }}>
						{era.periode}
					</span>
				</div>
			</div>

			<h3
				className="text-5xl md:text-6xl font-normal leading-tight mb-5"
				style={{ color: "#fdf8ee" }}>
				{era.judul}
			</h3>

			<p
				className="text-lg md:text-xl leading-relaxed mb-6 font-normal tracking-wide"
				style={{ color: "rgba(255, 255, 255, 0.92)" }}>
				{era.narasi}
			</p>

			<div className="flex flex-col gap-4 mb-7">
				{era.detail.map((d, i) => (
					<div key={i} className="flex items-start gap-3.5">
						<div
							className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0"
							style={{ background: era.warna, boxShadow: `0 0 8px ${era.warna}` }}
						/>
						<span
							className="text-base leading-relaxed font-medium"
							style={{ color: "rgba(255, 255, 255, 0.75)" }}>
							{d}
						</span>
					</div>
				))}
			</div>

			{era.quote && (
				<p
					className="text-xl italic leading-relaxed pl-6"
					style={{
						fontFamily: "'Cormorant Garamond', Georgia, serif",
						color: "rgba(245, 235, 205, 0.95)",
						borderLeft: `3px solid ${era.warna}`,
					}}>
					"{era.quote}"
				</p>
			)}
		</motion.div>
	);
}

export default function SejarahSection() {
	const containerRef = useRef<HTMLDivElement>(null);
	const totalEra = TOTAL_SISI;

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
	});

	const rawRotateY = useTransform(
		scrollYProgress,
		[0, 1],
		[0, -(totalEra - 1) * SUDUT_PER_SISI],
	);
	const roomRotateY = useSpring(rawRotateY, {
		stiffness: 60,
		damping: 20,
		mass: 1,
	});

	const activeIndex = useActiveEra(roomRotateY, totalEra);
	const activeEra = SEJARAH_WAYANG[activeIndex];

	return (
		<section
			ref={containerRef}
			className="relative"
			style={{ height: `${totalEra * 100}vh` }}
			id="sejarah">
			<div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
				<div className="absolute top-8 left-6 md:left-16 z-30">
					<p
						className="text-xs tracking-[0.5em] uppercase font-medium"
						style={{ color: "rgba(200,150,60,0.6)" }}>
						Jejak Wayang
					</p>
				</div>

				<div
					className="absolute inset-0"
					style={{
						perspective: "1400px",
						perspectiveOrigin: "50% 50%",
					}}>
					<motion.div
						className="absolute inset-0"
						style={{
							transformStyle: "preserve-3d",
							rotateY: roomRotateY,
						}}>
						{SEJARAH_WAYANG.map((era, i) => (
							<MuseumWall
								key={era.id}
								era={era}
								index={i}
								isActive={i === activeIndex}
							/>
						))}
					</motion.div>
				</div>

				<div
					className="absolute inset-0 pointer-events-none z-10"
					style={{
						background:
							"radial-gradient(ellipse at center, transparent 35%, rgba(5,4,3,0.55) 100%)",
					}}
				/>

				<TimelineMarkers eras={SEJARAH_WAYANG} activeIndex={activeIndex} />

				<div className="relative h-full flex items-center z-20">
					<AnimatePresence mode="wait">
						<EraContent key={activeEra.id} era={activeEra} />
					</AnimatePresence>
				</div>

				{activeIndex === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1, duration: 1 }}
						className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
						<span
							className="text-[10px] tracking-[0.3em] uppercase"
							style={{ color: "rgba(255,255,255,0.4)" }}>
							Scroll untuk menjelajah
						</span>
						<motion.div
							animate={{ y: [0, 6, 0] }}
							transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
							style={{ color: "rgba(255,255,255,0.3)" }}>
							↓
						</motion.div>
					</motion.div>
				)}

				<div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-30">
					<motion.div
						className="h-full"
						style={{
							background: activeEra.warna,
							scaleX: scrollYProgress,
							transformOrigin: "left",
						}}
					/>
				</div>
			</div>
		</section>
	);
}
