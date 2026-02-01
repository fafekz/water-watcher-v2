import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "online" | "offline" | "warning";
  label: string;
  lastUpdate?: string;
}

export const StatusIndicator = ({ status, label, lastUpdate }: StatusIndicatorProps) => {
  const statusConfig = {
    online: {
      color: "bg-success",
      glow: "shadow-[0_0_10px_hsl(142,71%,45%)]",
      text: "Online",
    },
    offline: {
      color: "bg-critical",
      glow: "shadow-[0_0_10px_hsl(0,72%,51%)]",
      text: "Offline",
    },
    warning: {
      color: "bg-warning",
      glow: "shadow-[0_0_10px_hsl(38,92%,50%)]",
      text: "Warning",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <motion.div
          className={cn("w-3 h-3 rounded-full", config.color, config.glow)}
          animate={status === "online" ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {status === "online" && (
          <motion.div
            className={cn("absolute inset-0 rounded-full", config.color)}
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      <div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {lastUpdate && (
          <p className="text-xs text-muted-foreground">Last update: {lastUpdate}</p>
        )}
      </div>
    </div>
  );
};
