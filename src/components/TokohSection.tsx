"use client";
import { motion } from "framer-motion";
import { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stage, Center } from "@react-three/drei";
import * as THREE from "three";

// ── Konfigurasi Data 4 Tokoh ──────────────────────────────────────────────────
const TOKOH = [
	{
		id: "arjuna",
		nama: "Arjuna",
		gelar: "Sang Panah Dewa",
		glbPath: "/wayang.glb",
		warna: "#C8922A",
		r: 200,
		g: 146,
		b: 42,
		filosofi:
			"Keberanian sejati bukan absennya rasa takut, melainkan tekad yang melampaui ketakutan itu sendiri.",
		sifat: ["Bijaksana", "Setia", "Ksatria"],
		deskripsi:
			"Putra ketiga Pandawa, Arjuna adalah pemanah terbaik di jagat pewayangan. Ia menjadi murid kesayangan Drona dan penerima ajaran Bhagavad Gita langsung dari Krisna di medan Kurusetra.",
	},
	{
		id: "semar",
		nama: "Semar",
		gelar: "Sang Pamomong Agung",
		glbPath: "/semar.glb",
		warna: "#A8892A",
		r: 168,
		g: 137,
		b: 42,
		filosofi:
			"Dalam kerendahan hati tersembunyi kekuatan yang tidak bisa dikalahkan oleh senjata manapun.",
		sifat: ["Bijaksana", "Pengasih", "Sakti"],
		deskripsi:
			"Wujud fisik Semar yang gemuk dan sederhana menyembunyikan kesaktian setara dewa. Ia adalah pamomong para ksatria Pandawa — sosok rakyat jelata yang sesungguhnya paling mulia.",
	},
	{
		id: "hanoman",
		nama: "Hanoman",
		gelar: "Sang Ksatria Putih",
		glbPath: "/hanoman.glb",
		warna: "#E5E5E5",
		r: 229,
		g: 229,
		b: 229,
		filosofi:
			"Kesetiaan tanpa syarat kepada kebenaran adalah manifestasi tertinggi dari kekuatan jiwa.",
		sifat: ["Suci", "Pemberani", "Abadi"],
		deskripsi:
			"Ksatria berwujud kera putih yang sakti mandraguna. Panglima perang andalan Sri Rama yang meruntuhkan Alengka ini melambangkan keteguhan iman, kesucian fisik, serta kesetiaan mutlak.",
	},
	{
		id: "cepot",
		nama: "Cepot",
		gelar: "Sang Badut Bijak",
		glbPath: "/cepot.glb",
		warna: "#B84040",
		r: 184,
		g: 64,
		b: 64,
		filosofi:
			"Tawa adalah senjata paling tajam untuk melukai kebodohan dan kesombongan.",
		sifat: ["Jenaka", "Berani", "Jujur"],
		deskripsi:
			"Anak sulung Semar yang paling populer di tanah Sunda. Di balik lelucon dan tingkahnya yang kocak, Cepot kerap menyampaikan kritik sosial paling tajam yang bahkan raja pun tak berani ucapkan.",
	},
];

// ── Skeleton loader saat GLB belum siap ──────────────────────────────────────
function ModelSkeleton({ r, g, b }: { r: number; g: number; b: number }) {
	return (
		<div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
			{/* Silhouette wayang animasi pulse */}
			<div
				className="w-32 h-64 rounded-full animate-pulse"
				style={{
					background: `radial-gradient(ellipse at 50% 30%, rgba(${r},${g},${b},0.15) 0%, rgba(${r},${g},${b},0.04) 60%, transparent 100%)`,
					boxShadow: `0 0 40px rgba(${r},${g},${b},0.1)`,
				}}
			/>
			<div
				className="text-xs tracking-[0.3em] uppercase animate-pulse"
				style={{ color: `rgba(${r},${g},${b},0.4)` }}>
				Memuat model...
			</div>
		</div>
	);
}

// ── Model 3D dengan auto-rotate ───────────────────────────────────────────────
function WayangModel({ url }: { url: string }) {
	const { scene } = useGLTF(url);
	const modelRef = useRef<THREE.Group>(null);

	useFrame((state) => {
		if (modelRef.current) {
			modelRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
		}
	});

	scene.traverse((child) => {
		if ((child as THREE.Mesh).isMesh) {
			const mesh = child as THREE.Mesh;
			if (mesh.material) {
				const mat = mesh.material as THREE.MeshStandardMaterial;
				mat.roughness = Math.min(mat.roughness, 0.2);
				mat.metalness = Math.max(mat.metalness, 0.4);
			}
		}
	});

	return (
		<group ref={modelRef}>
			<Center>
				<primitive object={scene} />
			</Center>
		</group>
	);
}

// ── Canvas 3D — hanya dirender setelah visible di viewport ───────────────────
function LazyCanvas({
	glbPath,
	t,
	shouldLoad,
}: {
	glbPath: string;
	t: (typeof TOKOH)[0];
	shouldLoad: boolean;
}) {
	if (!shouldLoad) {
		return <ModelSkeleton r={t.r} g={t.g} b={t.b} />;
	}

	return (
		<Canvas
			camera={{ position: [0, 0, 12], fov: 40 }}
			gl={{ antialias: true, alpha: true }}
			// frameloop="demand" = render hanya saat ada perubahan (hemat GPU)
			// Tapi karena ada rotasi terus, pakai "always" — lebih efisien dari default
			frameloop="always"
			performance={{ min: 0.5 }} // turunkan DPR otomatis kalau GPU kewalahan
		>
			<ambientLight intensity={0.5} />
			<spotLight
				position={[15, 20, 10]}
				angle={0.3}
				penumbra={1}
				intensity={2.5}
				castShadow={false}
			/>
			<directionalLight position={[-10, 5, -5]} intensity={1} color="#ffffff" />
			<pointLight
				position={[0, -5, 5]}
				intensity={1.2}
				color={`rgb(${t.r},${t.g},${t.b})`}
			/>

			<Suspense fallback={null}>
				<Stage
					preset="portrait"
					intensity={1}
					environment="studio"
					adjustCamera={true}
					shadows={false}>
					<WayangModel url={glbPath} />
				</Stage>
			</Suspense>

			<OrbitControls
				enableZoom={false}
				enablePan={false}
				maxPolarAngle={Math.PI / 1.8}
				minPolarAngle={Math.PI / 2.5}
			/>
		</Canvas>
	);
}

// ── Hook: deteksi apakah elemen sudah masuk viewport ─────────────────────────
function useInViewOnce(
	rootMargin = "200px",
): [React.RefObject<HTMLDivElement | null>, boolean] {
	const ref = useRef<HTMLDivElement | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el || isVisible) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect(); // cukup trigger sekali
				}
			},
			{ rootMargin }, // mulai load 200px sebelum masuk viewport
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [isVisible, rootMargin]);

	return [ref, isVisible];
}

// ── Kartu Tokoh ───────────────────────────────────────────────────────────────
function TokohCard({ t, index }: { t: (typeof TOKOH)[0]; index: number }) {
	const cardRef = useRef<HTMLDivElement>(null);
	const borderRef = useRef<HTMLDivElement>(null);

	// Lazy load: GLB hanya di-fetch saat card mendekati viewport
	const [observerRef, shouldLoad] = useInViewOnce("300px");

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const card = cardRef.current;
		const border = borderRef.current;
		if (!card || !border) return;

		const rect = card.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;
		const rX = (0.5 - y) * 5;
		const rY = (x - 0.5) * 8;

		card.style.transform = `perspective(1200px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-5px) scale(1.005)`;

		const angle = Math.atan2(y - 0.5, x - 0.5) * (180 / Math.PI) + 145;
		const bright = 0.45 + x * 0.45;
		border.style.background = `linear-gradient(${angle}deg,
      rgba(${t.r + 70},${t.g + 55},${t.b + 15},${bright}) 0%,
      rgba(${t.r},${t.g},${t.b},0.1) 40%,
      rgba(40,30,8,0.05) 65%,
      rgba(${t.r + 50},${t.g + 40},${t.b + 5},${bright * 0.55}) 100%
    )`;
	};

	const handleMouseLeave = () => {
		const card = cardRef.current;
		const border = borderRef.current;
		if (!card || !border) return;

		card.style.transform = "";
		border.style.background = `linear-gradient(145deg,
      rgba(${t.r + 60},${t.g + 50},${t.b + 10},0.55) 0%,
      rgba(${t.r},${t.g},${t.b},0.12) 35%,
      rgba(60,45,15,0.06) 65%,
      rgba(${t.r + 50},${t.g + 40},${t.b},0.38) 100%
    )`;
	};

	return (
		<div
			className="sticky w-full"
			style={{ top: `calc(60px + ${index * 32}px)` }}>
			{/* Observer anchor — ref di div luar agar deteksi lebih awal */}
			<div ref={observerRef}>
				<motion.div
					initial={{ opacity: 0, y: 60 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-5%" }}
					transition={{ duration: 0.7, ease: "easeOut" }}>
					<div
						ref={cardRef}
						onMouseMove={handleMouseMove}
						onMouseLeave={handleMouseLeave}
						className="relative rounded-[40px] overflow-hidden cursor-default group"
						style={{
							transition: "transform 0.5s cubic-bezier(0.23,1,0.32,1)",
							willChange: "transform",
						}}>
						{/* Glassmorphism Base */}
						<div
							className="absolute inset-0 rounded-[40px]"
							style={{
								background: `linear-gradient(145deg,
                  rgba(24,20,16,0.85) 0%,
                  rgba(10,9,7,0.93) 50%,
                  rgba(18,15,12,0.88) 100%
                )`,
								backdropFilter: "blur(40px)",
								WebkitBackdropFilter: "blur(40px)",
							}}
						/>

						{/* Shimmering Border */}
						<div
							ref={borderRef}
							className="absolute inset-0 rounded-[40px] pointer-events-none"
							style={{
								padding: "2px",
								background: `linear-gradient(145deg,
                  rgba(${t.r + 60},${t.g + 50},${t.b + 10},0.55) 0%,
                  rgba(${t.r},${t.g},${t.b},0.12) 35%,
                  rgba(60,45,15,0.06) 65%,
                  rgba(${t.r + 50},${t.g + 40},${t.b},0.38) 100%
                )`,
								WebkitMask:
									"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
								WebkitMaskComposite: "xor",
								maskComposite: "exclude",
								zIndex: 10,
								transition: "background 0.15s ease",
							}}
						/>

						{/* Top glow line */}
						<div
							className="absolute top-0 left-0 right-0 pointer-events-none rounded-t-[40px]"
							style={{
								height: "1.5px",
								background: `linear-gradient(90deg, transparent 15%, rgba(${t.r},${t.g},${t.b},0.6) 50%, transparent 85%)`,
								boxShadow: `0 0 35px 3px rgba(${t.r},${t.g},${t.b},0.35)`,
								zIndex: 11,
							}}
						/>

						{/* Content */}
						<div className="relative z-[5] p-10 md:p-16">
							<div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
								{/* Kolom Kiri: Canvas 3D Lazy */}
								<div className="md:col-span-5 w-full">
									<div className="relative rounded-[30px] overflow-hidden shadow-2xl border border-white/5 w-full min-h-[480px] md:min-h-[550px] flex items-center justify-center">
										{/* Background gradient gelap di belakang canvas */}
										<div
											className="absolute inset-0"
											style={{
												background: `radial-gradient(ellipse at 50% 40%, rgba(${t.r},${t.g},${t.b},0.06) 0%, rgba(5,4,3,0.95) 70%)`,
											}}
										/>

										{/* Canvas atau Skeleton — bergantung shouldLoad */}
										<div className="absolute inset-0 w-full h-full z-[1]">
											<LazyCanvas glbPath={t.glbPath} t={t} shouldLoad={shouldLoad} />
										</div>

										{/* Gradien bawah */}
										<div
											className="absolute inset-0 z-[2] pointer-events-none"
											style={{
												background:
													"linear-gradient(to top, rgba(10,8,6,0.9) 0%, rgba(10,8,6,0.1) 40%, transparent 70%)",
											}}
										/>

										{/* Inner rim */}
										<div
											className="absolute inset-0 rounded-[30px] z-[4] pointer-events-none"
											style={{ border: `1px solid rgba(${t.r},${t.g},${t.b},0.15)` }}
										/>
									</div>
								</div>

								{/* Kolom Kanan: Info */}
								<div className="md:col-span-7 flex flex-col gap-8 w-full text-left">
									<div>
										<h3
											className="font-serif text-[clamp(3rem,5vw,4.5rem)] font-normal leading-none mb-3"
											style={{
												fontFamily: "'Cormorant Garamond', Georgia, serif",
												color: t.warna,
												textShadow: `0 2px 30px rgba(${t.r},${t.g},${t.b},0.5), 0 0 60px rgba(${t.r},${t.g},${t.b},0.2)`,
											}}>
											{t.nama}
										</h3>
										<p
											className="uppercase tracking-[0.4em] text-[13px] md:text-[14px] font-medium"
											style={{ color: "rgba(255,255,255,0.45)" }}>
											{t.gelar}
										</p>
									</div>

									{/* Badges */}
									<div className="flex flex-wrap gap-3">
										{t.sifat.map((s) => (
											<span
												key={s}
												className="text-[13px] font-semibold tracking-wider px-5 py-2 rounded-full border transition-all duration-300"
												style={{
													borderColor: `rgba(${t.r},${t.g},${t.b},0.4)`,
													color: t.warna,
													background: `rgba(${t.r},${t.g},${t.b},0.08)`,
													boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
												}}>
												{s}
											</span>
										))}
									</div>

									{/* Divider */}
									<div
										style={{
											height: "1px",
											background: `linear-gradient(90deg, rgba(${t.r},${t.g},${t.b},0.3) 0%, rgba(${t.r},${t.g},${t.b},0.08) 80%, transparent 100%)`,
										}}
									/>

									{/* Deskripsi */}
									<p
										className="text-base md:text-lg text-justify font-light leading-relaxed tracking-wide"
										style={{ color: "rgba(255,255,255,0.75)" }}>
										{t.deskripsi}
									</p>

									{/* Filosofi */}
									<div
										className="pl-7 pr-6 py-5 rounded-r-2xl relative overflow-hidden shadow-inner border-y border-r border-white/[0.02]"
										style={{
											borderLeft: `4px solid rgba(${t.r},${t.g},${t.b},0.6)`,
											background: `rgba(${t.r},${t.g},${t.b},0.05)`,
										}}>
										<p
											className="italic text-[20px] md:text-[23px] leading-relaxed relative z-[1]"
											style={{
												fontFamily: "'Cormorant Garamond', Georgia, serif",
												color: "rgba(240,225,190,0.95)",
											}}>
											"{t.filosofi}"
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

// ── Preload hanya tokoh pertama saat idle ─────────────────────────────────────
// Tokoh 2-4 akan di-fetch otomatis via IntersectionObserver saat scroll
if (typeof window !== "undefined") {
	// requestIdleCallback: jalankan saat browser idle, tidak blok render awal
	const ric =
		(window as any).requestIdleCallback ??
		((cb: () => void) => setTimeout(cb, 200));
	ric(() => useGLTF.preload("/wayang.glb"));
}

// ── Section Utama ─────────────────────────────────────────────────────────────
export default function TokohSection() {
	return (
		<section className="relative py-40 px-4 md:px-12" id="tokoh">
			<div
				className="absolute left-0 top-0 h-full w-px pointer-events-none"
				style={{
					background:
						"linear-gradient(to bottom, transparent, rgba(180,140,50,0.15), transparent)",
				}}
			/>

			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-32 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 px-4">
					<div>
						<p
							className="text-xs tracking-[0.5em] uppercase mb-4 font-medium"
							style={{ color: "rgba(200,150,60,0.75)" }}>
							Para Tokoh
						</p>
						<h2
							className="font-serif text-6xl md:text-8xl font-light leading-tight text-white"
							style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
							Raga &amp;{" "}
							<em className="not-italic" style={{ color: "#c8a84a" }}>
								Jiwa
							</em>
						</h2>
					</div>
					<p
						className="text-base md:text-lg max-w-md leading-relaxed"
						style={{ color: "rgba(255,255,255,0.4)" }}>
						Setiap karakter adalah cermin — cetak biru leluhur yang dirancang untuk
						mengajarkan bagaimana keselarasan hidup diarungi di atas panggung
						realitas.
					</p>
				</div>

				{/* Cards */}
				<div className="flex flex-col gap-24 md:gap-36">
					{TOKOH.map((t, index) => (
						<TokohCard key={t.id} t={t} index={index} />
					))}
				</div>
			</div>
		</section>
	);
}
