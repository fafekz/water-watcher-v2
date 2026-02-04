import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, Gauge, Thermometer, Activity, Waves, FlaskConical, Wind } from "lucide-react";
import { CircularGauge } from "@/components/CircularGauge";
import { MetricCard } from "@/components/MetricCard";
import { HistoricalChart } from "@/components/HistoricalChart";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AlertsPanel } from "@/components/AlertsPanel";
import {
  generateCurrentMetrics,
  generateHistoricalData,
  sensorConfig,
  getStatus,
  WaterMetrics,
  HistoricalDataPoint,
} from "@/lib/mockData";

type TabType = "dashboard" | "history" | "alerts" | "settings";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertsPanelOpen, setAlertsPanelOpen] = useState(false);
  const [pondMenuOpen, setPondMenuOpen] = useState(false);
  const [metrics, setMetrics] = useState<WaterMetrics>(generateCurrentMetrics());
  const [historicalData] = useState<HistoricalDataPoint[]>(() => generateHistoricalData(168));

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateCurrentMetrics());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="h-screen bg-background flex relative overflow-hidden" style={{ paddingTop: 'var(--status-bar-height)' }}>
      {/* Status bar background cover - only in Capacitor native app on mobile */}
      <div className="fixed top-0 left-0 right-0 bg-background z-[60] md:hidden" style={{ height: 'var(--status-bar-height)' }} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Header
          onMenuClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            setAlertsPanelOpen(false);
            setPondMenuOpen(false);
          }}
          onBellClick={() => {
            setAlertsPanelOpen(!alertsPanelOpen);
            setMobileMenuOpen(false);
            setPondMenuOpen(false);
          }}
          onPondClick={() => {
            setPondMenuOpen(!pondMenuOpen);
            setMobileMenuOpen(false);
            setAlertsPanelOpen(false);
          }}
          pondMenuOpen={pondMenuOpen}
        />

        <main className="flex-1 p-4 md:p-6 pb-32 md:pb-28 lg:pb-6 overflow-auto">
          {activeTab === "dashboard" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-7xl mx-auto space-y-6"
            >
              {/* Page Title */}
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-foreground mb-1">Real-Time Monitoring</h2>
                <p className="text-muted-foreground">Live sensor readings from your system</p>
              </motion.div>

              {/* Primary Gauges */}
              <motion.div
                variants={itemVariants}
                className="card-gradient rounded-2xl border border-border p-6 glow-effect"
              >
                <h3 className="text-lg font-semibold text-foreground mb-6">Primary Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  <CircularGauge
                    value={metrics.waterLevel}
                    min={sensorConfig.waterLevel.min}
                    max={sensorConfig.waterLevel.max}
                    unit={sensorConfig.waterLevel.unit}
                    label="Water Level"
                    warningThreshold={sensorConfig.waterLevel.warning}
                    criticalThreshold={sensorConfig.waterLevel.critical}
                    size="sm"
                    icon={<Droplets className="w-4 h-4" />}
                  />
                  <CircularGauge
                    value={metrics.flowRate}
                    min={sensorConfig.flowRate.min}
                    max={sensorConfig.flowRate.max}
                    unit={sensorConfig.flowRate.unit}
                    label="Flow Rate"
                    warningThreshold={sensorConfig.flowRate.warning}
                    criticalThreshold={sensorConfig.flowRate.critical}
                    size="sm"
                    icon={<Waves className="w-4 h-4" />}
                  />
                  <CircularGauge
                    value={metrics.pressure}
                    min={sensorConfig.pressure.min}
                    max={sensorConfig.pressure.max}
                    unit={sensorConfig.pressure.unit}
                    label="Pressure"
                    warningThreshold={sensorConfig.pressure.warning}
                    criticalThreshold={sensorConfig.pressure.critical}
                    size="sm"
                    icon={<Gauge className="w-4 h-4" />}
                  />
                  <CircularGauge
                    value={metrics.pH}
                    min={sensorConfig.pH.min}
                    max={sensorConfig.pH.max}
                    unit={sensorConfig.pH.unit}
                    label="pH Level"
                    warningThreshold={sensorConfig.pH.warning}
                    criticalThreshold={sensorConfig.pH.critical}
                    size="sm"
                    icon={<FlaskConical className="w-4 h-4" />}
                  />
                  <CircularGauge
                    value={metrics.turbidity}
                    min={sensorConfig.turbidity.min}
                    max={sensorConfig.turbidity.max}
                    unit={sensorConfig.turbidity.unit}
                    label="Turbidity"
                    warningThreshold={sensorConfig.turbidity.warning}
                    criticalThreshold={sensorConfig.turbidity.critical}
                    size="sm"
                    icon={<Activity className="w-4 h-4" />}
                  />
                  <CircularGauge
                    value={metrics.temperature}
                    min={sensorConfig.temperature.min}
                    max={sensorConfig.temperature.max}
                    unit={sensorConfig.temperature.unit}
                    label="Temperature"
                    warningThreshold={sensorConfig.temperature.warning}
                    criticalThreshold={sensorConfig.temperature.critical}
                    size="sm"
                    icon={<Thermometer className="w-4 h-4" />}
                  />
                </div>
              </motion.div>

              {/* Metric Cards */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                  title="Water Level"
                  value={metrics.waterLevel}
                  unit="%"
                  trend="up"
                  trendValue="+2.3% from avg"
                  status={getStatus(metrics.waterLevel, sensorConfig.waterLevel)}
                  icon={<Droplets className="w-5 h-5" />}
                />
                <MetricCard
                  title="Flow Rate"
                  value={metrics.flowRate}
                  unit="L/min"
                  trend="stable"
                  trendValue="Normal range"
                  status={getStatus(metrics.flowRate, sensorConfig.flowRate)}
                  icon={<Waves className="w-5 h-5" />}
                />
                <MetricCard
                  title="Pressure"
                  value={metrics.pressure}
                  unit="bar"
                  trend="down"
                  trendValue="-0.1 from peak"
                  status={getStatus(metrics.pressure, sensorConfig.pressure)}
                  icon={<Gauge className="w-5 h-5" />}
                />
                <MetricCard
                  title="Dissolved O₂"
                  value={metrics.dissolvedOxygen}
                  unit="mg/L"
                  trend="up"
                  trendValue="+0.5 today"
                  status="normal"
                  icon={<Wind className="w-5 h-5" />}
                />
              </motion.div>

              {/* System Performance */}
              <motion.div
                variants={itemVariants}
                className="card-gradient rounded-2xl border border-border p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-1">System Performance</h3>
                <p className="text-sm text-muted-foreground mb-6">Overview of system health and efficiency</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-water">98.7%</div>
                    <p className="text-sm text-muted-foreground mt-1">System Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-water">6/6</div>
                    <p className="text-sm text-muted-foreground mt-1">Sensors Online</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-water">24.5k</div>
                    <p className="text-sm text-muted-foreground mt-1">Data Points Today</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning">2</div>
                    <p className="text-sm text-muted-foreground mt-1">Alerts Today</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Historical Analysis</h2>
                <p className="text-muted-foreground">Analyze trends and patterns over time</p>
              </div>
              <HistoricalChart data={historicalData} />
            </motion.div>
          )}

          {activeTab === "alerts" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Alerts & Notifications</h2>
                <p className="text-muted-foreground">Actively ongoing alerts</p>
              </div>
              <div className="card-gradient rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="p-2 rounded-full bg-warning/20">
                    <Activity className="w-5 h-5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">High Turbidity Detected</h4>
                      <span className="text-xs text-foreground">2 min ago</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">Turbidity levels reached 4.2 NTU, exceeding the warning threshold of 4.0 NTU</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg bg-critical/10 border border-critical/20">
                  <div className="p-2 rounded-full bg-critical/20">
                    <Activity className="w-5 h-5 text-critical" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">Low Water Level Warning</h4>
                      <span className="text-xs text-foreground">15 min ago</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">Water level dropped to 42%, below the critical threshold of 45%</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg bg-normal/10 border border-normal/20">
                  <div className="p-2 rounded-full bg-normal/20">
                    <Activity className="w-5 h-5 text-normal" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">pH Level Normalized</h4>
                      <span className="text-xs text-foreground">1 hour ago</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">pH levels returned to normal range at 7.2</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Historical Alerts</h2>
                <p className="text-muted-foreground">List of past alerts and notifications</p>
              </div>
              <div className="card-gradient rounded-xl border border-border p-8 text-center">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Historical Alerts</h3>
                <p className="text-muted-foreground">Check this section again in some time</p>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Settings</h2>
                <p className="text-muted-foreground">Configure your monitoring preferences</p>
              </div>
              <SettingsPanel />
            </motion.div>
          )}
        </main>
      </div>

      {/* Mobile Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobile
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Alerts Panel - slides from right */}
      <AlertsPanel
        isOpen={alertsPanelOpen}
        onClose={() => setAlertsPanelOpen(false)}
      />
    </div>
  );
};

export default Index;
