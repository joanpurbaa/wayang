// src/components/WayangBackground.tsx
// Model: public/wayang.glb (Wayang Golek Arjuna)

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── 3D Model & Material Customization ────────────────────────────────────────
function WayangModel() {
	const outerGroupRef = useRef<THREE.Group>(null!); // Kontrol GSAP Scroll (X, Y, Z, Rotasi Makro)
	const innerGroupRef = useRef<THREE.Group>(null!); // Kontrol Idle Auto-Rotate konstan

	const { scene } = useGLTF("/wayang-parts.glb");
	const initialized = useRef(false);
	const { size } = useThree();
	const isMobile = size.width < 768;

	const startScale = isMobile ? 1.8 : 2.5;

	// Optimasi Material Fisik (PBR) & Normalisasi Posisi
	useEffect(() => {
		if (!scene || !outerGroupRef.current || initialized.current) return;
		initialized.current = true;

		const cloned = scene.clone(true);
		const box = new THREE.Box3().setFromObject(cloned);
		const center = new THREE.Vector3();
		const boxSize = new THREE.Vector3();
		box.getCenter(center);
		box.getSize(boxSize);

		const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
		const targetSize = 3.8;
		const s = targetSize / maxDim;

		cloned.position.set(-center.x * s, -center.y * s, -center.z * s);
		cloned.scale.setScalar(s);

		// ── TRAVERSAL: Inject Efek Mengkilap & Mewah pada Model ──
		cloned.traverse((child) => {
			if ((child as THREE.Mesh).isMesh) {
				const mesh = child as THREE.Mesh;

				// Aktifkan penerimaan dan pembuatan bayangan detail tinggi
				mesh.castShadow = true;
				mesh.receiveShadow = true;

				// Modifikasi material bawaan atau override material agar tampak seperti emas bangsawan
				if (mesh.material) {
					const oldMat = mesh.material as THREE.MeshStandardMaterial;

					mesh.material = new THREE.MeshPhysicalMaterial({
						color: oldMat.color || new THREE.Color("#F5C453"),
						map: oldMat.map, // Tetap gunakan tekstur gambar bawaan jika ada
						normalMap: oldMat.normalMap, // Tetap gunakan detail ukiran pori-pori
						aoMap: oldMat.aoMap,

						// Pengaturan Kemewahan (PBR Logam Mulia)
						metalness: 0.95, // Terlihat seperti logam padat asli
						roughness: 0.12, // Sangat mulus dan reflektif terhadap lampu sekitar

						// Lapisan Pernis Kristal (Clearcoat) demi kilau ganda
						clearcoat: 1.0, // Lapisan kaca pelindung di atas emas
						clearcoatRoughness: 0.05, // Refleksi pantulan sangat tajam dan bersih

						envMapIntensity: 2.0, // Mendongkrak pantulan HDRI studio agar kontras
					});
				}
			}
		});

		innerGroupRef.current.clear();
		innerGroupRef.current.add(cloned);

		// INITIAL STATE: Posisi Close-Up Kepala/Setengah Badan di Landing Page
		outerGroupRef.current.position.set(
			isMobile ? 0 : 1.5,
			isMobile ? -1.5 : -2.2,
			0,
		);
		outerGroupRef.current.rotation.set(0, 0, 0);
		outerGroupRef.current.scale.setScalar(startScale);
	}, [scene, isMobile, startScale]);

	// Scroll-driven animation via GSAP
	useEffect(() => {
		const proxy = { p: 0 };
		const lerp = gsap.utils.interpolate;

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: "body",
				start: "top top",
				end: "bottom bottom",
				scrub: 1.5,
				onUpdate(self) {
					proxy.p = self.progress;
				},
			},
		});

		// Bagian 1: Landing Page ke Tengah Halaman (0 → 0.5)
		tl.to(proxy, {
			p: 0.5,
			onUpdate() {
				if (!outerGroupRef.current) return;
				const t = Math.min(proxy.p / 0.5, 1);
				const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

				outerGroupRef.current.position.x = lerp(
					isMobile ? 0 : 1.5,
					isMobile ? -0.2 : -0.8,
					e,
				);
				outerGroupRef.current.position.y = lerp(isMobile ? -1.5 : -2.2, -0.2, e);
				outerGroupRef.current.rotation.y = lerp(0, Math.PI, e); // Membelakangi kamera
				outerGroupRef.current.scale.setScalar(
					lerp(startScale, isMobile ? 0.8 : 1.2, e),
				);
			},
		});

		// Bagian 2: Tengah Halaman ke Akhir Halaman (0.5 → 1)
		tl.to(proxy, {
			p: 1,
			onUpdate() {
				if (!outerGroupRef.current) return;
				const t = Math.max(0, Math.min((proxy.p - 0.5) / 0.5, 1));
				const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

				outerGroupRef.current.position.x = lerp(
					isMobile ? -0.2 : -0.8,
					isMobile ? -0.8 : -1.6,
					e,
				);
				outerGroupRef.current.position.y = lerp(-0.2, isMobile ? -1.5 : -2.2, e);
				outerGroupRef.current.rotation.y = lerp(Math.PI, Math.PI * 2, e); // Kembali menghadap depan
				outerGroupRef.current.scale.setScalar(
					lerp(isMobile ? 0.8 : 1.2, startScale, e),
				);
			},
		});

		return () => {
			tl.kill();
			ScrollTrigger.getAll().forEach((st) => st.kill());
		};
	}, [isMobile, startScale]);

	// Auto-rotate konstan saat diam
	useFrame((_, delta) => {
		if (innerGroupRef.current) {
			innerGroupRef.current.rotation.y += delta * 0.12;
		}
	});

	return (
		<group ref={outerGroupRef}>
			<group ref={innerGroupRef} />
		</group>
	);
}

// ─── Loader ──────────────────────────────────────────────────────────────────
function Loader() {
	const ref = useRef<THREE.Mesh>(null!);
	useFrame((_, dt) => {
		if (ref.current) ref.current.rotation.y += dt * 1.2;
	});
	return (
		<mesh ref={ref}>
			<octahedronGeometry args={[0.4, 1]} />
			<meshStandardMaterial color="#d4a017" wireframe />
		</mesh>
	);
}

// ─── Canvas Utama dengan 3-Point Lighting Premium ────────────────────────────
export default function WayangBackground() {
	return (
		<div
			aria-hidden
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 0,
				pointerEvents: "none",
			}}>
			<Canvas
				camera={{ position: [0, 0, 6], fov: 48 }}
				gl={{
					antialias: true,
					alpha: true,
					powerPreference: "high-performance",
				}}
				dpr={[1, 1.5]}
				shadows // Aktifkan sistem rendering bayangan realistis
			>
				{/* 1. KEY LIGHT: Cahaya hangat yang sangat kuat menyorot tekstur dari sudut depan atas */}
				<directionalLight
					position={[5, 8, 5]}
					intensity={3.5}
					color="#fff5db"
					castShadow
					shadow-mapSize={[2048, 2048]} // Membuat tekstur bayangan ukiran super tajam
					shadow-bias={-0.0001}
				/>

				{/* 2. RIM LIGHT (BACKLIGHT): Efek pendaran neon emas di garis tepi tubuh wayang */}
				<directionalLight position={[-5, 3, -5]} intensity={4.5} color="#ffbd3d" />

				{/* 3. FILL LIGHT: Mengisi area bayangan gelap di bawah dagu/lekukan agar tidak flat */}
				<directionalLight
					position={[-4, -2, 3]}
					intensity={1.0}
					color="#a2b3cb" // Tone kebiruan sedikit kontras agar sinematik
				/>

				{/* 4. ACCENT GLINT LIGHT: Lampu sorot fokus kecil tepat di depan objek */}
				<pointLight
					position={[0, 0, 4]}
					intensity={2.0}
					color="#ffffff"
					decay={1.5}
				/>

				{/* 5. ENVIRONMENT STUDIO MAP: Wajib ada untuk memunculkan refleksi material emas 'clearcoat' */}
				<Environment preset="studio" />

				<Suspense fallback={<Loader />}>
					<WayangModel />
				</Suspense>
			</Canvas>
		</div>
	);
}

useGLTF.preload("/wayang-parts.glb");
