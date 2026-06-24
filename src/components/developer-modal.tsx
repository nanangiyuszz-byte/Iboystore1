import { GlassModal } from "./glass-modal";
import { MessageCircle, Phone } from "lucide-react";

export function DeveloperModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <GlassModal open={open} onClose={onClose} title="Developer Info">
      <div className="flex flex-col items-center gap-4">
        <img
          src="https://files.catbox.moe/jecork.jpg"
          alt="Developer"
          className="w-28 h-28 rounded-full object-cover neon-glow border-2 border-cyan-400/60"
        />
        <div className="text-center">
          <h4 className="font-display neon-text text-lg">Developer</h4>
          <p className="text-xs text-cyan-100/70 mt-1">Digital Store Creator</p>
        </div>
        <div className="w-full flex flex-col gap-2 mt-2">
          <a
            href="https://wa.me/6283109105308"
            target="_blank"
            rel="noreferrer"
            className="glass rounded-xl px-4 py-3 flex items-center gap-3 hover:neon-glow transition-all text-sm text-cyan-50"
          >
            <Phone size={16} className="text-cyan-300" />
            <span className="flex-1">WhatsApp</span>
            <span className="font-mono text-cyan-200/80">+62 831-0910-5308</span>
          </a>
          <a
            href="https://whatsapp.com/channel/0029Vb8XyJkGehERjMvj1R1k"
            target="_blank"
            rel="noreferrer"
            className="glass rounded-xl px-4 py-3 flex items-center gap-3 hover:neon-glow transition-all text-sm text-cyan-50"
          >
            <MessageCircle size={16} className="text-cyan-300" />
            <span className="flex-1">WhatsApp Channel</span>
          </a>
        </div>
      </div>
    </GlassModal>
  );
}
