"use client";
import { motion } from "framer-motion";
import { useRef } from "react";

const TOKOH = [
	{
		id: "arjuna",
		nama: "Arjuna",
		gelar: "Sang Panah Dewa",
		img: "/arjuna.png",
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
		img: "/semar.png",
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
		id: "cepot",
		nama: "Cepot",
		gelar: "Sang Badut Bijak",
		img: "/cepot.png",
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
	{
		id: "gatotkaca",
		nama: "Gatotkaca",
		gelar: "Sang Satria Pringgandani",
		img: "/gatotkaca.png",
		warna: "#A8892A",
		r: 168,
		g: 137,
		b: 42,
		filosofi:
			"Kekuatan tanpa kebijaksanaan hanya akan menghancurkan diri sendiri.",
		sifat: ["Perkasa", "Loyal", "Pemberani"],
		deskripsi:
			"Putra Bima dengan otot kawat tulang besi. Gatotkaca mampu terbang menembus langit ketujuh. Ia gugur di medan Kurusetra demi membela para pamannya — mati sebagai pahlawan sejati.",
	},
];

function TokohCard({ t, index }: { t: (typeof TOKOH)[0]; index: number }) {
	const cardRef = useRef<HTMLDivElement>(null);
	const borderRef = useRef<HTMLDivElement>(null);

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
			{" "}
			{/* Offset top disesuaikan agar tumpukan masif tetap rapi */}
			<motion.div
				initial={{ opacity: 0, y: 60 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-5%" }}
				transition={{ duration: 0.7, ease: "easeOut" }}>
				{/* Card wrapper */}
				<div
					ref={cardRef}
					onMouseMove={handleMouseMove}
					onMouseLeave={handleMouseLeave}
					className="relative rounded-[40px] overflow-hidden cursor-default shadow-[0_40px_90px_rgba(0,0,0,0.9)]"
					style={{
						transition: "transform 0.5s cubic-bezier(0.23,1,0.32,1)",
						willChange: "transform",
					}}>
					{/* ── Glass layers ── */}

					{/* 1. Dark glass base */}
					<div
						className="absolute inset-0 rounded-[40px]"
						style={{
							background: `linear-gradient(145deg,
                rgba(35,30,22,0.95) 0%,
                rgba(14,12,9,0.98) 50%,
                rgba(24,20,14,0.96) 100%
              )`,
							backdropFilter: "blur(30px)",
							WebkitBackdropFilter: "blur(30px)",
						}}
					/>

					{/* 2. Shimmering border rim */}
					<div
						ref={borderRef}
						className="absolute inset-0 rounded-[40px] pointer-events-none"
						style={{
							padding: "2px", // Border rim disesuaikan ketebalannya dengan skala raksasa
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

					{/* 3. Top glow line (accent color) */}
					<div
						className="absolute top-0 left-0 right-0 pointer-events-none rounded-t-[40px]"
						style={{
							height: "1.5px",
							background: `linear-gradient(90deg, transparent 15%, rgba(${t.r},${t.g},${t.b},0.6) 50%, transparent 85%)`,
							boxShadow: `0 0 35px 3px rgba(${t.r},${t.g},${t.b},0.35)`,
							zIndex: 11,
						}}
					/>

					{/* 4. Specular highlight top-left */}
					<div
						className="absolute top-0 left-0 right-0 pointer-events-none rounded-t-[40px] opacity-0 group-hover:opacity-100"
						style={{
							height: "65%",
							background: `linear-gradient(160deg,
                rgba(255,240,180,0.09) 0%,
                rgba(255,230,160,0.04) 30%,
                transparent 60%
              )`,
							transition: "opacity 0.35s",
							zIndex: 9,
						}}
					/>

					{/* 5. Shimmer sweep */}
					<div
						className="absolute inset-0 rounded-[40px] pointer-events-none opacity-0 group-hover:opacity-100"
						style={{
							background: `linear-gradient(115deg,
                transparent 25%,
                rgba(255,245,190,0.08) 50%,
                transparent 75%
              )`,
							transition: "opacity 0.4s ease",
							zIndex: 8,
						}}
					/>

					{/* ── Card content (Layout Grid Proporsional Dua Kolom) ── */}
					<div className="relative z-[5] p-10 md:p-16 group">
						<div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
							{/* KOLOM KIRI: Frame Gambar Seni Wayang Raksasa (5/12 bagian) */}
							<div className="md:col-span-5 w-full">
								<div className="relative rounded-[30px] overflow-hidden bg-[#050403] shadow-2xl border border-white/5 w-full min-h-[480px] md:min-h-[550px] flex items-center justify-center">
									<img
										src={t.img}
										alt={t.nama}
										className="w-full h-full object-cover object-top absolute inset-0"
										style={{
											filter: "brightness(0.9) contrast(1.1) saturate(0.9)",
											transition:
												"filter 0.5s ease, transform 0.6s cubic-bezier(0.23,1,0.32,1)",
										}}
									/>

									{/* Gradien kedalaman gambar */}
									<div
										className="absolute inset-0 z-[2]"
										style={{
											background:
												"linear-gradient(to top, rgba(10,8,6,1) 0%, rgba(10,8,6,0.3) 50%, transparent 80%)",
										}}
									/>

									{/* Efek kilap internal */}
									<div
										className="absolute inset-0 z-[3]"
										style={{
											background: `linear-gradient(135deg,
                        rgba(255,245,210,0.09) 0%,
                        rgba(255,240,200,0.04) 25%,
                        transparent 50%,
                        rgba(0,0,0,0.2) 100%
                      )`,
										}}
									/>

									{/* Bingkai rim kaca pada gambar */}
									<div
										className="absolute inset-0 rounded-[30px] z-[4]"
										style={{
											border: `1px solid rgba(220,185,90,0.12)`,
										}}
									/>
								</div>
							</div>

							{/* KOLOM KANAN: Detail Info & Filosofi (7/12 bagian) */}
							<div className="md:col-span-7 flex flex-col gap-8 w-full text-left">
								<div>
									<h3
										className="font-serif text-[clamp(3rem,5vw,4.5rem)] font-normal leading-none mb-3 transition-transform duration-300"
										style={{
											fontFamily: "'Cormorant Garamond', Georgia, serif",
											color: t.warna,
											textShadow: `0 2px 30px rgba(${t.r},${t.g},${t.b},0.6), 0 0 60px rgba(${t.r},${t.g},${t.b},0.25)`,
										}}>
										{t.nama}
									</h3>
									<p
										className="uppercase tracking-[0.4em] text-[13px] md:text-[14px] font-medium"
										style={{ color: "rgba(255,255,255,0.45)" }}>
										{t.gelar}
									</p>
								</div>

								{/* Sifat Badges */}
								<div className="flex flex-wrap gap-3">
									{t.sifat.map((s) => (
										<span
											key={s}
											className="text-[13px] font-semibold tracking-wider px-5 py-2 rounded-full border transition-all duration-300"
											style={{
												borderColor: `rgba(${t.r},${t.g},${t.b},0.4)`,
												color: t.warna,
												background: `rgba(${t.r},${t.g},${t.b},0.08)`,
												boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
											}}>
											{s}
										</span>
									))}
								</div>

								{/* Divider Line */}
								<div
									style={{
										height: "1px",
										background: `linear-gradient(90deg, rgba(200,170,70,0.2) 0%, rgba(180,150,60,0.1) 80%, transparent 100%)`,
									}}
								/>

								{/* Deskripsi Tokoh */}
								<p
									className="text-base md:text-lg text-justify font-light leading-relaxed tracking-wide"
									style={{ color: "rgba(255,255,255,0.72)" }}>
									{t.deskripsi}
								</p>

								{/* Kotak Kutipan Filosofi Besar */}
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
											color: "rgba(240,225,190,0.92)",
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
	);
}

export default function TokohSection() {
	return (
		<section className="relative py-40 px-4 md:px-12" id="tokoh">
			{/* Ornamen garis emas vertikal kiri */}
			<div
				className="absolute left-0 top-0 h-full w-px pointer-events-none"
				style={{
					background:
						"linear-gradient(to bottom, transparent, rgba(180,140,50,0.15), transparent)",
				}}
			/>

			{/* Skala lebar kontainer dinaikkan penuh ke max-w-7xl */}
			<div className="max-w-7xl mx-auto">
				{/* Header Section */}
				<div className="mb-32 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 px-4">
					<div>
						<p
							className="text-xs tracking-[0.5em] uppercase mb-4 font-medium"
							style={{ color: "rgba(200,150,60,0.75)" }}>
							Para Tokoh
						</p>
						<h2
							className="font-serif text-6xl md:text-8xl font-light leading-tight"
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
						Every character is a mirror — an ancient blueprint designed to teach us
						how a complete human being ought to navigate reality.
					</p>
				</div>

				{/* Stacking cards */}
				<div className="flex flex-col gap-24 md:gap-36">
					{TOKOH.map((t, index) => (
						<TokohCard key={t.id} t={t} index={index} />
					))}
				</div>
			</div>
		</section>
	);
}
