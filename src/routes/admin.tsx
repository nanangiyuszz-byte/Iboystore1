import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Lock, Megaphone, Package, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatIDR, type Product } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Digital Store" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const ADMIN_PIN = "252525";
const SESSION_KEY = "ds_admin_ok";

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  const tryLogin = (value: string) => {
    if (value === ADMIN_PIN) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setErr("");
    } else if (value.length === ADMIN_PIN.length) {
      setErr("PIN salah");
      setTimeout(() => {
        setPin("");
        setErr("");
      }, 1200);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-strong rounded-3xl p-8 w-full max-w-sm flex flex-col items-center gap-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center neon-glow"
            style={{ background: "linear-gradient(135deg, oklch(0.88 0.16 195), oklch(0.78 0.18 195))" }}
          >
            <Lock className="text-slate-900" size={22} />
          </div>
          <div className="text-center">
            <h1 className="font-display text-lg neon-text tracking-wide">Admin Access</h1>
            <p className="text-xs text-cyan-100/70 mt-1">Masukkan PIN untuk lanjut</p>
          </div>
          <input
            value={pin}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 6);
              setPin(v);
              tryLogin(v);
            }}
            type="password"
            inputMode="numeric"
            autoFocus
            placeholder="••••••"
            className="w-full text-center font-display text-2xl tracking-[0.6em] py-3 rounded-xl bg-white/5 border border-cyan-400/30 text-cyan-50 placeholder:text-cyan-200/30 focus:outline-none focus:border-cyan-400/70 focus:neon-glow"
          />
          {err && <p className="text-xs text-red-300">{err}</p>}
          <Link to="/" className="text-xs text-cyan-200/70 hover:text-cyan-100 flex items-center gap-1">
            <ArrowLeft size={12} /> Kembali ke toko
          </Link>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [wa, setWa] = useState("");
  const [label, setLabel] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [status, setStatus] = useState("");

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products" as never)
      .select("*")
      .order("created_at", { ascending: false });
    setProducts((data as Product[]) ?? []);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    const p = parseInt(price.replace(/\D/g, ""), 10);
    if (!name || !p || !imageUrl || !wa) {
      setStatus("Lengkapi semua field");
      return;
    }
    const { error } = await supabase.from("products" as never).insert({
      name,
      price: p,
      image_url: imageUrl,
      wa_number: wa.replace(/\D/g, ""),
      label: label.trim() ? label.trim().toUpperCase() : null,
    } as never);
    if (error) {
      setStatus("Gagal: " + error.message);
    } else {
      setStatus("Produk ditambahkan ✓");
      setName(""); setPrice(""); setImageUrl(""); setWa(""); setLabel("");
      loadProducts();
    }
    setTimeout(() => setStatus(""), 2500);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    await supabase.from("products" as never).delete().eq("id", id);
    loadProducts();
  };

  const sendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    const { error } = await supabase
      .from("broadcasts" as never)
      .insert({ message: broadcastMsg.trim() } as never);
    if (!error) {
      setBroadcastMsg("");
      setStatus("Broadcast terkirim ✓");
      setTimeout(() => setStatus(""), 2500);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  };

  return (
    <div className="min-h-screen px-3 sm:px-5 py-4 max-w-5xl mx-auto">
      <header className="glass-strong rounded-2xl px-4 py-3 flex items-center gap-3 mb-4">
        <Link to="/" className="text-cyan-200 hover:text-cyan-50">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-display neon-text tracking-wide flex-1">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="text-xs text-cyan-200/70 hover:text-cyan-100 border border-cyan-400/30 rounded-lg px-3 py-1.5"
        >
          Logout
        </button>
      </header>

      {status && (
        <div className="glass rounded-xl px-4 py-2 text-sm text-cyan-50 mb-4 text-center">
          {status}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Add product */}
        <section className="glass-strong rounded-2xl p-5">
          <h2 className="flex items-center gap-2 font-display neon-text mb-4">
            <Plus size={16} /> Tambah Produk
          </h2>
          <form onSubmit={addProduct} className="flex flex-col gap-3">
            <AdminInput label="Nama Produk" value={name} onChange={setName} />
            <AdminInput label="Harga (IDR)" value={price} onChange={setPrice} inputMode="numeric" />
            <AdminInput label="URL Gambar" value={imageUrl} onChange={setImageUrl} />
            <AdminInput label="Nomor WhatsApp (6281...)" value={wa} onChange={setWa} inputMode="tel" />
            <AdminInput label="Label Produk (opsional, mis. TERBARU)" value={label} onChange={setLabel} />
            <button
              type="submit"
              className="rounded-xl py-2.5 text-sm font-semibold text-slate-900 mt-1"
              style={{
                background: "linear-gradient(135deg, oklch(0.88 0.16 195), oklch(0.78 0.18 195))",
                boxShadow: "0 0 16px rgba(34,211,238,0.45)",
              }}
            >
              Simpan Produk
            </button>
          </form>
        </section>

        {/* Broadcast */}
        <section className="glass-strong rounded-2xl p-5">
          <h2 className="flex items-center gap-2 font-display neon-text mb-4">
            <Megaphone size={16} /> Broadcast Notifikasi
          </h2>
          <form onSubmit={sendBroadcast} className="flex flex-col gap-3">
            <textarea
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              rows={5}
              placeholder="Tulis pesan global yang akan muncul di home page..."
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-cyan-400/25 text-sm text-cyan-50 placeholder:text-cyan-200/40 focus:outline-none focus:border-cyan-400/60 resize-none"
            />
            <button
              type="submit"
              className="rounded-xl py-2.5 text-sm font-semibold text-slate-900"
              style={{
                background: "linear-gradient(135deg, oklch(0.88 0.16 195), oklch(0.78 0.18 195))",
                boxShadow: "0 0 16px rgba(34,211,238,0.45)",
              }}
            >
              Kirim Broadcast
            </button>
            <p className="text-[11px] text-cyan-100/60">
              Pesan terbaru akan muncul sebagai banner di halaman utama.
            </p>
          </form>
        </section>
      </div>

      {/* Product list */}
      <section className="glass-strong rounded-2xl p-5 mt-4">
        <h2 className="flex items-center gap-2 font-display neon-text mb-4">
          <Package size={16} /> Produk ({products.length})
        </h2>
        {products.length === 0 ? (
          <p className="text-sm text-cyan-100/60 text-center py-6">Belum ada produk.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {products.map((p) => (
              <li key={p.id} className="glass rounded-xl p-3 flex items-center gap-3">
                <img src={p.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-cyan-50 truncate">{p.name}</p>
                  <p className="text-xs neon-text">{formatIDR(p.price)} · {p.wa_number}</p>
                </div>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="p-2 text-red-300 hover:text-red-200 rounded-lg border border-red-400/30 hover:border-red-400/60"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function AdminInput({
  label,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "text" | "numeric" | "tel";
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wider text-cyan-200/70">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        className="px-3 py-2 rounded-xl bg-white/5 border border-cyan-400/25 text-sm text-cyan-50 focus:outline-none focus:border-cyan-400/60"
      />
    </label>
  );
}
