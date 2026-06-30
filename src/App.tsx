// src/App.tsx
import HeroSection from "./components/HeroSection";
// import DalangMode from "./components/DalangMode";
import TokohSection from "./components/TokohSection";
// import LoreSection from "./components/LoreSection";
import WayangBackground from "./components/WayangBackground";
import PartsSection from "./components/partsSection";
import AudioPlayer from "./components/AudioPlayer";
import CustomCursor from "./components/CustomCursor";
import Lenis from "lenis";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DalangPOVSection from "./components/DalangPOVSection";
import SejarahSection from "./components/SejarahSection";

// Register plugin GSAP — wajib sebelum dipakai
gsap.registerPlugin(ScrollTrigger);

export default function App() {
	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.4,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
		});

		// Sync Lenis scroll ke GSAP ScrollTrigger
		lenis.on("scroll", ScrollTrigger.update);

		const ticker = (time: number) => lenis.raf(time * 1000);
		gsap.ticker.add(ticker);
		gsap.ticker.lagSmoothing(0);

		return () => {
			lenis.destroy();
			gsap.ticker.remove(ticker); // cleanup ticker biar tidak leak
		};
	}, []);

	return (
		<div className="relative">
			{/* Custom cursor — paling atas */}
			<CustomCursor />

			{/* Fixed 3D background wayang golek */}
			<WayangBackground />

			{/* Audio gamelan ambient — fixed bottom-left */}
			<AudioPlayer />

			{/* Scrollable content */}
			<main className="relative z-10 bg-transparent text-[#F5F5F5] font-sans">
				<HeroSection />
				<PartsSection />
				<SejarahSection />
				<TokohSection />
				<DalangPOVSection />
				{/* <DalangMode /> */}
				{/* <LoreSection /> */}

				{/* Footer */}
				<footer className="relative py-16 border-t border-white/5 overflow-hidden">
					{/* Glow latar */}
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04)_0%,transparent_70%)]" />
					<div className="relative z-10 text-center">
						<p className="font-serif text-2xl text-amber-400/60 italic mb-2">
							"Wayang iku dudu wewayangan, nanging kanyataan."
						</p>
						<p className="text-white/25 text-xs tracking-widest uppercase mb-8">
							Wayang bukan sekadar bayangan, melainkan kenyataan
						</p>
						<div className="flex items-center justify-center gap-3 text-white/20 text-xs">
							<span className="block w-12 h-px bg-amber-500/20" />
							Warisan Budaya Tak Benda — UNESCO 2008
							<span className="block w-12 h-px bg-amber-500/20" />
						</div>
					</div>
				</footer>
			</main>
		</div>
	);
}
