import { motion } from "framer-motion";
import { X, Activity, Bell } from "lucide-react";

interface AlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertsPanel = ({ isOpen, onClose }: AlertsPanelProps) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 top-[85px] bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Slide-in Panel from Right */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-[85px] right-0 bottom-0 w-80 max-w-[85vw] z-50 border-l border-border bg-card/95 backdrop-blur-lg overflow-y-auto"
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-water" />
              <h2 className="text-lg font-semibold text-foreground">Alerts</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Active Alerts */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">Active Alerts</p>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="p-1.5 rounded-full bg-warning/20">
                <Activity className="w-4 h-4 text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium text-sm text-foreground truncate">High Turbidity</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">2m ago</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Turbidity at 4.2 NTU, above 4.0 threshold
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-critical/10 border border-critical/20">
              <div className="p-1.5 rounded-full bg-critical/20">
                <Activity className="w-4 h-4 text-critical" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium text-sm text-foreground truncate">Low Water Level</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">15m ago</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Water level at 42%, below 45% threshold
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
              <div className="p-1.5 rounded-full bg-success/20">
                <Activity className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium text-sm text-foreground truncate">pH Normalized</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">1h ago</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  pH returned to normal at 7.2
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">2</span> active alerts today
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};
