import { useBattery } from "@/hooks/use-battery";
import { useClock } from "@/hooks/use-clock";
import { Battery, BatteryLow, Zap } from "lucide-react";

export function StatusWidgets() {
  const time = useClock();
  const { level, charging, supported } = useBattery();

  return (
    <div className="flex items-center gap-2">
      <div className="glass rounded-full px-3 py-1.5 font-display text-sm tracking-wider neon-text">
        {time}
      </div>
      {supported && level !== null && (
        <div className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-cyan-100">
          {charging ? (
            <Zap size={14} className="text-yellow-300" fill="currentColor" />
          ) : level < 20 ? (
            <BatteryLow size={16} className="text-red-400" />
          ) : (
            <Battery size={16} className="text-cyan-300" />
          )}
          <span>{level}%</span>
        </div>
      )}
    </div>
  );
}
