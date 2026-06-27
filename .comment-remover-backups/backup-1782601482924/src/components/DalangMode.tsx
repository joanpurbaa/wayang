
import { useState, useRef } from "react";
import {
	motion,
	AnimatePresence,
	useMotionValue,
	useTransform,
	useSpring,
} from "framer-motion";
import { GripHorizontal, RefreshCw, Palette } from "lucide-react";

export default function DalangMode() {
	const [showChat, setShowChat] = useState(false);
	const stageRef = useRef(null);

	const dragX = useMotionValue(0);
	const rotateRaw = useTransform(dragX, [-100, 100], [60, -60], { clamp: true });
	const rotate = useSpring(rotateRaw, { stiffness: 300, damping: 20 });

	const handleTorsoClick = () => {
		setShowChat(true);
		setTimeout(() => setShowChat(false), 3000);
	};

	return (
		<section
			className="py-24 px-4 md:px-8 relative overflow-hidden"
			id="dalang-mode">
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
				{
				<div
					ref={stageRef}
					className="lg:col-span-3 relative h-[600px] md:h-[700px] bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/90"
					style={{
						boxShadow:
							"inset 0 0 60px rgba(212,175,55,0.08), 0 20px 50px rgba(0,0,0,0.8)",
					}}>
					{
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,140,0,0.08)_0%,transparent_70%)]" />
					<div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

					{
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
						{
						<img
							src="https://placehold.co/100x100/transparent/white?text=Kepala"
							alt="Kepala Wayang"
							className="absolute top-[-90px] left-1/2 -translate-x-1/2 w-20 h-20 object-contain z-20"
							style={{ filter: "drop-shadow(0 0 15px rgba(212,175,55,0.6))" }}
						/>

						{
						<motion.div
							onClick={handleTorsoClick}
							className="relative z-10 cursor-pointer"
							whileTap={{ scale: 0.95 }}>
							<img
								src="https://placehold.co/100x300/transparent/white?text=Badan"
								alt="Badan Wayang"
								className="w-24 h-56 object-contain"
								style={{ filter: "drop-shadow(0 0 20px rgba(212,175,55,0.5))" }}
							/>

							<AnimatePresence>
								{showChat && (
									<motion.div
										initial={{ opacity: 0, scale: 0.5, y: 10 }}
										animate={{ opacity: 1, scale: 1, y: 0 }}
										exit={{ opacity: 0, scale: 0.5, y: 10 }}
										className="absolute -top-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-amber-300 px-4 py-2 rounded-xl text-sm whitespace-nowrap border border-amber-500/30 z-30"
										style={{ boxShadow: "0 4px 20px rgba(212,175,55,0.15)" }}>
										Halo, kisanak!
										<div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-black/80 border-r border-b border-amber-500/30 rotate-45" />
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>

						{
						<div
							className="absolute z-0"
							style={{
								left: "calc(50% + 40px)",
								top: "-60px",
								transformOrigin: "top center",
								transform: "rotate(20deg)",
							}}>
							<img
								src="https://placehold.co/60x150/transparent/white?text=Lengan"
								alt="Lengan Atas"
								className="w-12 h-32 object-contain"
								style={{ filter: "drop-shadow(0 0 10px rgba(255,140,0,0.3))" }}
							/>

							{
							<motion.img
								src="https://placehold.co/50x150/transparent/white?text=Tangan"
								alt="Lengan Bawah"
								drag
								dragConstraints={{ left: -50, right: 50, top: 0, bottom: 50 }}
								dragElastic={0.2}
								dragSnapToOrigin
								onDrag={(e, info) => dragX.set(info.offset.x)}
								onDragEnd={() => dragX.set(0)}
								className="absolute top-[130px] left-1/2 -translate-x-1/2 w-10 h-28 object-contain cursor-grab active:cursor-grabbing"
								style={{
									transformOrigin: "top center",
									rotate: rotate,
									filter: "drop-shadow(0 0 12px rgba(255,140,0,0.4))",
									zIndex: 20,
								}}
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.97 }}
							/>
						</div>
					</div>

					<p className="absolute bottom-4 left-4 text-xs text-white/30 italic">
						Tarari lengan wayang &amp; klik tubuhnya
					</p>
				</div>

				{
				<div
					className="lg:col-span-2 relative bg-neutral-900/60 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 space-y-6 shadow-2xl shadow-black/50 overflow-hidden group"
					style={{
						borderTop: "1px solid rgba(255,255,255,0.2)",
						borderLeft: "1px solid rgba(255,255,255,0.1)",
					}}>
					{
					<div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

					<h3 className="font-serif text-2xl text-amber-400 relative z-10">
						Kontrol Wayang
					</h3>
					<div className="space-y-4 relative z-10">
						<button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all shadow-inner">
							<Palette className="w-5 h-5 text-amber-500" />
							Ubah Warna
						</button>
						<button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all shadow-inner">
							<RefreshCw className="w-5 h-5 text-amber-500" />
							Reset Posisi
						</button>
						<button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all shadow-inner">
							<GripHorizontal className="w-5 h-5 text-amber-500" />
							Mode Seret
						</button>
					</div>
					<p className="text-xs text-white/40 mt-6 relative z-10">
						* Fungsionalitas tombol akan aktif di versi selanjutnya.
					</p>
				</div>
			</div>
		</section>
	);
}
