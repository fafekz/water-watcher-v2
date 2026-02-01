import { motion } from "framer-motion";
import { Droplets, Bell, Menu } from "lucide-react";
import { StatusIndicator } from "./StatusIndicator";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
  onBellClick?: () => void;
}
export const Header = ({
  onMenuClick,
  onBellClick
}: HeaderProps) => {
  const [hasNotifications] = useState(true);
  return <motion.header initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="sticky top-7 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-secondary transition-colors lg:hidden">
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-water/10">
              <Droplets className="w-6 h-6 text-water" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Pond #3</h1>
            </div>
          </div>
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
    </motion.header>;
};