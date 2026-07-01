import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function KawungPattern() {
	return (
		<svg
			className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none"
			xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern
					id="kawung"
					x="0"
					y="0"
					width="48"
					height="48"
					patternUnits="userSpaceOnUse">
					<ellipse cx="24" cy="16" rx="6" ry="10" fill="#D4AF37" />
					<ellipse cx="24" cy="32" rx="6" ry="10" fill="#D4AF37" />
					<ellipse cx="16" cy="24" rx="10" ry="6" fill="#D4AF37" />
					<ellipse cx="32" cy="24" rx="10" ry="6" fill="#D4AF37" />
					<circle cx="24" cy="24" r="3" fill="#D4AF37" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#kawung)" />
		</svg>
	);
}

function KelirBorder() {
	return (
		<div className="w-full h-5 overflow-hidden">
			<svg
				viewBox="0 0 1440 20"
				fill="none"
				className="w-full h-full"
				preserveAspectRatio="none">
				<path
					d="M0 10 Q30 0 60 10 T120 10 T180 10 T240 10 T300 10 T360 10 T420 10 T480 10 T540 10 T600 10 T660 10 T720 10 T780 10 T840 10 T900 10 T960 10 T1020 10 T1080 10 T1140 10 T1200 10 T1260 10 T1320 10 T1380 10 T1440 10 V20 H0Z"
					fill="rgba(212,175,55,0.08)"
				/>
				<path
					d="M0 10 Q30 0 60 10 T120 10 T180 10 T240 10 T300 10 T360 10 T420 10 T480 10 T540 10 T600 10 T660 10 T720 10 T780 10 T840 10 T900 10 T960 10 T1020 10 T1080 10 T1140 10 T1200 10 T1260 10 T1320 10 T1380 10 T1440 10"
					stroke="rgba(212,175,55,0.3)"
					strokeWidth="1.5"
					fill="none"
				/>
				{Array.from({ length: 25 }).map((_, i) => (
					<circle
						key={i}
						cx={i * 60 + 30}
						cy="10"
						r="2"
						fill="rgba(212,175,55,0.25)"
					/>
				))}
			</svg>
		</div>
	);
}

function IconArrowUp() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			className="w-5 h-5">
			<path d="M12 19V5M5 12l7-7 7 7" />
		</svg>
	);
}

export default function Footer() {
	const footerRef = useRef<HTMLElement>(null);

	const navLinks = [
		{ label: "Beranda", href: "#" },
		{ label: "Bagian Wayang", href: "#parts" },
		{ label: "Sejarah", href: "#sejarah" },
		{ label: "Tokoh", href: "#tokoh" },
		{ label: "Dalang POV", href: "#dalang" },
	];

	return (
		<footer
			ref={footerRef}
			className="relative z-30 bg-[#050505] overflow-hidden">
			<KawungPattern />

			{/* Menyesuaikan ukuran latar pendar cahaya agar proporsional di mobile */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[700px] h-80 bg-[radial-gradient(ellipse,rgba(212,175,55,0.09)_0%,transparent_70%)] pointer-events-none" />
			<KelirBorder />

			{/* Tambah px-6 untuk mobile agar konten memiliki jarak aman dari tepi layar */}
			<div className="relative z-10 max-w-7xl mx-auto pt-14 md:pt-20 pb-8 px-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 mb-14 md:mb-16">
					<div className="footer-col">
						<div className="flex items-center gap-4 mb-5">
							<img
								src="/icon.svg"
								className="w-14 h-14 md:w-16 md:h-16 drop-shadow-[0_0_12px_rgba(212,175,55,0.25)]"
								alt=""
							/>
							<div>
								<h3 className="text-[#F5F5F5] font-serif text-xl md:text-3xl tracking-tight">
									Wayang Golek
								</h3>
								<p className="text-amber-400/60 text-[10px] md:text-xs tracking-[0.3em] uppercase mt-1">
									Nuansa Jawa
								</p>
							</div>
						</div>
						<p className="text-white/60 text-sm md:text-base leading-relaxed max-w-md">
							Menjelajahi keagungan seni wayang golek — dari ukiran kayu hingga jiwa
							pertunjukan yang menghidupkan filsafat Jawa.
						</p>
					</div>

					<div className="footer-col md:justify-self-end">
						<h4 className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-amber-400/80 font-semibold mb-4 md:mb-5">
							Navigasi
						</h4>
						<ul className="space-y-2.5 md:space-y-3.5">
							{navLinks.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										className="group flex items-center gap-2.5 text-white/65 text-base md:text-xl font-medium hover:text-amber-400 transition-colors duration-300">
										<span className="block w-0 group-hover:w-4 h-0.5 bg-amber-400 transition-all duration-300" />
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="footer-divider relative h-px bg-white/15 mb-8 origin-left">
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#050505] px-4">
						<span className="block w-6 md:w-8 h-px bg-amber-400/50" />
						<span className="text-amber-400/60 text-[10px] md:text-xs">◆</span>
						<span className="block w-6 md:w-8 h-px bg-amber-400/50" />
					</div>
				</div>

				{/* Menyesuaikan ukuran font Jawa agar tidak terpotong/membungkus terlalu berantakan di mobile */}
				<div className="footer-quote text-center mb-12 md:mb-8 px-2">
					<p className="font-serif text-xl sm:text-2xl md:text-5xl text-amber-400/90 italic leading-snug md:leading-tight tracking-tight max-w-3xl mx-auto">
						"Wayang iku dudu wewayangan, nanging kanyataan."
					</p>
					<p className="text-white/45 text-[10px] md:text-sm tracking-widest uppercase mt-3 max-w-md md:max-w-none mx-auto leading-normal">
						Wayang bukan sekadar bayangan, melainkan kenyataan
					</p>
				</div>

				{/* Mengubah flex-row menjadi flex-col-reverse pada perangkat seluler agar susunan hak cipta dan tombol vertikal rapi */}
				<div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-2">
					<p className="text-white/45 text-xs md:text-sm tracking-wide text-center sm:text-left">
						© {new Date().getFullYear()} Wayang Golek Nuansa Jawa
					</p>
					<button
						onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						aria-label="Kembali ke atas"
						className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-amber-500/30 bg-amber-500/5 flex items-center justify-center text-amber-400/70 hover:text-amber-300 hover:border-amber-400/60 hover:bg-amber-500/10 transition-all duration-300">
						<IconArrowUp />
					</button>
				</div>
			</div>

			<div className="w-full h-5 overflow-hidden rotate-180">
				<KelirBorder />
			</div>
		</footer>
	);
}
