import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";

export default function AudioPlayer() {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [playing, setPlaying] = useState(false);
	const [volume] = useState(0.35);
	const [showHint, setShowHint] = useState(true);

	const wasPlayingBeforeDemo = useRef(false);

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

	useEffect(() => {
		const handleDemoStart = () => {
			setPlaying((current) => {
				wasPlayingBeforeDemo.current = current;
				return false;
			});
		};

		const handleDemoEnd = () => {
			if (wasPlayingBeforeDemo.current) {
				setPlaying(true);
			}
		};

		window.addEventListener("wayang-demo:start", handleDemoStart);
		window.addEventListener("wayang-demo:end", handleDemoEnd);
		return () => {
			window.removeEventListener("wayang-demo:start", handleDemoStart);
			window.removeEventListener("wayang-demo:end", handleDemoEnd);
		};
	}, []);

	const toggle = () => setPlaying((p) => !p);

	return (
		<>
			<audio ref={audioRef} src="/queenst.mp3" preload="none" autoPlay={true} />

			<AnimatePresence>
				{showHint && (
					<motion.div
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -10 }}
						className="hidden md:block fixed bottom-18 left-5 z-50 bg-black/70 backdrop-blur-md text-amber-300 text-xs px-3 py-2 rounded-lg border border-amber-500/20 whitespace-nowrap">
						Aktifkan suara
						<div className="absolute left-4 -bottom-1.5 w-2.5 h-2.5 bg-black/70 border-r border-b border-amber-500/20 rotate-45" />
					</motion.div>
				)}
			</AnimatePresence>

			<motion.button
				onClick={toggle}
				aria-label={playing ? "Matikan gamelan" : "Aktifkan gamelan"}
				className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-amber-500/30 bg-black/60 backdrop-blur-md text-amber-400 hover:bg-amber-500/10 transition-colors duration-300"
				whileHover={{ scale: 1.04 }}
				whileTap={{ scale: 0.95 }}
				style={{ boxShadow: playing ? "0 0 20px rgba(212,175,55,0.2)" : "none" }}>
				<div className="flex items-center justify-center w-4 h-4 text-amber-400">
					<motion.div
						key={playing ? "pause" : "play"}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.2 }}>
						{playing ? (
							<Pause className="w-4 h-4 fill-current" />
						) : (
							<Play className="w-4 h-4 fill-current ml-px" />
						)}
					</motion.div>
				</div>
			</motion.button>
		</>
	);
}
