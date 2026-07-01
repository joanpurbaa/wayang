import HeroSection from "./components/HeroSection";
import TokohSection from "./components/TokohSection";
import WayangBackground from "./components/WayangBackground";
import PartsSection from "./components/partsSection";
import AudioPlayer from "./components/AudioPlayer";
import CustomCursor from "./components/CustomCursor";
import Footer from "./components/Footer";
import Lenis from "lenis";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DalangPOVSection from "./components/DalangPOVSection";
import SejarahSection from "./components/SejarahSection";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.4,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
		});

		lenis.on("scroll", ScrollTrigger.update);

		const ticker = (time: number) => lenis.raf(time * 1000);
		gsap.ticker.add(ticker);
		gsap.ticker.lagSmoothing(0);

		const resync = () => {
			lenis.resize();
			ScrollTrigger.refresh(true);
		};

		document.fonts?.ready.then(() => {
			requestAnimationFrame(resync);
		});
		window.addEventListener("load", resync);
		const t1 = setTimeout(resync, 800);
		const t2 = setTimeout(resync, 2000);

		return () => {
			lenis.destroy();
			gsap.ticker.remove(ticker);
			window.removeEventListener("load", resync);
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, []);

	return (
		<div className="relative">
			<CustomCursor />
			<WayangBackground />
			<AudioPlayer />

			<main className="relative z-10 bg-transparent text-[#F5F5F5] font-sans">
				<HeroSection />
				<PartsSection />
				<SejarahSection />
				<TokohSection />
				<DalangPOVSection />
			</main>

			<Footer />
		</div>
	);
}
