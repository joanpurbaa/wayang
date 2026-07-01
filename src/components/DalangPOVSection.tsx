"use client";
import React, { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

function InteractiveWayang2D({
	texturePath,
	mousePos,
}: {
	texturePath: string;
	mousePos: React.MutableRefObject<{ x: number; y: number }>;
}) {
	const texture = useLoader(THREE.TextureLoader, texturePath);
	const wayangRef = useRef<THREE.Mesh>(null);

	texture.minFilter = THREE.LinearFilter;

	useFrame((state) => {
		if (wayangRef.current) {
			// Menghitung batas pergerakan dinamis berdasarkan ukuran layar asli saat ini
			const isMobile = window.innerWidth < 768;
			const targetX = mousePos.current.x * (isMobile ? 1.8 : 4.5);
			const targetY =
				mousePos.current.y * (isMobile ? 1.2 : 2.2) - (isMobile ? 0.1 : 0.3);

			wayangRef.current.position.x = THREE.MathUtils.lerp(
				wayangRef.current.position.x,
				targetX,
				0.08,
			);
			wayangRef.current.position.y = THREE.MathUtils.lerp(
				wayangRef.current.position.y,
				targetY,
				0.08,
			);

			wayangRef.current.rotation.z =
				Math.sin(state.clock.getElapsedTime() * 1.5) * 0.015 +
				mousePos.current.x * (isMobile ? 0.03 : 0.06);
		}
	});

	// Skala ukuran model 2D otomatis mengecil di mobile
	return (
		<mesh ref={wayangRef} position={[0, 0, 1.2]} castShadow receiveShadow>
			<planeGeometry args={[3.2, 4.5]} />
			<meshStandardMaterial
				map={texture}
				transparent={true}
				side={THREE.DoubleSide}
				alphaTest={0.4}
				roughness={1}
				metalness={0}
			/>
		</mesh>
	);
}

interface WayangSceneProps {
	isPlaying: boolean;
	activeWayang: string;
}

function WayangScene({ isPlaying, activeWayang }: WayangSceneProps) {
	const mousePos = useRef({ x: 0, y: 0 });
	const lightRef = useRef<THREE.SpotLight>(null);

	useEffect(() => {
		// Mendukung interaksi sentuhan (Touch) untuk perangkat mobile
		const handleMouseMove = (e: MouseEvent) => {
			mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
			mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (e.touches.length > 0) {
				mousePos.current.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
				mousePos.current.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
			}
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("touchmove", handleTouchMove, { passive: true });

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("touchmove", handleTouchMove);
		};
	}, []);

	useFrame((state) => {
		if (lightRef.current && isPlaying) {
			lightRef.current.intensity =
				6 + Math.sin(state.clock.getElapsedTime() * 10) * 1.2 + Math.random() * 0.6;
		}
	});

	return (
		<>
			<spotLight
				ref={lightRef}
				position={[0, 1.8, 7]}
				angle={0.85}
				penumbra={1}
				intensity={isPlaying ? 6 : 1.2}
				color="#ffaa44"
				castShadow
				shadow-mapSize-width={1048} // dioptimalkan untuk mobile/desktop hybrid
				shadow-mapSize-height={1048}
				shadow-camera-near={1}
				shadow-camera-far={12}
				shadow-bias={-0.001}
			/>

			<ambientLight intensity={0.1} color="#1f1000" />
			<pointLight position={[0, -2, 4]} intensity={0.5} color="#fff3da" />

			{isPlaying && (
				<Suspense fallback={null}>
					<InteractiveWayang2D texturePath={activeWayang} mousePos={mousePos} />
				</Suspense>
			)}

			<mesh position={[0, 0, 0]} receiveShadow>
				<planeGeometry args={[24, 13]} />
				<meshStandardMaterial
					color="#f4ecd8"
					roughness={0.95}
					metalness={0.05}
					side={THREE.DoubleSide}
				/>
			</mesh>

			<mesh position={[0, 0, -0.02]}>
				<planeGeometry args={[24.6, 13.6]} />
				<meshStandardMaterial color="#140b02" roughness={1} />
			</mesh>
		</>
	);
}

export default function DalangPOVSection() {
	const [isPlaying, setIsPlaying] = useState(false);
	const activeWayang = "/wayang.webp";
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const gendangAudioRef = useRef<HTMLAudioElement | null>(null);
	const sectionRef = useRef<HTMLDivElement>(null);
	const [gendangHit, setGendangHit] = useState(false);
	const [showGendangHint, setShowGendangHint] = useState(true);
	const [fov, setFov] = useState(55);

	// Mengatur FOV secara dinamis agar objek 3D muat di layar HP tanpa terpotong
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setFov(85); // FOV lebih lebar untuk layar vertikal/mobile
			} else {
				setFov(55); // FOV standar desktop
			}
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		audioRef.current = new Audio("/gamelan.mp3");
		audioRef.current.loop = true;
		audioRef.current.volume = 0.4;

		gendangAudioRef.current = new Audio("/gendang.mp3");
		gendangAudioRef.current.volume = 0.7;

		return () => {
			audioRef.current?.pause();
			gendangAudioRef.current?.pause();
		};
	}, []);

	useEffect(() => {
		const handleFsChange = () => {
			if (!document.fullscreenElement && isPlaying) {
				setIsPlaying(false);
				audioRef.current?.pause();
				window.dispatchEvent(new Event("wayang-demo:end"));
			}
		};
		document.addEventListener("fullscreenchange", handleFsChange);
		return () => document.removeEventListener("fullscreenchange", handleFsChange);
	}, [isPlaying]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code !== "Space" && e.code !== "Enter") return;

			const tag = (e.target as HTMLElement)?.tagName;
			if (tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA") return;

			e.preventDefault();
			handlePukulGendang();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	useEffect(() => {
		const timer = window.setTimeout(() => setShowGendangHint(false), 60 * 3000);
		return () => window.clearTimeout(timer);
	}, []);

	const handleMulaiMendalang = async () => {
		setIsPlaying(true);

		window.dispatchEvent(new Event("wayang-demo:start"));

		audioRef.current
			?.play()
			.catch((err) => console.log("Audio autoplay ditangguhkan:", err));

		try {
			if (sectionRef.current && sectionRef.current.requestFullscreen) {
				await sectionRef.current.requestFullscreen();
			}
		} catch (err) {
			console.log("Fullscreen ditolak/tidak didukung:", err);
		}
	};

	const handleSelesai = () => {
		setIsPlaying(false);
		audioRef.current?.pause();
		if (document.fullscreenElement) {
			document.exitFullscreen().catch(() => {});
		}

		window.dispatchEvent(new Event("wayang-demo:end"));
	};

	const handlePukulGendang = () => {
		if (gendangAudioRef.current) {
			gendangAudioRef.current.currentTime = 0;
			gendangAudioRef.current
				.play()
				.catch((err) => console.log("Gendang audio ditangguhkan:", err));
		}
		setGendangHit(true);
		setShowGendangHint(false);
		window.setTimeout(() => setGendangHit(false), 180);
	};

	return (
		<section
			id="dalang"
			ref={sectionRef}
			className="relative w-full h-screen bg-[#060403] overflow-hidden flex flex-col items-center justify-center font-sans select-none">
			{/* Header text container */}
			<div className="absolute top-6 md:top-10 left-0 right-0 z-10 text-center pointer-events-none px-6">
				<p
					className="text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.5em] uppercase mb-1 md:mb-3"
					style={{ color: "rgba(200,150,60,0.6)" }}>
					Coba Sendiri
				</p>
				<h2
					className="text-3xl md:text-6xl font-light mb-2"
					style={{
						fontFamily: "'Cormorant Garamond', Georgia, serif",
						color: "#C8922A",
						textShadow: "0 2px 30px rgba(200,146,42,0.35)",
					}}>
					Panggung Dalang
				</h2>
				<p className="text-white/35 text-[9px] md:text-xs tracking-[0.18em] md:tracking-[0.25em] uppercase max-w-xs md:max-w-none mx-auto leading-relaxed">
					{isPlaying
						? "Gerakkan mouse / sentuh layar untuk mengontrol siluet"
						: "Sudut pandang sang dalang, di balik kelir"}
				</p>
			</div>

			{/* 3D WebGL Canvas */}
			<div className="absolute inset-0 z-0">
				<Canvas
					shadows={{ type: THREE.PCFShadowMap }}
					camera={{ position: [0, 0, 6.2], fov: fov }}
					dpr={[1, 1.5]}
					gl={{ antialias: true, powerPreference: "high-performance" }}>
					<WayangScene isPlaying={isPlaying} activeWayang={activeWayang} />
				</Canvas>
			</div>

			{/* Gunungan Kiri */}
			<motion.div
				className="absolute pointer-events-none select-none z-10 hidden sm:block"
				style={{
					left: "-4%",
					bottom: "-6%",
					height: "78%",
					transformOrigin: "bottom center",
					filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.6))",
				}}
				animate={{ rotate: [-7, -5.3, -7] }}
				transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
				<img
					src="/wayangGunungan.webp"
					alt=""
					aria-hidden="true"
					className="block h-full select-none"
					style={{ filter: "brightness(0)", opacity: 0.95 }}
				/>
				<img
					src="/wayangGunungan.webp"
					alt=""
					aria-hidden="true"
					className="absolute inset-0 block h-full select-none"
					style={{ opacity: 0.18, mixBlendMode: "screen" }}
				/>
			</motion.div>

			{/* Gunungan Kanan */}
			<motion.div
				className="absolute pointer-events-none select-none z-10 hidden sm:block"
				style={{
					right: "-4%",
					bottom: "-6%",
					height: "78%",
					transformOrigin: "bottom center",
					filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.6))",
				}}
				animate={{ rotate: [7, 5.3, 7] }}
				transition={{
					duration: 9.5,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 0.4,
				}}>
				<div style={{ transform: "scaleX(-1)" }}>
					<img
						src="/wayangGunungan.webp"
						alt=""
						aria-hidden="true"
						className="block h-full select-none"
						style={{ filter: "brightness(0)", opacity: 0.95 }}
					/>
					<img
						src="/wayangGunungan.webp"
						alt=""
						aria-hidden="true"
						className="absolute inset-0 block h-full select-none"
						style={{ opacity: 0.18, mixBlendMode: "screen" }}
					/>
				</div>
			</motion.div>

			{/* Siluet Pendukung Kiri */}
			<motion.img
				src="/siluet1.webp"
				alt=""
				aria-hidden="true"
				className="absolute pointer-events-none select-none z-10 h-[25%] sm:h-[40%] left-[5%] sm:left-[18%] bottom-[4%]"
				style={{
					opacity: 0.24,
					filter: "brightness(0) drop-shadow(0 6px 20px rgba(0,0,0,0.5))",
					transformOrigin: "bottom center",
				}}
				animate={{ rotate: [-2.5, 2, -2.5], y: [0, -6, 0] }}
				transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
			/>

			{/* Siluet Pendukung Kanan */}
			<motion.img
				src="/siluet2.webp"
				alt=""
				aria-hidden="true"
				className="absolute pointer-events-none select-none z-10 h-[25%] sm:h-[40%] right-[5%] sm:right-[18%] bottom-[4%]"
				style={{
					opacity: 0.24,
					filter: "brightness(0) drop-shadow(0 6px 20px rgba(0,0,0,0.5))",
					transformOrigin: "bottom center",
				}}
				animate={{ rotate: [2.5, -2, 2.5], y: [0, -6, 0] }}
				transition={{
					duration: 7.5,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 0.6,
				}}
			/>

			<div
				className="absolute inset-0 pointer-events-none z-10"
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 55%, rgba(6,4,3,0.5) 88%, rgba(6,4,3,0.92) 100%)",
				}}
			/>

			<div
				className="absolute top-0 left-0 right-0 h-px pointer-events-none z-10"
				style={{
					background:
						"linear-gradient(90deg, transparent 10%, rgba(200,146,42,0.35) 50%, transparent 90%)",
				}}
			/>
			<div
				className="absolute bottom-0 left-0 right-0 h-px pointer-events-none z-10"
				style={{
					background:
						"linear-gradient(90deg, transparent 10%, rgba(200,146,42,0.35) 50%, transparent 90%)",
				}}
			/>

			{/* Tombol Gendang */}
			<motion.button
				type="button"
				onClick={handlePukulGendang}
				aria-label="Pukul gendang"
				className="absolute z-50 select-none right-4 md:right-[5%] bottom-6 md:bottom-[9%] w-[65px] md:w-[130px]"
				style={{
					cursor: "pointer",
					pointerEvents: "auto",
				}}
				animate={{ scale: gendangHit ? 0.92 : 1 }}
				whileHover={{ scale: 1.06 }}
				transition={{ duration: 0.15, ease: "easeOut" }}>
				<img
					src="/gendang.webp"
					alt=""
					draggable={false}
					className="w-full h-auto select-none pointer-events-none"
					style={{
						filter: gendangHit
							? "drop-shadow(0 0 22px rgba(255,200,100,0.65)) brightness(1.15)"
							: "drop-shadow(0 8px 24px rgba(0,0,0,0.55))",
						transition: "filter 0.15s ease-out",
					}}
				/>

				<AnimatePresence>
					{showGendangHint && (
						<motion.div
							initial={{ opacity: 0, y: 8, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 8, scale: 0.95 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
							className="absolute bottom-full right-0 mb-3 whitespace-nowrap pointer-events-none hidden md:block"
							style={{
								background: "rgba(10,8,6,0.88)",
								border: "1px solid rgba(200,146,42,0.3)",
								borderRadius: "10px",
								padding: "8px 14px",
								boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
							}}>
							<p
								className="text-[10px] tracking-[0.15em] uppercase"
								style={{ color: "rgba(225,210,180,0.9)" }}>
								Klik gendang, atau tekan <span style={{ color: "#e0ad44" }}>Enter</span>{" "}
								/ <span style={{ color: "#e0ad44" }}>Spasi</span>
							</p>
							<div
								className="absolute top-full right-6 w-0 h-0"
								style={{
									borderLeft: "6px solid transparent",
									borderRight: "6px solid transparent",
									borderTop: "6px solid rgba(10,8,6,0.88)",
								}}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.button>

			{/* Overlay Modal Sebelum Tampil */}
			<AnimatePresence>
				{!isPlaying && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-20 px-4 sm:px-6">
						<motion.div
							initial={{ opacity: 0, y: 20, scale: 0.97 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
							className="relative text-center px-6 py-10 md:px-16 md:py-16 rounded-[24px] md:rounded-[28px] max-w-xl w-full"
							style={{
								background:
									"linear-gradient(145deg, rgba(24,18,12,0.7) 0%, rgba(10,8,6,0.85) 60%, rgba(18,14,10,0.7) 100%)",
								border: "1px solid rgba(200,146,42,0.18)",
								boxShadow:
									"0 0 60px rgba(200,146,42,0.08), inset 0 1px 0 rgba(255,220,160,0.05)",
							}}>
							<div
								className="absolute top-0 left-0 w-8 h-8 md:w-10 md:h-10 pointer-events-none"
								style={{
									borderTop: "1px solid rgba(200,146,42,0.45)",
									borderLeft: "1px solid rgba(200,146,42,0.45)",
									borderTopLeftRadius: "24px",
								}}
							/>
							<div
								className="absolute top-0 right-0 w-8 h-8 md:w-10 md:h-10 pointer-events-none"
								style={{
									borderTop: "1px solid rgba(200,146,42,0.45)",
									borderRight: "1px solid rgba(200,146,42,0.45)",
									borderTopRightRadius: "24px",
								}}
							/>
							<div
								className="absolute bottom-0 left-0 w-8 h-8 md:w-10 md:h-10 pointer-events-none"
								style={{
									borderBottom: "1px solid rgba(200,146,42,0.45)",
									borderLeft: "1px solid rgba(200,146,42,0.45)",
									borderBottomLeftRadius: "24px",
								}}
							/>
							<div
								className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 pointer-events-none"
								style={{
									borderBottom: "1px solid rgba(200,146,42,0.45)",
									borderRight: "1px solid rgba(200,146,42,0.45)",
									borderBottomRightRadius: "24px",
								}}
							/>

							<div
								className="mx-auto mb-4 md:mb-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
								style={{
									border: "1px solid rgba(200,146,42,0.35)",
									background: "rgba(200,146,42,0.06)",
								}}>
								<div
									className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
									style={{
										background: "#ffd27a",
										boxShadow: "0 0 14px 4px rgba(255,200,100,0.7)",
									}}
								/>
							</div>

							<p
								className="text-base md:text-xl tracking-[0.3em] md:tracking-[0.4em] uppercase mb-2 md:mb-3"
								style={{ color: "rgba(200,150,60,0.6)" }}>
								Sebelum Tampil
							</p>

							<p
								className="max-w-xs md:max-w-sm mx-auto text-lg md:text-2xl font-light mb-8 md:mb-10 leading-relaxed"
								style={{
									fontFamily: "'Cormorant Garamond', Georgia, serif",
									fontStyle: "italic",
									color: "rgba(225,210,180,0.85)",
								}}>
								Kelir putih sudah dibentang, lampu blencong siap menyala. Silakan mulai
								lakon pertunjukan.
							</p>

							<button
								onClick={handleMulaiMendalang}
								className="px-8 py-3 md:px-10 md:py-3.5 text-black font-semibold tracking-[0.2em] text-[10px] md:text-xs uppercase rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
								style={{
									background: "linear-gradient(145deg, #e0ad44, #C8922A)",
									boxShadow: "0 0 40px rgba(200,146,42,0.35)",
								}}>
								Mulai Mendalang
							</button>

							<p
								className="mt-6 md:mt-8 text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.25em] uppercase"
								style={{ color: "rgba(200,150,60,0.35)" }}>
								Gerakkan jari / mouse setelah dimulai
							</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Tombol Selesai */}
			<AnimatePresence>
				{isPlaying && (
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						className="absolute bottom-6 md:bottom-10 left-0 right-0 z-10 flex justify-center">
						<button
							onClick={handleSelesai}
							className="px-6 py-2 md:px-7 md:py-2.5 text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-white/70 hover:text-white border border-white/10 rounded-full backdrop-blur-md transition-all active:scale-95"
							style={{ background: "rgba(0,0,0,0.4)" }}>
							Selesai
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
}
