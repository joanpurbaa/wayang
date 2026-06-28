// src/components/CustomCursor.tsx
// Cursor custom berbentuk lingkaran emas dengan dot tengah
// Tambahkan di App.tsx level paling atas

import { useEffect, useRef } from "react";

export default function CustomCursor() {
	const ringRef = useRef<HTMLDivElement>(null);
	const dotRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Cek touch device — skip custom cursor
		if (window.matchMedia("(hover: none)").matches) return;

		let raf: number;
		let mx = 0,
			my = 0; // posisi mouse sesungguhnya
		let rx = 0,
			ry = 0; // posisi ring (lagging)

		const onMove = (e: MouseEvent) => {
			mx = e.clientX;
			my = e.clientY;

			// Dot langsung ikut mouse (snappy)
			if (dotRef.current) {
				dotRef.current.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
			}
		};

		const animate = () => {
			// Ring lag mengikuti mouse dengan lerp
			rx += (mx - rx) * 0.12;
			ry += (my - ry) * 0.12;

			if (ringRef.current) {
				ringRef.current.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
			}
			raf = requestAnimationFrame(animate);
		};

		// Efek hover — ring membesar saat di atas elemen interaktif
		const onEnter = () => {
			if (ringRef.current) {
				ringRef.current.style.width = "48px";
				ringRef.current.style.height = "48px";
				ringRef.current.style.borderColor = "rgba(212,175,55,0.8)";
				ringRef.current.style.backgroundColor = "rgba(212,175,55,0.06)";
			}
		};
		const onLeave = () => {
			if (ringRef.current) {
				ringRef.current.style.width = "32px";
				ringRef.current.style.height = "32px";
				ringRef.current.style.borderColor = "rgba(212,175,55,0.4)";
				ringRef.current.style.backgroundColor = "transparent";
			}
		};

		document.body.style.cursor = "none";
		document.addEventListener("mousemove", onMove);

		// Attach hover ke semua elemen interaktif
		const interactables = document.querySelectorAll(
			'a, button, [role="button"], input, label',
		);
		interactables.forEach((el) => {
			el.addEventListener("mouseenter", onEnter);
			el.addEventListener("mouseleave", onLeave);
		});

		raf = requestAnimationFrame(animate);

		return () => {
			document.body.style.cursor = "";
			document.removeEventListener("mousemove", onMove);
			interactables.forEach((el) => {
				el.removeEventListener("mouseenter", onEnter);
				el.removeEventListener("mouseleave", onLeave);
			});
			cancelAnimationFrame(raf);
		};
	}, []);

	return (
		<>
			{/* Ring luar — lagging */}
			<div
				ref={ringRef}
				className="fixed top-0 left-0 pointer-events-none z-[9999]"
				style={{
					width: 32,
					height: 32,
					borderRadius: "50%",
					border: "1px solid rgba(212,175,55,0.4)",
					transition:
						"width 0.2s, height 0.2s, border-color 0.2s, background-color 0.2s",
					willChange: "transform",
				}}
			/>
			{/* Dot tengah — snappy */}
			<div
				ref={dotRef}
				className="fixed top-0 left-0 pointer-events-none z-[9999]"
				style={{
					width: 6,
					height: 6,
					borderRadius: "50%",
					backgroundColor: "#d4af37",
					willChange: "transform",
					boxShadow: "0 0 6px rgba(212,175,55,0.8)",
				}}
			/>
		</>
	);
}
