// src/components/Footer.tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Pola Kawung ─── */
function KawungPattern() {
    return (
        <svg
            className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern id="kawung" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
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

/* ─── Kelir Border ─── */
function KelirBorder() {
    return (
        <div className="w-full h-5 overflow-hidden">
            <svg viewBox="0 0 1440 20" fill="none" className="w-full h-full" preserveAspectRatio="none">
                <path
                    d="M0 10 Q30 0 60 10 T120 10 T180 10 T240 10 T300 10 T360 10 T420 10 T480 10 T540 10 T600 10 T660 10 T720 10 T780 10 T840 10 T900 10 T960 10 T1020 10 T1080 10 T1140 10 T1200 10 T1260 10 T1320 10 T1380 10 T1440 10 V20 H0Z"
                    fill="rgba(212,175,55,0.06)"
                />
                <path
                    d="M0 10 Q30 0 60 10 T120 10 T180 10 T240 10 T300 10 T360 10 T420 10 T480 10 T540 10 T600 10 T660 10 T720 10 T780 10 T840 10 T900 10 T960 10 T1020 10 T1080 10 T1140 10 T1200 10 T1260 10 T1320 10 T1380 10 T1440 10"
                    stroke="rgba(212,175,55,0.2)"
                    strokeWidth="1"
                    fill="none"
                />
                {Array.from({ length: 25 }).map((_, i) => (
                    <circle key={i} cx={i * 60 + 30} cy="10" r="1.5" fill="rgba(212,175,55,0.15)" />
                ))}
            </svg>
        </div>
    );
}

/* ─── Siluet Wayang ─── */
function WayangSilhouette({ className = "", flip = false }: { className?: string; flip?: boolean }) {
    return (
        <svg viewBox="0 0 60 120" fill="currentColor" className={`pointer-events-none ${flip ? "scale-x-[-1]" : ""} ${className}`}>
            <path d="M30 0 L35 8 L40 4 L37 12 L42 10 L38 16 L30 14 L22 16 L18 10 L23 12 L20 4 L25 8Z" opacity="0.3" />
            <ellipse cx="30" cy="22" rx="10" ry="12" opacity="0.25" />
            <path d="M20 34 Q30 30 40 34 L44 70 Q30 74 16 70Z" opacity="0.2" />
            <path d="M20 40 L4 55 L2 52 L16 38" opacity="0.15" />
            <path d="M40 40 L56 55 L58 52 L44 38" opacity="0.15" />
            <path d="M16 70 Q30 68 44 70 L46 110 Q30 114 14 110Z" opacity="0.18" />
            <path d="M22 110 L18 120 L24 120 L28 110" opacity="0.12" />
            <path d="M32 110 L36 120 L42 120 L38 110" opacity="0.12" />
        </svg>
    );
}

/* ─── Ikon panah atas ─── */
function IconArrowUp() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
    );
}

/* ═══════════════════════════════════════════ */
export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".footer-col", {
                y: 30,
                opacity: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: { trigger: footerRef.current, start: "top 90%", once: true },
            });
            gsap.from(".wayang-left", {
                x: -40, opacity: 0, duration: 1, ease: "power2.out",
                scrollTrigger: { trigger: footerRef.current, start: "top 85%", once: true },
            });
            gsap.from(".wayang-right", {
                x: 40, opacity: 0, duration: 1, ease: "power2.out",
                scrollTrigger: { trigger: footerRef.current, start: "top 85%", once: true },
            });
            gsap.from(".footer-divider", {
                scaleX: 0, duration: 0.8, ease: "power2.inOut",
                scrollTrigger: { trigger: ".footer-divider", start: "top 95%", once: true },
            });
        }, footerRef);
        return () => ctx.revert();
    }, []);

    const navLinks = [
        { label: "Beranda", href: "#" },
        { label: "Bagian Wayang", href: "#parts" },
        { label: "Sejarah", href: "#sejarah" },
        { label: "Tokoh", href: "#tokoh" },
        { label: "Dalang POV", href: "#dalang" },
    ];

    const budayaFakta = [
        { label: "UNESCO 2003", desc: "Wayang Puppet Theatre diakui sebagai Warisan Budaya Tak Benda" },
        { label: "Abad ke-10", desc: "Bukti tertua wayang ditemukan di relief Candi Prambanan" },
        { label: "Gamelan Sekaten", desc: "Musik pengiring yang dimainkan saat perayaan Maulid Nabi" },
    ];

    return (
        <footer ref={footerRef} className="relative bg-[#050505] overflow-hidden">
            <KawungPattern />

            <WayangSilhouette className="wayang-left absolute -left-3 bottom-6 w-14 text-amber-400/10 lg:w-20" />
            <WayangSilhouette className="wayang-right absolute -right-3 bottom-6 w-14 text-amber-400/10 lg:w-20" flip />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[radial-gradient(ellipse,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

            <KelirBorder />

            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-14 pb-6">

                {/* Grid 3 kolom */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">

                    {/* Brand */}
                    <div className="footer-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/20 flex items-center justify-center">
                                <span className="text-amber-400 font-serif text-base font-bold">W</span>
                            </div>
                            <div>
                                <h3 className="text-[#F5F5F5] font-serif text-lg tracking-tight">Wayang Golek</h3>
                                <p className="text-white/20 text-[9px] tracking-[0.25em] uppercase">Nuansa Jawa</p>
                            </div>
                        </div>
                        <p className="text-white/35 text-sm leading-relaxed mb-4">
                            Menjelajahi keagungan seni wayang golek — dari ukiran kayu hingga jiwa pertunjukan yang menghidupkan filsafat Jawa.
                        </p>
                        <div className="inline-block px-3 py-1 rounded-full border border-amber-500/10 bg-amber-500/5">
                            <span className="text-amber-500/40 text-xs font-mono tracking-wider">꧋ ꦮꦪꦁ ꦒꦺꦴꦭꦺꦏ꧀ ꧋</span>
                        </div>
                    </div>

                    {/* Navigasi */}
                    <div className="footer-col">
                        <h4 className="text-[10px] tracking-[0.3em] uppercase text-amber-500/50 font-medium mb-4">Navigasi</h4>
                        <ul className="space-y-2.5">
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="group flex items-center gap-2 text-white/35 text-sm hover:text-amber-400 transition-colors duration-300"
                                    >
                                        <span className="block w-0 group-hover:w-3 h-px bg-amber-400/50 transition-all duration-300" />
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Fakta Budaya */}
                    <div className="footer-col">
                        <h4 className="text-[10px] tracking-[0.3em] uppercase text-amber-500/50 font-medium mb-4">Tahu Budaya</h4>
                        <div className="space-y-3">
                            {budayaFakta.map((fakta) => (
                                <div key={fakta.label} className="flex gap-2.5">
                                    <span className="mt-1.5 block w-1.5 h-1.5 rounded-full bg-amber-500/30 shrink-0" />
                                    <div>
                                        <p className="text-white/45 text-xs font-medium">{fakta.label}</p>
                                        <p className="text-white/20 text-[11px] leading-relaxed">{fakta.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Garis pemisah */}
                <div className="footer-divider relative h-px bg-white/[0.06] mb-6 origin-left">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#050505] px-4">
                        <span className="block w-6 h-px bg-amber-500/20" />
                        <span className="text-amber-500/25 text-[10px]">◆</span>
                        <span className="block w-6 h-px bg-amber-500/20" />
                    </div>
                </div>

                {/* Kutipan */}
                <div className="text-center mb-6">
                    <p className="font-serif text-lg lg:text-xl text-amber-400/40 italic leading-relaxed">
                        "Wayang iku dudu wewayangan, nanging kanyataan."
                    </p>
                    <p className="text-white/15 text-[10px] tracking-widest uppercase mt-1.5">
                        Wayang bukan sekadar bayangan, melainkan kenyataan
                    </p>
                </div>

                {/* Bottom bar */}
                <div className="flex items-center justify-between">
                    <p className="text-white/15 text-[10px] tracking-wide">
                        © {new Date().getFullYear()} Wayang Golek Nuansa Jawa
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-amber-500/25 text-[9px] tracking-wider font-medium border border-amber-500/10 px-2.5 py-1 rounded-full">
                            UNESCO 2003
                        </span>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            aria-label="Kembali ke atas"
                            className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/25 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-300"
                        >
                            <IconArrowUp />
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full h-5 overflow-hidden rotate-180"><KelirBorder /></div>
        </footer>
    );
}