import { Suspense, useLayoutEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function WayangModel() {
	const outerGroupRef = useRef<THREE.Group>(null!);
	const innerGroupRef = useRef<THREE.Group>(null!);
	const headRef = useRef<THREE.Object3D | null>(null);
	const upperRef = useRef<THREE.Object3D | null>(null);
	const lowerRef = useRef<THREE.Object3D | null>(null);
	const initialPositions = useRef({ headY: 0, lowerY: 0 });

	const { scene } = useGLTF("/wayang-parts-optimized.glb");
	const initialized = useRef(false);
	const { size } = useThree();
	const isMobile = size.width < 768;
	const startScale = isMobile ? 1.8 : 2.5;

	useLayoutEffect(() => {
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

		cloned.traverse((child) => {
			if ((child as THREE.Mesh).isMesh) {
				const mesh = child as THREE.Mesh;
				mesh.castShadow = true;
				mesh.receiveShadow = true;

				if (mesh.material) {
					const oldMat = mesh.material as THREE.MeshStandardMaterial;
					mesh.material = new THREE.MeshPhysicalMaterial({
						color: oldMat.color || new THREE.Color("#F5C453"),
						map: oldMat.map,
						normalMap: oldMat.normalMap,
						aoMap: oldMat.aoMap,
						metalness: 0.95,
						roughness: 0.12,
						clearcoat: 1.0,
						clearcoatRoughness: 0.05,
						envMapIntensity: 2.0,
					});
				}
			}
		});

		const head = cloned.getObjectByName("Head")!;
		const upper = cloned.getObjectByName("Upper")!;
		const lower = cloned.getObjectByName("Lower")!;

		initialPositions.current.headY = head.position.y;
		initialPositions.current.lowerY = lower.position.y;

		headRef.current = head;
		upperRef.current = upper;
		lowerRef.current = lower;

		innerGroupRef.current.clear();
		innerGroupRef.current.add(cloned);

		outerGroupRef.current.position.set(
			isMobile ? 0 : 1.5,
			isMobile ? -1.5 : -2.2,
			0,
		);
		outerGroupRef.current.rotation.set(0, 0, 0);
		outerGroupRef.current.scale.setScalar(startScale);
	}, [scene, isMobile, startScale]);

	useLayoutEffect(() => {
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
				outerGroupRef.current.rotation.y = lerp(0, Math.PI, e);
				outerGroupRef.current.scale.setScalar(
					lerp(startScale, isMobile ? 0.8 : 1.2, e),
				);
			},
		});

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
				outerGroupRef.current.rotation.y = lerp(Math.PI, Math.PI * 2, e);
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

	useLayoutEffect(() => {
		if (
			!headRef.current ||
			!upperRef.current ||
			!lowerRef.current ||
			!initialPositions.current.headY
		)
			return;

		const headBaseY = initialPositions.current.headY;
		const lowerBaseY = initialPositions.current.lowerY;

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: "#parts",
				start: "top center",
				end: "bottom top+=150%",
				scrub: 1.5,
			},
		});

		tl.to(
			headRef.current.position,
			{ y: headBaseY + 110, duration: 0.4, ease: "none" },
			0,
		);
		tl.to(
			lowerRef.current.position,
			{ y: lowerBaseY - 110, duration: 0.4, ease: "none" },
			0,
		);

		tl.to(
			headRef.current.position,
			{ y: headBaseY, duration: 0.6, ease: "none" },
			0.4,
		);
		tl.to(
			lowerRef.current.position,
			{ y: lowerBaseY, duration: 0.6, ease: "none" },
			0.4,
		);

		const st = tl.scrollTrigger;

		return () => {
			tl.kill();
			st?.kill();
		};
	}, []);

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

export default function WayangBackground() {
	const wrapperRef = useRef<HTMLDivElement>(null!);

	useLayoutEffect(() => {
		const target = document.getElementById("parts");
		if (!target) return;

		let ticking = false;

		const updateZIndex = () => {
			ticking = false;
			if (!wrapperRef.current) return;
			const rectTop = target.getBoundingClientRect().top;
			wrapperRef.current.style.zIndex = rectTop <= 0 ? "5" : "20";
		};

		const onScroll = () => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(updateZIndex);
			}
		};

		updateZIndex();

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<>
			<div
				ref={wrapperRef}
				aria-hidden
				style={{
					position: "fixed",
					inset: 0,
					zIndex: 20,
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
					shadows>
					<directionalLight
						position={[5, 8, 5]}
						intensity={3.5}
						color="#fff5db"
						castShadow
						shadow-mapSize={[2048, 2048]}
						shadow-bias={-0.0001}
					/>
					<directionalLight position={[-5, 3, -5]} intensity={4.5} color="#ffbd3d" />
					<directionalLight position={[-4, -2, 3]} intensity={1.0} color="#a2b3cb" />
					<pointLight
						position={[0, 0, 4]}
						intensity={2.0}
						color="#ffffff"
						decay={1.5}
					/>
					<Environment preset="studio" />

					<Suspense fallback={<Loader />}>
						<WayangModel />
					</Suspense>
				</Canvas>
			</div>

			<div
				style={{
					position: "fixed",
					inset: 0,
					zIndex: 1,
					pointerEvents: "none",
					background:
						"radial-gradient(ellipse at center, transparent 50%, rgba(5,5,5,0.5) 85%, #050505 100%)",
				}}
			/>
		</>
	);
}

useGLTF.preload("/wayang-parts-optimized.glb");
