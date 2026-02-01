import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircularGaugeProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  label: string;
  warningThreshold?: number;
  criticalThreshold?: number;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

const sizeConfig = {
  sm: { width: 120, strokeWidth: 8, fontSize: "text-xl", labelSize: "text-xs" },
  md: { width: 160, strokeWidth: 10, fontSize: "text-3xl", labelSize: "text-sm" },
  lg: { width: 200, strokeWidth: 12, fontSize: "text-4xl", labelSize: "text-base" },
};

export const CircularGauge = ({
  value,
  min,
  max,
  unit,
  label,
  warningThreshold,
  criticalThreshold,
  size = "md",
  icon,
}: CircularGaugeProps) => {
  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const strokeDashoffset = circumference * (1 - percentage);

  const getStatus = () => {
    if (criticalThreshold !== undefined && value >= criticalThreshold) return "critical";
    if (warningThreshold !== undefined && value >= warningThreshold) return "warning";
    return "normal";
  };

  const status = getStatus();

  const statusColors = {
    normal: {
      stroke: "hsl(var(--water))",
      text: "text-water",
    },
    warning: {
      stroke: "hsl(var(--warning))",
      text: "text-warning",
    },
    critical: {
      stroke: "hsl(var(--critical))",
      text: "text-critical",
    },
  };

  const colors = statusColors[status];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        <svg
          width={config.width}
          height={config.width}
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            className="stroke-[hsl(var(--gauge-track))]"
            strokeWidth={config.strokeWidth}
          />
          {/* Animated fill */}
          <motion.circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && (
            <div className={cn("mb-1 opacity-60", colors.text)}>
              {icon}
            </div>
          )}
          <motion.span
            className={cn(
              config.fontSize,
              "font-bold metric-value",
              colors.text
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {value.toFixed(1)}
          </motion.span>
          <span className="text-muted-foreground text-xs">{unit}</span>
        </div>
      </div>

      <span className={cn(config.labelSize, "text-muted-foreground font-medium")}>
        {label}
      </span>
    </div>
  );
};
