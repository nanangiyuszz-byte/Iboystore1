import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone } from "lucide-react";

interface Broadcast {
  id: string;
  message: string;
  created_at: string;
}

export function BroadcastBanner() {
  const [latest, setLatest] = useState<Broadcast | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("broadcasts" as never)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);
      if (active && data && data.length) setLatest(data[0] as Broadcast);
    };
    load();
    const channel = supabase
      .channel("broadcasts-stream")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "broadcasts" },
        () => load()
      )
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  if (!latest || dismissed) return null;

  return (
    <div
      className="glass-strong rounded-2xl px-4 py-3 flex items-start gap-3 mb-4"
      style={{ animation: "pulse-glow 2.6s ease-in-out infinite, float-in 0.4s ease-out" }}
    >
      <Megaphone className="text-cyan-300 shrink-0 mt-0.5" size={18} />
      <p className="text-sm text-cyan-50 flex-1 leading-relaxed">{latest.message}</p>
      <button
        onClick={() => setDismissed(true)}
        className="text-cyan-200/60 hover:text-cyan-100 text-xs"
      >
        ✕
      </button>
    </div>
  );
}
