"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, Suspense, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Stage } from "@react-three/drei";
import * as THREE from "three";
import { Sword, Gem, Star, Circle, Hexagon } from "lucide-react";

const RUNE_ICONS = [Sword, Gem, Star, Circle, Hexagon];

const TOKOH = [
  {
    id: "arjuna",
    nama: "Arjuna",
    gelar: "Sang Panah Dewa",
    glbPath: "/wayang-parts-optimized.glb",
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
      head:
        "Kepala Arjuna – pusat konsentrasi tempat ajaran suci Krisna bersemayam, mahkota ketajaman batin.",
      body:
        "Badan Arjuna – perisai kuningan yang menanggung beban dharma, dada seorang ksatria sejati.",
      lower:
        "Kain bawah – pijakan kokoh di atas tanah Kurusetra, akar setiap langkahnya.",
    },
  },
  {
    id: "semar",
    nama: "Semar",
    gelar: "Sang Pamomong Agung",
    glbPath: "/semar-optimized.glb",
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
      head:
        "Kepala Semar – sederhana namun menyimpan kebijaksanaan dewa Ismaya, mata yang melihat segalanya.",
      body:
        "Perut buncit – lambang kelapangan hati menampung derita rakyat, pusat kasih tanpa syarat.",
      lower:
        "Sarung & kaki – akar kerendahan hati, pijakan yang tak pernah meninggalkan bumi.",
    },
  },
  {
    id: "hanoman",
    nama: "Hanoman",
    gelar: "Sang Ksatria Putih",
    glbPath: "/hanoman-optimized.glb",
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
      head:
        "Kepala kera putih – cermin kesucian dan keteguhan iman, mata yang tak pernah lelah berjuang.",
      body:
        "Dada bidang – tempat bersemayamnya api kesetiaan, kekuatan yang datang dari hati.",
      lower:
        "Kaki & ekor – gerak cepat membela kebenaran, fondasi yang selalu siap melompat.",
    },
  },
  {
    id: "cepot",
    nama: "Cepot",
    gelar: "Sang Badut Bijak",
    glbPath: "/cepot-optimized.glb",
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
      head:
        "Kepala Cepot – sumber tawa yang membongkar kepalsuan, kecerdasan di balik wajah jenaka.",
      body:
        "Baju badut – menyelubungi keberanian menyampaikan kritik tanpa takut, hati yang tulus.",
      lower:
        "Sarung & tongkat – tetap membumi meski lidahnya setajam pedang, akar kebijaksanaan.",
    },
  },
];

// ─── Interactive Model (diam, indikator klik per bagian, klik area) ───
function InteractiveModel({ url, onPartClick, onLoaded }: {
  url: string;
  r: number;
  g: number;
  b: number;
  onPartClick?: (part: string | null) => void;
  onLoaded?: () => void;
}) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Object3D | null>(null);
  const bodyRef = useRef<THREE.Object3D | null>(null);
  const lowerRef = useRef<THREE.Object3D | null>(null);

  // Indikator titik lampu untuk setiap bagian
  const headDotRef = useRef<THREE.Mesh>(null);
  const bodyDotRef = useRef<THREE.Mesh>(null);
  const lowerDotRef = useRef<THREE.Mesh>(null);

  const { camera, gl } = useThree();

  // Normalisasi & setup
  useEffect(() => {
    const cloned = scene.clone(true);

    // Clone semua material
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((m) => m.clone());
          } else {
            mesh.material = mesh.material.clone();
          }
        }
      }
    });

    // Normalisasi ukuran (8 unit tinggi)
    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    const targetHeight = 8;
    const scale = targetHeight / size.y;
    cloned.scale.setScalar(scale);
    cloned.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    // Identifikasi bagian-bagian
    const headKeywords = ["head", "kepala", "topi", "rambut"];
    const bodyKeywords = ["body", "badan", "upper", "dada", "baju", "blockhitam", "talipinggang"];
    const lowerKeywords = ["lower", "bawah", "sarung", "kain"];

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const name = child.name.toLowerCase();
        if (!headRef.current && headKeywords.some(k => name.includes(k))) {
          headRef.current = child;
        } else if (!bodyRef.current && bodyKeywords.some(k => name.includes(k))) {
          bodyRef.current = child;
        } else if (!lowerRef.current && lowerKeywords.some(k => name.includes(k))) {
          lowerRef.current = child;
        }
      }
    });

    // Fallback body
    if (!bodyRef.current) {
      cloned.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && child.name.toLowerCase().includes("block")) {
          bodyRef.current = child;
        }
      });
    }

    // Material premium
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.roughness = Math.min(mat.roughness, 0.2);
          mat.metalness = Math.max(mat.metalness, 0.4);
          mat.emissive = new THREE.Color(0x000000);
        }
      }
    });

    if (!groupRef.current) return;
    groupRef.current.clear();
    groupRef.current.add(cloned);

    // Buat dot indikator (posisi awal nol, akan diupdate tiap frame)
    const createDot = () => {
      const dotGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({
        color: "#ffd966",
        transparent: true,
        opacity: 0.9,
        depthTest: false,
        depthWrite: false,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.renderOrder = 999;
      return dot;
    };

    if (headRef.current) {
      headDotRef.current = createDot();
      groupRef.current.add(headDotRef.current);
    }
    if (bodyRef.current) {
      bodyDotRef.current = createDot();
      groupRef.current.add(bodyDotRef.current);
    }
    if (lowerRef.current) {
      lowerDotRef.current = createDot();
      groupRef.current.add(lowerDotRef.current);
    }

    onLoaded?.();
  }, [scene, url, onLoaded]);

  // Update posisi dot + animasi pulse
  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Fungsi update posisi dot berdasarkan posisi world bagian
    const updateDot = (
      dotRef: React.RefObject<THREE.Mesh | null>,
      partRef: React.RefObject<THREE.Object3D | null>,
      offsetY: number
    ) => {
      if (dotRef.current && partRef.current) {
        const worldPos = new THREE.Vector3();
        partRef.current.getWorldPosition(worldPos);
        worldPos.z += 1.2; // offset ke depan
        worldPos.y += offsetY;
        // Konversi ke local space group agar dot tetap di posisi relatif yang benar
        const localPos = groupRef.current!.worldToLocal(worldPos.clone());
        dotRef.current.position.copy(localPos);
      }
    };

    updateDot(headDotRef, headRef, 0.5);
    updateDot(bodyDotRef, bodyRef, 0.2);
    updateDot(lowerDotRef, lowerRef, -0.2);

    // Animasi pulse
    const t = clock.getElapsedTime();
    const pulse = (Math.sin(t * 5) + 1) / 2;
    const scale = 0.7 + pulse * 0.5;
    const opacity = 0.5 + pulse * 0.5;

    [headDotRef, bodyDotRef, lowerDotRef].forEach(dotRef => {
      if (dotRef.current) {
        dotRef.current.scale.setScalar(scale);
        (dotRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
      }
    });
  });

  // Raycaster & klik
  const getIntersectedPart = useCallback(
    (ndc: THREE.Vector2): string | null => {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(ndc, camera);
      const meshes = [headRef.current, bodyRef.current, lowerRef.current].filter(Boolean) as THREE.Object3D[];
      const intersects = raycaster.intersectObjects(meshes, false);
      if (intersects.length === 0) return null;
      const hit = intersects[0].object;
      if (hit === headRef.current) return "head";
      if (hit === bodyRef.current) return "body";
      if (hit === lowerRef.current) return "lower";
      return null;
    },
    [camera],
  );

  const handleClick = useCallback(
    (event: MouseEvent) => {
      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      const part = getIntersectedPart(new THREE.Vector2(x, y));
      onPartClick?.(part);
    },
    [gl, getIntersectedPart, onPartClick],
  );

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [gl, handleClick]);

  return <group ref={groupRef} />;
}

// ─── Loader ────────────────────────────────────────────────────────
function ModelSkeleton({ r, g, b }: { r: number; g: number; b: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-[6]">
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

// ─── Lazy Canvas ───────────────────────────────────────────────────
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
  const [modelReady, setModelReady] = useState(false);

  if (!shouldLoad) return <ModelSkeleton r={t.r} g={t.g} b={t.b} />;

  return (
    <>
      {!modelReady && <ModelSkeleton r={t.r} g={t.g} b={t.b} />}
      <Canvas
        camera={{ position: [0, 0, 12], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        frameloop="always"
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[15, 20, 10]} angle={0.3} penumbra={1} intensity={2.5} />
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
            <InteractiveModel
              url={glbPath}
              r={t.r}
              g={t.g}
              b={t.b}
              onPartClick={onPartClick}
              onLoaded={() => setModelReady(true)}
            />
          </Stage>
        </Suspense>
      </Canvas>
    </>
  );
}

// ─── Intersection Observer ─────────────────────────────────────────
function useInViewOnce(rootMargin = "200px"): [React.RefObject<HTMLDivElement | null>, boolean] {
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
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return [ref, isVisible];
}

// ─── Card Utama ────────────────────────────────────────────────────
function TokohCard({ t, index }: { t: (typeof TOKOH)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const [observerRef, shouldLoad] = useInViewOnce("300px");
  const [activePart, setActivePart] = useState<string | null>(null);

  const handlePartClick = useCallback((part: string | null) => {
    setActivePart(part);
  }, []);

  // Otomatis kembali ke deskripsi utama setelah 5 detik
  useEffect(() => {
    if (activePart) {
      const timer = setTimeout(() => setActivePart(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [activePart]);

  const partDescription = activePart ? t.partsDescriptions[activePart as keyof typeof t.partsDescriptions] : null;

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
    <div className="sticky w-full" style={{ top: `calc(60px + ${index * 32}px)` }}>
      <div ref={observerRef}>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-[40px] overflow-hidden cursor-default group"
            style={{
              transition: "transform 0.5s cubic-bezier(0.23,1,0.32,1)",
              willChange: "transform",
            }}
          >
            {/* Glassmorphism base */}
            <div
              className="absolute inset-0 rounded-[40px]"
              style={{
                background: `linear-gradient(145deg,
                  rgba(24,20,16,0.85) 0%,
                  rgba(10,9,7,0.93) 50%,
                  rgba(18,15,12,0.88) 100%)`,
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
              }}
            />
            {/* Border */}
            <div
              ref={borderRef}
              className="absolute inset-0 rounded-[40px] pointer-events-none"
              style={{
                padding: "2px",
                background: `linear-gradient(145deg,
                  rgba(${t.r + 60},${t.g + 50},${t.b + 10},0.55) 0%,
                  rgba(${t.r},${t.g},${t.b},0.12) 35%,
                  rgba(60,45,15,0.06) 65%,
                  rgba(${t.r + 50},${t.g + 40},${t.b},0.38) 100%)`,
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                zIndex: 10,
                transition: "background 0.15s ease",
              }}
            />
            {/* Top glow */}
            <div
              className="absolute top-0 left-0 right-0 pointer-events-none rounded-t-[40px]"
              style={{
                height: "1.5px",
                background: `linear-gradient(90deg, transparent 15%, rgba(${t.r},${t.g},${t.b},0.6) 50%, transparent 85%)`,
                boxShadow: `0 0 35px 3px rgba(${t.r},${t.g},${t.b},0.35)`,
                zIndex: 11,
              }}
            />

            {/* Konten */}
            <div className="relative z-[5] p-10 md:p-16">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
                {/* Kolom Kiri: Canvas 3D */}
                <div className="md:col-span-5 w-full flex flex-col gap-4">
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

                {/* Kolom Kanan: Teks (deskripsi utama / deskripsi bagian) */}
                <div className="md:col-span-7 flex flex-col gap-0 w-full text-left relative">
                  {/* Ornamen */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      top: "-154px",
                      right: "-154px",
                      width: "280px",
                      height: "280px",
                      borderRadius: "50%",
                      border: `1px solid rgba(${t.r},${t.g},${t.b},0.08)`,
                      boxShadow: `0 0 0 24px rgba(${t.r},${t.g},${t.b},0.04), 0 0 0 48px rgba(${t.r},${t.g},${t.b},0.02)`,
                    }}
                  />
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      top: "-120px",
                      right: "-120px",
                      width: "220px",
                      height: "220px",
                      borderRadius: "50%",
                      border: `1px solid rgba(${t.r},${t.g},${t.b},0.13)`,
                    }}
                  />
                  <h3
                    className="relative z-10"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "clamp(3rem, 5vw, 4.5rem)",
                      fontWeight: 300,
                      lineHeight: 0.9,
                      letterSpacing: "-0.02em",
                      color: t.warna,
                      textShadow: `0 2px 30px rgba(${t.r},${t.g},${t.b},0.5), 0 0 60px rgba(${t.r},${t.g},${t.b},0.2)`,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {t.nama}
                  </h3>
                  <p
                    className="mb-8 relative z-10"
                    style={{
                      fontFamily: "monospace, 'Courier New'",
                      fontSize: "20px",
                      letterSpacing: "0.4em",
                      textTransform: "uppercase",
                      color: `rgba(${t.r},${t.g},${t.b},0.45)`,
                    }}
                  >
                    {t.gelar}
                  </p>
                  {/* Rune */}
                  <div className="flex items-center gap-6 mb-10 relative z-10">
                    {t.sifat.map((s, i) => (
                      <div key={s} className="flex flex-col items-center gap-2">
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            border: `1px solid rgba(${t.r},${t.g},${t.b},0.25)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: `rgba(${t.r},${t.g},${t.b},0.75)`,
                            background: `rgba(${t.r},${t.g},${t.b},0.05)`,
                          }}
                        >
                          {(() => {
                            const Icon = RUNE_ICONS[i % RUNE_ICONS.length];
                            return <Icon size={16} strokeWidth={1.2} />;
                          })()}
                        </div>
                        <span
                          style={{
                            fontFamily: "monospace, 'Courier New'",
                            fontSize: "13px",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: `rgba(${t.r},${t.g},${t.b},0.45)`,
                          }}
                        >
                          {s}
                        </span>
                      </div>
                    ))}
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background: `linear-gradient(90deg, rgba(${t.r},${t.g},${t.b},0.25), transparent)`,
                      }}
                    />
                  </div>

                  {/* Area konten yang bertukar */}
                  <AnimatePresence mode="wait">
                    {partDescription ? (
                      <motion.div
                        key="part-desc"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10"
                        style={{
                          background: `rgba(${t.r},${t.g},${t.b},0.05)`,
                          border: `1px solid rgba(${t.r},${t.g},${t.b},0.15)`,
                          borderRadius: "12px",
                          padding: "1.5rem 2rem",
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: "1.4rem",
                          fontStyle: "italic",
                          lineHeight: 1.7,
                          color: `rgba(${t.r},${t.g},${t.b},0.9)`,
                          minHeight: "160px",
                        }}
                      >
                        {partDescription}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="main-desc"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Deskripsi */}
                        <div
                          className="relative mb-7 z-10"
                          style={{
                            background: `rgba(${t.r},${t.g},${t.b},0.03)`,
                            border: `1px solid rgba(${t.r},${t.g},${t.b},0.09)`,
                            borderRadius: "6px",
                            padding: "1.25rem 1.5rem",
                          }}
                        >
                          <span
                            className="absolute left-1/2 -translate-x-1/2"
                            style={{
                              top: "-9px",
                              background: "rgb(14,12,10)",
                              padding: "0 10px",
                              fontSize: "10px",
                              color: `rgba(${t.r},${t.g},${t.b},0.4)`,
                              lineHeight: 1,
                              display: "block",
                            }}
                          >
                            ✦
                          </span>
                          <p
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              fontSize: "1.5rem",
                              fontStyle: "italic",
                              lineHeight: 1.8,
                              color: "rgba(255,255,255,0.5)",
                            }}
                          >
                            {t.deskripsi}
                          </p>
                        </div>
                        {/* Filosofi */}
                        <p
                          className="relative z-10"
                          style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: "clamp(1.2rem, 2vw, 1.45rem)",
                            fontStyle: "italic",
                            fontWeight: 300,
                            lineHeight: 1.65,
                            color: "rgba(220, 205, 170, 0.88)",
                          }}
                        >
                          "{t.filosofi}"
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Preload semua model ───────────────────────────────────────────
if (typeof window !== "undefined") {
  const ric = (window as any).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
  ric(() => {
    useGLTF.preload("/wayang-parts-optimized.glb");
    useGLTF.preload("/semar-optimized.glb");
    useGLTF.preload("/hanoman-optimized.glb");
    useGLTF.preload("/cepot-optimized.glb");
  });
}

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