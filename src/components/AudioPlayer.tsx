// src/components/AudioPlayer.tsx
// Tombol toggle gamelan ambient — fixed bottom-left
// Taruh file audio di: public/colenak.mp3

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AudioPlayer() {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [playing, setPlaying] = useState(false);
	const [volume, setVolume] = useState(0.35);
	const [showHint, setShowHint] = useState(true);

	// Sembunyikan hint setelah 4 detik
	useEffect(() => {
		const t = setTimeout(() => setShowHint(false), 4000);
		return () => clearTimeout(t);
	}, []);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.volume = volume;
		audio.loop = true;
		if (playing) {
			audio.play().catch(() => {});
		} else {
			audio.pause();
		}
	}, [playing, volume]);

	const toggle = () => setPlaying((p) => !p);

	// Visualizer bars — sederhana, CSS-only feel
	const bars = [3, 5, 7, 4, 6, 3, 5];

	return (
		<>
			<audio ref={audioRef} src="/colenak.mp3" preload="none" autoPlay={true} />

			{/* Hint tooltip */}
			<AnimatePresence>
				{showHint && (
					<motion.div
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -10 }}
						className="fixed bottom-[4.5rem] left-5 z-50 bg-black/70 backdrop-blur-md text-amber-300 text-xs px-3 py-2 rounded-lg border border-amber-500/20 whitespace-nowrap">
						Aktifkan suara gamelan 🎶
						<div className="absolute left-4 -bottom-1.5 w-2.5 h-2.5 bg-black/70 border-r border-b border-amber-500/20 rotate-45" />
					</motion.div>
				)}
			</AnimatePresence>

			{/* Tombol utama */}
			<motion.button
				onClick={toggle}
				aria-label={playing ? "Matikan gamelan" : "Aktifkan gamelan"}
				className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-amber-500/30 bg-black/60 backdrop-blur-md text-amber-400 hover:bg-amber-500/10 transition-colors duration-300"
				whileHover={{ scale: 1.04 }}
				whileTap={{ scale: 0.95 }}
				style={{ boxShadow: playing ? "0 0 20px rgba(212,175,55,0.2)" : "none" }}>
				{/* Visualizer / icon */}
				<div className="flex items-end gap-[2px] h-4">
					{bars.map((h, i) => (
						<motion.span
							key={i}
							className="w-[2px] rounded-full bg-amber-400"
							animate={
								playing
									? {
											height: [`${h * 2}px`, `${(h + 3) * 2}px`, `${h * 2}px`],
										}
									: { height: "4px" }
							}
							transition={{
								duration: 0.6 + i * 0.1,
								repeat: Infinity,
								ease: "easeInOut",
								delay: i * 0.08,
							}}
						/>
					))}
				</div>

				<span className="text-xs tracking-wider font-medium">
					{playing ? "Gamelan" : "Gamelan"}
				</span>

				{/* Dot indikator */}
				<span
					className="w-1.5 h-1.5 rounded-full flex-shrink-0"
					style={{
						backgroundColor: playing ? "#4ade80" : "#6b7280",
						boxShadow: playing ? "0 0 6px #4ade80" : "none",
					}}
				/>
			</motion.button>
		</>
	);
}
