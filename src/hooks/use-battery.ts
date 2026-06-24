import { useEffect, useState } from "react";

interface BatteryManager extends EventTarget {
  level: number;
  charging: boolean;
}

export function useBattery() {
  const [level, setLevel] = useState<number | null>(null);
  const [charging, setCharging] = useState<boolean>(false);
  const [supported, setSupported] = useState<boolean>(true);

  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> };
    if (!nav.getBattery) {
      setSupported(false);
      return;
    }
    let battery: BatteryManager | null = null;
    const update = () => {
      if (!battery) return;
      setLevel(Math.round(battery.level * 100));
      setCharging(battery.charging);
    };
    nav.getBattery().then((b) => {
      battery = b;
      update();
      b.addEventListener("levelchange", update);
      b.addEventListener("chargingchange", update);
    }).catch(() => setSupported(false));
    return () => {
      if (battery) {
        battery.removeEventListener("levelchange", update);
        battery.removeEventListener("chargingchange", update);
      }
    };
  }, []);

  return { level, charging, supported };
}
