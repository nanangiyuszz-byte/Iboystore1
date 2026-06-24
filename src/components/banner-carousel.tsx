import { useEffect, useState } from "react";

const BANNERS = ["https://files.catbox.moe/v50i58.png"];

export function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % BANNERS.length), 3000);
    return () => clearInterval(id);
  }, []);

  const onPointerDown = (x: number) => setDragStart(x);
  const onPointerUp = (x: number) => {
    if (dragStart === null) return;
    const dx = x - dragStart;
    if (Math.abs(dx) > 40) {
      setIndex((i) => (i + (dx < 0 ? 1 : BANNERS.length - 1)) % BANNERS.length);
    }
    setDragStart(null);
  };

  return (
    <div className="glass rounded-2xl p-2 border border-cyan-400/30 shadow-[0_0_24px_-8px_rgba(34,211,238,0.45)] mb-6">
      <div
        className="relative overflow-hidden rounded-xl aspect-[16/7] sm:aspect-[16/5] select-none touch-pan-y"
        onPointerDown={(e) => onPointerDown(e.clientX)}
        onPointerUp={(e) => onPointerUp(e.clientX)}
        onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
        onTouchEnd={(e) => onPointerUp(e.changedTouches[0].clientX)}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {BANNERS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Banner ${i + 1}`}
              draggable={false}
              className="w-full h-full object-cover shrink-0 rounded-xl"
            />
          ))}
        </div>

        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Banner ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-cyan-300" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
