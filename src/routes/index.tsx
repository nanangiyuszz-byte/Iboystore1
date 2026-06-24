import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Info, Search, Sparkles, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatusWidgets } from "@/components/status-widgets";
import { BroadcastBanner } from "@/components/broadcast-banner";
import { DeveloperModal } from "@/components/developer-modal";
import { BannerCarousel } from "@/components/banner-carousel";
import { formatIDR, buildWaUrl, type Product } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iboystore — Katalog Produk Digital" },
      { name: "description", content: "iboystore — toko digital premium. Pembelian cepat via WhatsApp." },
      { property: "og:title", content: "iboystore" },
      { property: "og:description", content: "Toko digital premium. Beli cepat via WhatsApp." },
    ],
  }),
  component: StorePage,
});

type SortMode = "default" | "latest";

function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("default");
  const [devOpen, setDevOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("products" as never)
        .select("*")
        .order("created_at", { ascending: false });
      if (!active) return;
      setProducts((data as Product[]) ?? []);
    };
    load();
    const channel = supabase
      .channel("products-stream")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => load())
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      p.name.toLowerCase().includes(query.trim().toLowerCase())
    );
    if (sort === "latest") {
      list = [...list].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return list;
  }, [products, query, sort]);

  return (
    <div className="min-h-screen">
      <div className="px-3 sm:px-6 pt-3 max-w-6xl mx-auto flex justify-end">
        <StatusWidgets />
      </div>

      <header className="sticky top-2 z-30 px-3 sm:px-6 pt-2 pb-2 max-w-6xl mx-auto">
        <nav className="glass-strong rounded-2xl px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="https://files.catbox.moe/3whqvw.png" alt="iboystore" className="w-8 h-8 object-contain" />
            <span className="hidden sm:inline font-display text-sm tracking-tight text-cyan-50/90 font-semibold">
              iboystore
            </span>
          </Link>

          <div className="flex-1 relative min-w-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-200/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-cyan-50 placeholder:text-cyan-200/40 focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.06] transition-all"
            />
          </div>

          <button
            onClick={() => setSort((s) => (s === "latest" ? "default" : "latest"))}
            className={`shrink-0 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-1.5 text-xs font-medium transition-all border ${
              sort === "latest"
                ? "border-cyan-400/60 text-slate-900"
                : "border-white/10 text-cyan-100/80 hover:border-white/20 bg-white/[0.04]"
            }`}
            style={
              sort === "latest"
                ? { background: "linear-gradient(135deg, oklch(0.90 0.13 195), oklch(0.78 0.14 195))" }
                : undefined
            }
          >
            <Sparkles size={14} />
            <span className="hidden xs:inline">Terbaru</span>
          </button>

          <button
            onClick={() => setDevOpen(true)}
            className="shrink-0 rounded-xl p-2 border border-white/10 text-cyan-100/80 hover:border-white/20 hover:text-cyan-50 transition-all bg-white/[0.04]"
            aria-label="Developer info"
          >
            <Info size={16} />
          </button>
        </nav>
      </header>

      <main className="px-3 sm:px-6 pb-12 max-w-6xl mx-auto">
        <BannerCarousel />

        <BroadcastBanner />


        {filtered.length === 0 && (
          <div className="glass rounded-2xl py-16 text-center text-cyan-100/60">
            <ShoppingBag className="mx-auto mb-3 text-cyan-400/50" size={32} />
            <p className="text-sm">
              {products.length === 0 ? "Belum ada produk. Tambahkan dari /admin." : "Tidak ada produk yang cocok."}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="glass rounded-lg overflow-hidden flex flex-col group transition-all duration-300 hover:border-cyan-400/40"
            >
              <div className="relative aspect-square overflow-hidden bg-black/30">
                <img
                  src={p.image_url}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {p.label && (
                  <span
                    className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-slate-900"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.92 0.14 195), oklch(0.80 0.16 195))",
                      boxShadow: "0 0 10px rgba(34,211,238,0.55)",
                    }}
                  >
                    {p.label}
                  </span>
                )}
              </div>
              <div className="p-2 flex flex-col gap-1 flex-1">
                <h3 className="text-[10px] sm:text-[11px] font-medium text-cyan-50 line-clamp-2 leading-snug min-h-[2.2em]">
                  {p.name}
                </h3>
                <p className="font-display text-[10px] sm:text-xs font-semibold text-cyan-300">
                  {formatIDR(p.price)}
                </p>
                <a
                  href={buildWaUrl(p)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto w-full rounded-md py-1 text-[10px] font-semibold text-center text-cyan-50 border border-cyan-400/40 bg-white/[0.05] backdrop-blur-md transition-all hover:bg-cyan-400/20 hover:border-cyan-300 hover:shadow-[0_0_16px_rgba(34,211,238,0.55)] active:scale-95"
                >
                  Beli
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="text-center text-[11px] text-cyan-200/40 pb-6">
        © {new Date().getFullYear()} iboystore
      </footer>

      <DeveloperModal open={devOpen} onClose={() => setDevOpen(false)} />
    </div>
  );
}
