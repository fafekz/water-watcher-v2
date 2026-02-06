import { motion } from "framer-motion";
import { Droplets, Bell, Menu, ChevronDown, Waves, Fish, Anchor, Shell } from "lucide-react";
import { StatusIndicator } from "./StatusIndicator";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

const ReservoirIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 3V11M12 11L9 8M12 11L15 8M2.5 14.5L3.11612 15.1161C3.68206 15.6821 4.44964 16 5.25 16C6.05036 16 6.81794 15.6821 7.38388 15.1161L7.61612 14.8839C8.18206 14.3179 8.94964 14 9.75 14C10.5504 14 11.3179 14.3179 11.8839 14.8839L12.1161 15.1161C12.6821 15.6821 13.4496 16 14.25 16C15.0504 16 15.8179 15.6821 16.3839 15.1161L16.6161 14.8839C17.1821 14.3179 17.9496 14 18.75 14C19.5504 14 20.3179 14.3179 20.8839 14.8839L21.5 15.5M2.5 19.5L3.11612 20.1161C3.68206 20.6821 4.44964 21 5.25 21C6.05036 21 6.81794 20.6821 7.38388 20.1161L7.61612 19.8839C8.18206 19.3179 8.94964 19 9.75 19C10.5504 19 11.3179 19.3179 11.8839 19.8839L12.1161 20.1161C12.6821 20.6821 13.4496 21 14.25 21C15.0504 21 15.8179 20.6821 16.3839 20.1161L16.6161 19.8839C17.1821 19.3179 17.9496 19 18.75 19C19.5504 19 20.3179 19.3179 20.8839 19.8839L21.5 20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface HeaderProps {
  onMenuClick?: () => void;
  onBellClick?: () => void;
  onPondClick?: () => void;
  pondMenuOpen?: boolean;
}

const ponds = [
  { id: 1, name: "Pond #1", icon: Droplets, description: "Main filtration system" },
  { id: 2, name: "Pond #2", icon: Waves, description: "Secondary reservoir" },
  { id: 3, name: "Pond #3", icon: Fish, description: "Fish breeding area" },
  { id: 4, name: "Pond #4", icon: Anchor, description: "Deep water storage" },
  { id: 5, name: "Pond #5", icon: Shell, description: "Shellfish cultivation" },
];

export const Header = ({
  onMenuClick,
  onBellClick,
  onPondClick,
  pondMenuOpen = false
}: HeaderProps) => {
  const [hasNotifications] = useState(true);
  const [selectedPond, setSelectedPond] = useState(ponds[2]);

  const handlePondSelect = (pond: typeof ponds[0]) => {
    setSelectedPond(pond);
    onPondClick?.();
  };

  const SelectedIcon = selectedPond.icon;

  return (
    <>
      <motion.header initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="sticky z-50 border-b border-border bg-background/80 backdrop-blur-lg md:top-0" style={{ top: 'var(--status-bar-height)' }}>
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-secondary transition-colors lg:hidden">
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              onClick={onPondClick}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-water/10 hover:bg-water/20 transition-colors"
            >
              <SelectedIcon className="w-6 h-6 text-water" />
              <span className="text-2xl font-bold text-foreground">{selectedPond.name}</span>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${pondMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <StatusIndicator status="online" label="System Status" lastUpdate="Just now" />
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button onClick={onBellClick} className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {hasNotifications && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-critical" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Pond Menu Backdrop */}
      {pondMenuOpen && (
        <div
          className="fixed top-header left-0 right-0 bottom-0 lg:left-64 bg-white/50 dark:bg-black/50 z-40"
          onClick={onPondClick}
        />
      )}

      {/* Pond Menu - slides down from header */}
      <div className="fixed top-header left-0 right-0 lg:left-64 z-40 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: pondMenuOpen ? 0 : "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`border-b border-border bg-card/95 backdrop-blur-lg ${pondMenuOpen ? 'pointer-events-auto' : ''}`}
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <ReservoirIcon className="w-5 h-5 text-water" />
              <h2 className="text-lg font-semibold text-foreground">Select a Reservoir</h2>
            </div>
            <div className="space-y-1">
              {ponds.map((pond) => {
                const Icon = pond.icon;
                const isActive = selectedPond.id === pond.id;
                return (
                  <button
                    key={pond.id}
                    onClick={() => handlePondSelect(pond)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                      isActive
                        ? "bg-water/10 text-water"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{pond.name}</span>
                    <span className="text-muted-foreground">({pond.description})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};