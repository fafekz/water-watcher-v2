import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "normal" | "warning" | "critical";
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  unit,
  trend,
  trendValue,
  status = "normal",
  icon,
  className,
}: MetricCardProps) => {
  const statusStyles = {
    normal: "border-water/20 hover:border-water/40",
    warning: "border-warning/30 hover:border-warning/50",
    critical: "border-critical/30 hover:border-critical/50 animate-pulse-glow",
  };

  const textStyles = {
    normal: "text-water",
    warning: "text-warning",
    critical: "text-critical",
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-critical" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "card-gradient rounded-xl p-4 border glow-effect transition-all duration-300",
        statusStyles[status],
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-muted-foreground text-sm font-medium">{title}</span>
        {icon && (
          <div className={cn("opacity-60", textStyles[status])}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className={cn("text-3xl font-bold metric-value", textStyles[status])}>
          {value.toFixed(1)}
        </span>
        <span className="text-muted-foreground text-sm">{unit}</span>
      </div>

      {trend && trendValue && (
        <div className={cn("flex items-center gap-1 mt-2", trendColor)}>
          <TrendIcon className="w-4 h-4" />
          <span className="text-xs">{trendValue}</span>
        </div>
      )}
    </motion.div>
  );
};
