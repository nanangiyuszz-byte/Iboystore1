import { GlassModal } from "./glass-modal";
import { Copy, Send } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { formatIDR } from "@/lib/products";

export function PurchaseModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}) {
  const [copied, setCopied] = useState(false);
  if (!product) return null;

  const message = `Asalamualaikum min, saya mau beli ${product.name} ${formatIDR(product.price)}`;
  const waUrl = `https://wa.me/${product.wa_number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  const copyDana = async () => {
    await navigator.clipboard.writeText("083109105308");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <GlassModal open={open} onClose={onClose} title={`Beli — ${product.name}`}>
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <p className="text-xs text-cyan-200/70">Total</p>
          <p className="font-display text-2xl neon-text">{formatIDR(product.price)}</p>
        </div>

        <div className="glass rounded-xl p-3 flex flex-col items-center gap-2">
          <p className="text-xs text-cyan-100/80 uppercase tracking-wider">Scan QRIS</p>
          <img
            src="https://files.catbox.moe/1z6nkc.jpg"
            alt="QRIS"
            className="w-48 h-48 object-contain rounded-lg bg-white p-2"
          />
        </div>

        <button
          onClick={copyDana}
          className="glass rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-cyan-50 hover:neon-glow transition-all"
        >
          <div className="flex-1 text-left">
            <p className="text-[10px] uppercase tracking-wider text-cyan-200/70">Dana</p>
            <p className="font-mono">083109105308</p>
          </div>
          <Copy size={16} className="text-cyan-300" />
          <span className="text-xs text-cyan-200/70 w-12 text-right">
            {copied ? "Copied!" : "Copy"}
          </span>
        </button>

        <p className="text-[11px] text-cyan-100/60 text-center leading-relaxed">
          Setelah transfer, klik tombol di bawah untuk konfirmasi via WhatsApp.
        </p>

        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full rounded-xl py-3 flex items-center justify-center gap-2 font-semibold text-slate-900 transition-all hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, oklch(0.88 0.16 195), oklch(0.78 0.18 195))",
            boxShadow: "0 0 24px rgba(34,211,238,0.55)",
          }}
        >
          <Send size={16} />
          Konfirmasi Pembelian
        </a>
      </div>
    </GlassModal>
  );
}
