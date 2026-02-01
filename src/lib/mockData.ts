// Mock data generator for water monitoring system

export interface WaterMetrics {
  waterLevel: number;
  flowRate: number;
  pressure: number;
  pH: number;
  turbidity: number;
  temperature: number;
  dissolvedOxygen: number;
  timestamp: Date;
}

export interface HistoricalDataPoint {
  timestamp: string;
  waterLevel: number;
  flowRate: number;
  pressure: number;
  pH: number;
  turbidity: number;
  temperature: number;
}

// Generate current metrics with some randomness
export const generateCurrentMetrics = (): WaterMetrics => ({
  waterLevel: 65 + Math.random() * 20,
  flowRate: 120 + Math.random() * 40,
  pressure: 2.5 + Math.random() * 1.5,
  pH: 6.8 + Math.random() * 0.8,
  turbidity: 1.5 + Math.random() * 2,
  temperature: 18 + Math.random() * 8,
  dissolvedOxygen: 7 + Math.random() * 2,
  timestamp: new Date(),
});

// Generate historical data for charts
export const generateHistoricalData = (hours: number = 24): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const now = new Date();

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourOfDay = timestamp.getHours();
    
    // Add some realistic patterns based on time of day
    const dailyPattern = Math.sin((hourOfDay / 24) * Math.PI * 2) * 0.2;
    
    data.push({
      timestamp: timestamp.toISOString(),
      waterLevel: 70 + dailyPattern * 15 + (Math.random() - 0.5) * 10,
      flowRate: 130 + dailyPattern * 30 + (Math.random() - 0.5) * 20,
      pressure: 3 + dailyPattern * 0.5 + (Math.random() - 0.5) * 0.5,
      pH: 7.2 + (Math.random() - 0.5) * 0.4,
      turbidity: 2 + Math.abs(dailyPattern) * 1.5 + Math.random() * 0.5,
      temperature: 22 + dailyPattern * 3 + (Math.random() - 0.5) * 2,
    });
  }

  return data;
};

// Sensor configuration
export const sensorConfig = {
  waterLevel: { min: 0, max: 100, unit: "%", warning: 85, critical: 95 },
  flowRate: { min: 0, max: 200, unit: "L/min", warning: 160, critical: 180 },
  pressure: { min: 0, max: 5, unit: "bar", warning: 4, critical: 4.5 },
  pH: { min: 0, max: 14, unit: "pH", warning: 8.5, critical: 9 },
  turbidity: { min: 0, max: 10, unit: "NTU", warning: 5, critical: 8 },
  temperature: { min: 0, max: 40, unit: "°C", warning: 30, critical: 35 },
  dissolvedOxygen: { min: 0, max: 15, unit: "mg/L", warning: 5, critical: 4 },
};

export const getStatus = (
  value: number,
  config: { warning: number; critical: number }
): "normal" | "warning" | "critical" => {
  if (value >= config.critical) return "critical";
  if (value >= config.warning) return "warning";
  return "normal";
};
