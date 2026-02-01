import { motion } from "framer-motion";
import { LayoutDashboard, BarChart3, Settings, Bell, Activity } from "lucide-react";
import aquantsLogo from "@/assets/aquants-logo.png";
import { cn } from "@/lib/utils";
type TabType = "dashboard" | "history" | "alerts" | "settings";
interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}
const tabs = [{
  id: "dashboard" as const,
  label: "Dashboard",
  icon: LayoutDashboard
}, {
  id: "history" as const,
  label: "History",
  icon: BarChart3
}, {
  id: "alerts" as const,
  label: "Alerts",
  icon: Bell
}, {
  id: "settings" as const,
  label: "Settings",
  icon: Settings
}];
export const Navigation = ({
  activeTab,
  onTabChange,
  isMobile = false,
  isOpen = false,
  onClose
}: NavigationProps) => {
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 top-[85px] bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}

        {/* Slide-in Menu */}
        <motion.nav
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? 0 : "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-[85px] left-0 bottom-0 w-64 z-50 border-r border-border bg-card/95 backdrop-blur-lg lg:hidden"
        >
          <div className="p-4">
            <div className="space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button 
                    key={tab.id} 
                    onClick={() => {
                      onTabChange(tab.id);
                      onClose?.();
                    }} 
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
                      isActive 
                        ? "bg-water/10 text-water" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.nav>
        
        {/* Bottom Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg safe-area-inset-bottom lg:hidden"
        >
          <div className="flex items-center justify-around py-2 px-4">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id} 
                  onClick={() => onTabChange(tab.id)} 
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                    isActive ? "text-water" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn("p-2 rounded-xl transition-all", isActive && "bg-water/10")}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.nav>
      </>
    );
  }
  return <motion.aside initial={{
    opacity: 0,
    x: -20
  }} animate={{
    opacity: 1,
    x: 0
  }} className="hidden lg:flex flex-col w-64 border-r border-border bg-sidebar p-4 gap-2">
      <div className="px-4 py-4 mb-4 flex justify-center">
        <img src={aquantsLogo} alt="Aquants Logo" className="w-full max-w-full" />
      </div>

      <div className="space-y-1">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} onClick={() => onTabChange(tab.id)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left", isActive ? "bg-water/10 text-water" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>;
      })}
      </div>

      <div className="mt-auto pb-6 pt-[20px]">
        <div className="card-gradient rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-water" />
            <span className="text-sm font-medium text-foreground">System Health</span>
          </div>
          <p className="text-xs text-muted-foreground">
            All sensors operational. Last sync 2s ago.
          </p>
        </div>
      </div>
    </motion.aside>;
};