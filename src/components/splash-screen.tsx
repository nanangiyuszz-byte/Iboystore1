import { useEffect, useState } from "react";

export function SplashScreen({ loading }: { loading: boolean }) {
  const [progress, setProgress] = useState(8);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!loading) {
      setProgress(100);
      const t = setTimeout(() => setHidden(true), 450);
      return () => clearTimeout(t);
    }
    const id = setInterval(() => {
      setProgress((p) => (p < 88 ? p + Math.random() * 8 : p));
    }, 220);
    return () => clearInterval(id);
  }, [loading]);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500"
      style={{
        opacity: loading ? 1 : 0,
        backgroundImage:
          'linear-gradient(rgba(8,12,30,0.92), rgba(8,12,30,0.96)), url("https://files.catbox.moe/1000046897.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="glass-strong rounded-3xl px-8 py-10 flex flex-col items-center gap-6 max-w-sm w-[85%]">
        <img
          src="https://files.catbox.moe/3whqvw.png"
          alt="Store logo"
          className="w-20 h-20 object-contain neon-glow rounded-2xl p-2"
          style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
        />
        <p className="font-display text-base neon-text tracking-wide text-center">
          Memuat katalog produk...
        </p>
        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-cyan-400/20">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, oklch(0.82 0.16 195), oklch(0.92 0.14 195), oklch(0.82 0.16 195))",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.6s linear infinite",
              boxShadow: "0 0 14px rgba(34,211,238,0.7)",
            }}
          />
        </div>
        <span className="text-xs text-cyan-200/70 font-mono">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
