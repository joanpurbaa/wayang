// src/components/TokohSection.tsx
"use client";
import { motion } from "framer-motion";
import { useRef, Suspense, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stage } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// ── Konfigurasi Data 4 Tokoh (ditambah partsDescriptions) ────────────────────
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
    partsDescriptions: {
      head: "Kepala Arjuna – pusat konsentrasi tempat ajaran suci Krisna bersemayam, mahkota ketajaman batin.",
      body: "Badan Arjuna – perisai kuningan yang menanggung beban dharma, dada seorang ksatria sejati.",
      lower: "Kain bawah – pijakan kokoh di atas tanah Kurusetra, akar setiap langkahnya.",
    },
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
    partsDescriptions: {
      head: "Kepala Semar – sederhana namun menyimpan kebijaksanaan dewa Ismaya, mata yang melihat segalanya.",
      body: "Perut buncit – lambang kelapangan hati menampung derita rakyat, pusat kasih tanpa syarat.",
      lower: "Sarung & kaki – akar kerendahan hati, pijakan yang tak pernah meninggalkan bumi.",
    },
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
    partsDescriptions: {
      head: "Kepala kera putih – cermin kesucian dan keteguhan iman, mata yang tak pernah lelah berjuang.",
      body: "Dada bidang – tempat bersemayamnya api kesetiaan, kekuatan yang datang dari hati.",
      lower: "Kaki & ekor – gerak cepat membela kebenaran, fondasi yang selalu siap melompat.",
    },
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
    partsDescriptions: {
      head: "Kepala Cepot – sumber tawa yang membongkar kepalsuan, kecerdasan di balik wajah jenaka.",
      body: "Baju badut – menyelubungi keberanian menyampaikan kritik tanpa takut, hati yang tulus.",
      lower: "Sarung & tongkat – tetap membumi meski lidahnya setajam pedang, akar kebijaksanaan.",
    },
  },
];

// ── Skeleton loader ────────────────────────────────────────────────────────
function ModelSkeleton({ r, g, b }: { r: number; g: number; b: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
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

// ── Model 3D Interaktif dengan Hover Highlight & Click ────────────────────
interface InteractiveModelProps {
  url: string;
  r: number;
  g: number;
  b: number;
  onPartClick?: (part: string | null) => void;
}

function InteractiveModel({ url, r, g, b, onPartClick }: InteractiveModelProps) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Object3D | null>(null);
  const bodyRef = useRef<THREE.Object3D | null>(null);
  const lowerRef = useRef<THREE.Object3D | null>(null);

  // Head look‑at
  const mouse = useRef(new THREE.Vector2(0, 0));
  const isHovering = useRef(false);
  const headRestQuat = useRef(new THREE.Quaternion());

  // Raycaster & zoom
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const zoomingRef = useRef(false);

  // Hover state & emissive reference
  const hoveredPart = useRef<string | null>(null);
  const originalEmissive = useRef<Map<THREE.Object3D, THREE.Color>>(new Map());

  // ── Inisialisasi mesh, clone material, dan identifikasi bagian ────────
  useEffect(() => {
    const cloned = scene.clone(true);

    // Clone semua material agar emissive dapat diubah per mesh tanpa berbagi
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          // Jika material berupa array, clone masing‑masing
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((mat) => mat.clone());
          } else {
            mesh.material = mesh.material.clone();
          }
          // Simpan emissive awal (default hitam) untuk referensi reset
          const mat = mesh.material as THREE.MeshStandardMaterial;
          originalEmissive.current.set(mesh, mat.emissive.clone());
        }
      }
    });

    // Cari mesh dengan nama tertentu (case‑insensitive & parsial)
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const name = child.name.toLowerCase();
        if (
          name.includes("head") ||
          name.includes("kepala") ||
          name.includes("topi") ||
          name.includes("rambut")
        ) {
          headRef.current = child;
        } else if (
          name.includes("body") ||
          name.includes("badan") ||
          name.includes("upper") ||
          name.includes("dada") ||
          name.includes("baju")
        ) {
          bodyRef.current = child;
        } else if (
          name.includes("lower") ||
          name.includes("bawah") ||
          name.includes("sarung") ||
          name.includes("kain")
        ) {
          lowerRef.current = child;
        }
      }
    });

    // Set roughness & metalness premium
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.roughness = Math.min(stdMat.roughness, 0.2);
            stdMat.metalness = Math.max(stdMat.metalness, 0.4);
            stdMat.emissive = stdMat.emissive || new THREE.Color(0x000000);
          });
        }
      }
    });

    if (groupRef.current) {
      groupRef.current.clear();
      groupRef.current.add(cloned);
    }

    if (headRef.current) {
      headRestQuat.current.copy(headRef.current.quaternion.clone());
    }

    // Log nama mesh untuk pengecekan
    console.log(
      `[TokohSection] Mesh names for ${url}:`,
      cloned.children.map((c) => c.name).filter(Boolean)
    );
  }, [scene, url]);

  // ── Auto‑rotate (hanya saat tidak zoom) ──────────────────────────────
  useFrame((_, delta) => {
    if (groupRef.current && !zoomingRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  // ── Head Look‑At (mengikuti kursor) ──────────────────────────────────
  useFrame(() => {
    if (!headRef.current || !isHovering.current) return;

    const headWorldPos = new THREE.Vector3();
    headRef.current.getWorldPosition(headWorldPos);

    const ndc = mouse.current.clone();
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(ndc, camera);
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
      camera.getWorldDirection(new THREE.Vector3()).negate(),
      headWorldPos
    );
    const targetWorld = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(plane, targetWorld)) return;

    const parent = headRef.current.parent!;
    const localTarget = parent.worldToLocal(targetWorld.clone());
    const localDir = localTarget.clone().normalize();
    const restQuat = headRestQuat.current;
    const restForward = new THREE.Vector3(0, 0, 1).applyQuaternion(restQuat);
    const restUp = new THREE.Vector3(0, 1, 0).applyQuaternion(restQuat);

    const horizontalDir = localDir.clone().projectOnPlane(restUp).normalize();
    const yaw = Math.atan2(
      horizontalDir.dot(new THREE.Vector3(1, 0, 0).applyQuaternion(restQuat)),
      horizontalDir.dot(restForward)
    );
    const pitch = Math.asin(THREE.MathUtils.clamp(localDir.dot(restUp), -1, 1));

    const maxYaw = 0.5;
    const maxPitch = 0.3;
    const clampedYaw = THREE.MathUtils.clamp(yaw, -maxYaw, maxYaw);
    const clampedPitch = THREE.MathUtils.clamp(pitch, -maxPitch, maxPitch);

    const yawQuat = new THREE.Quaternion().setFromAxisAngle(restUp, clampedYaw);
    const pitchAxis = new THREE.Vector3(1, 0, 0).applyQuaternion(restQuat);
    const pitchQuat = new THREE.Quaternion().setFromAxisAngle(pitchAxis, clampedPitch);

    headRef.current.quaternion.copy(
      restQuat.clone().multiply(yawQuat).multiply(pitchQuat)
    );
  });

  // ── Hover detection & highlight ──────────────────────────────────────
  const getIntersectedPart = useCallback(
    (ndc: THREE.Vector2): THREE.Object3D | null => {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(ndc, camera);
      const meshes: THREE.Object3D[] = [];
      if (headRef.current) meshes.push(headRef.current);
      if (bodyRef.current) meshes.push(bodyRef.current);
      if (lowerRef.current) meshes.push(lowerRef.current);
      const intersects = raycaster.intersectObjects(meshes, false);
      if (intersects.length > 0) return intersects[0].object;
      return null;
    },
    [camera]
  );

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.current.set(x, y);

      const hit = getIntersectedPart(new THREE.Vector2(x, y));
      let part: string | null = null;
      if (hit === headRef.current) part = "head";
      else if (hit === bodyRef.current) part = "body";
      else if (hit === lowerRef.current) part = "lower";

      // Reset emissive lama
      if (hoveredPart.current && hoveredPart.current !== part) {
        const prevMesh =
          hoveredPart.current === "head"
            ? headRef.current
            : hoveredPart.current === "body"
            ? bodyRef.current
            : lowerRef.current;
        if (prevMesh) {
          const mat = (prevMesh as THREE.Mesh).material as THREE.MeshStandardMaterial;
          const orig = originalEmissive.current.get(prevMesh);
          if (orig) mat.emissive.copy(orig);
          else mat.emissive.set(0x000000);
        }
      }

      // Set emissive baru
      if (part && part !== hoveredPart.current) {
        const mesh =
          part === "head"
            ? headRef.current
            : part === "body"
            ? bodyRef.current
            : lowerRef.current;
        if (mesh) {
          const mat = (mesh as THREE.Mesh).material as THREE.MeshStandardMaterial;
          // Warna emissive keemasan terang (menyesuaikan tone tokoh bisa dinamis, kita pakai emas universal)
          mat.emissive.set("#ffd966");
        }
        canvas.style.cursor = "pointer";
      } else if (!part) {
        canvas.style.cursor = "default";
      }

      hoveredPart.current = part;
    };

    const onPointerLeave = () => {
      isHovering.current = false;
      // Reset emissive jika ada
      if (hoveredPart.current) {
        const mesh =
          hoveredPart.current === "head"
            ? headRef.current
            : hoveredPart.current === "body"
            ? bodyRef.current
            : lowerRef.current;
        if (mesh) {
          const mat = (mesh as THREE.Mesh).material as THREE.MeshStandardMaterial;
          const orig = originalEmissive.current.get(mesh);
          if (orig) mat.emissive.copy(orig);
          else mat.emissive.set(0x000000);
        }
        hoveredPart.current = null;
        canvas.style.cursor = "default";
      }
    };

    const onPointerEnter = () => {
      isHovering.current = true;
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerenter", onPointerEnter);
    canvas.addEventListener("pointerleave", onPointerLeave);
    return () => {
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerenter", onPointerEnter);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [gl, getIntersectedPart]);

  // ── Click‑to‑Zoom + notifikasi ke parent ─────────────────────────────
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (zoomingRef.current) return;
      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const meshes: THREE.Object3D[] = [];
      if (headRef.current) meshes.push(headRef.current);
      if (bodyRef.current) meshes.push(bodyRef.current);
      if (lowerRef.current) meshes.push(lowerRef.current);

      const intersects = raycaster.intersectObjects(meshes, false);
      if (intersects.length === 0) {
        onPartClick?.(null);
        return;
      }

      const hit = intersects[0].object;
      let part: string | null = null;
      if (headRef.current && hit === headRef.current) part = "head";
      else if (bodyRef.current && hit === bodyRef.current) part = "body";
      else if (lowerRef.current && hit === lowerRef.current) part = "lower";

      if (!part) return;

      // Kirim ke parent untuk menampilkan deskripsi
      onPartClick?.(part);

      // Hitung bounding box mesh dan animasi kamera
      const box = new THREE.Box3().setFromObject(hit);
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const distance = maxDim * 3.5;
      const direction = camera.position.clone().sub(center).normalize();
      const newPos = center.clone().add(direction.multiplyScalar(distance));

      if (controlsRef.current) controlsRef.current.enabled = false;
      zoomingRef.current = true;

      gsap.to(controlsRef.current.target, {
        x: center.x,
        y: center.y,
        z: center.z,
        duration: 1.2,
        ease: "power3.inOut",
      });
      gsap.to(camera.position, {
        x: newPos.x,
        y: newPos.y,
        z: newPos.z,
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => {
          if (controlsRef.current) controlsRef.current.enabled = true;
          zoomingRef.current = false;
        },
      });
    },
    [camera, gl, onPartClick]
  );

  useEffect(() => {
    const canvas = gl.domElement;
    const onClick = (e: MouseEvent) => handleClick(e);
    canvas.addEventListener("click", onClick);
    return () => canvas.removeEventListener("click", onClick);
  }, [gl, handleClick]);

  return (
    <>
      <group ref={groupRef} />
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 2.5}
      />
    </>
  );
}

// ── Canvas Lazy ───────────────────────────────────────────────────────────
function LazyCanvas({
  glbPath,
  t,
  shouldLoad,
  onPartClick,
}: {
  glbPath: string;
  t: (typeof TOKOH)[0];
  shouldLoad: boolean;
  onPartClick: (part: string | null) => void;
}) {
  if (!shouldLoad) {
    return <ModelSkeleton r={t.r} g={t.g} b={t.b} />;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      frameloop="always"
      performance={{ min: 0.5 }}
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
          adjustCamera={false}
          shadows={false}
        >
          <InteractiveModel url={glbPath} r={t.r} g={t.g} b={t.b} onPartClick={onPartClick} />
        </Stage>
      </Suspense>
    </Canvas>
  );
}

// ── Hook Viewport ──────────────────────────────────────────────────────────
function useInViewOnce(
  rootMargin = "200px"
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
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return [ref, isVisible];
}

// ── Kartu Tokoh dengan state activePart ────────────────────────────────────
function TokohCard({ t, index }: { t: (typeof TOKOH)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const [observerRef, shouldLoad] = useInViewOnce("300px");
  const [activePart, setActivePart] = useState<string | null>(null);

  const handlePartClick = useCallback((part: string | null) => {
    setActivePart(part);
  }, []);

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

  // Ambil deskripsi bagian yang aktif
  const activeDescription = activePart ? t.partsDescriptions[activePart as keyof typeof t.partsDescriptions] : null;

  return (
    <div
      className="sticky w-full"
      style={{ top: `calc(60px + ${index * 32}px)` }}>
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
                {/* Kolom Kiri: Canvas 3D */}
                <div className="md:col-span-5 w-full">
                  <div className="relative rounded-[30px] overflow-hidden shadow-2xl border border-white/5 w-full min-h-[480px] md:min-h-[550px] flex items-center justify-center">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(ellipse at 50% 40%, rgba(${t.r},${t.g},${t.b},0.06) 0%, rgba(5,4,3,0.95) 70%)`,
                      }}
                    />
                    <div className="absolute inset-0 w-full h-full z-[1]">
                      <LazyCanvas
                        glbPath={t.glbPath}
                        t={t}
                        shouldLoad={shouldLoad}
                        onPartClick={handlePartClick}
                      />
                    </div>
                    <div
                      className="absolute inset-0 z-[2] pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(10,8,6,0.9) 0%, rgba(10,8,6,0.1) 40%, transparent 70%)",
                      }}
                    />
                    <div
                      className="absolute inset-0 rounded-[30px] z-[4] pointer-events-none"
                      style={{ border: `1px solid rgba(${t.r},${t.g},${t.b},0.15)` }}
                    />
                  </div>
                </div>

                {/* Kolom Kanan: Info + Sorotan Bagian */}
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

                  {/* Badges sifat */}
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

                  {/* Deskripsi tokoh (tetap tampil, bisa digeser jika ada sorotan) */}
                  <p
                    className="text-base md:text-lg text-justify font-light leading-relaxed tracking-wide"
                    style={{ color: "rgba(255,255,255,0.75)" }}>
                    {t.deskripsi}
                  </p>

                  {/* Sorotan Bagian (muncul saat klik) atau Filosofi default */}
                  {activePart && activeDescription ? (
                    <div
                      className="pl-7 pr-6 py-5 rounded-r-2xl relative overflow-hidden shadow-inner border-y border-r border-white/[0.02]"
                      style={{
                        borderLeft: `4px solid rgba(${t.r},${t.g},${t.b},0.6)`,
                        background: `rgba(${t.r},${t.g},${t.b},0.08)`,
                        transition: "all 0.4s ease",
                      }}>
                      <p
                        className="text-xs uppercase tracking-[0.3em] mb-2"
                        style={{ color: `rgba(${t.r},${t.g},${t.b},0.6)` }}>
                        Sorotan Bagian
                      </p>
                      <p
                        className="italic text-[20px] md:text-[23px] leading-relaxed relative z-[1]"
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          color: "rgba(240,225,190,0.95)",
                        }}>
                        “{activeDescription}”
                      </p>
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Preload ─────────────────────────────────────────────────────────────────
if (typeof window !== "undefined") {
  const ric =
    (window as any).requestIdleCallback ??
    ((cb: () => void) => setTimeout(cb, 200));
  ric(() => useGLTF.preload("/wayang.glb"));
}

// ── Section Utama ──────────────────────────────────────────────────────────
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
        <div className="flex flex-col gap-24 md:gap-36">
          {TOKOH.map((t, index) => (
            <TokohCard key={t.id} t={t} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}