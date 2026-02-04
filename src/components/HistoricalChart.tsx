import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Brush,
} from "recharts";
import { HistoricalDataPoint, sensorConfig } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut, RotateCcw, CalendarIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HistoricalChartProps {
  data: HistoricalDataPoint[];
  className?: string;
}

type MetricKey = keyof Omit<HistoricalDataPoint, "timestamp">;

const metricColors: Record<MetricKey, { bg: string; lightness: number }> = {
  waterLevel: { bg: "hsl(199, 89%, 48%)", lightness: 48 },
  flowRate: { bg: "hsl(173, 80%, 40%)", lightness: 40 },
  pressure: { bg: "hsl(262, 83%, 58%)", lightness: 58 },
  pH: { bg: "hsl(38, 92%, 50%)", lightness: 50 },
  turbidity: { bg: "hsl(142, 71%, 45%)", lightness: 45 },
  temperature: { bg: "hsl(0, 72%, 51%)", lightness: 51 },
};

// Use dark text for lighter backgrounds (lightness <= 50%), white text for darker backgrounds
const getContrastText = (lightness: number) => lightness > 50 ? "#ffffff" : "#0f172a";

const metricLabels: Record<MetricKey, string> = {
  waterLevel: "Water Level",
  flowRate: "Flow Rate",
  pressure: "Pressure",
  pH: "pH Level",
  turbidity: "Turbidity",
  temperature: "Temperature",
};

export const HistoricalChart = ({ data, className }: HistoricalChartProps) => {
  const { theme } = useTheme();
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>(["waterLevel", "flowRate"]);
  const [timeRange, setTimeRange] = useState<"6h" | "12h" | "24h" | "7d" | "custom">("24h");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Theme-aware colors
  const chartColors = useMemo(() => {
    const isDark = theme === "dark";
    return {
      grid: isDark ? "hsl(217, 33%, 25%)" : "hsl(214, 32%, 85%)",
      axis: isDark ? "hsl(215, 20%, 55%)" : "hsl(215, 16%, 47%)",
      brushFill: isDark ? "hsl(222, 47%, 11%)" : "hsl(210, 40%, 96%)",
      cardBg: isDark ? "hsl(222, 47%, 11%)" : "hsl(0, 0%, 100%)",
      primary: isDark ? "hsl(199, 89%, 48%)" : "hsl(199, 95%, 32%)",
    };
  }, [theme]);

  // Zoom state
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [zoomDomain, setZoomDomain] = useState<{ left: number; right: number } | null>(null);

  const filteredData = useMemo(() => {
    const now = new Date();

    let cutoff: Date;
    let endDate: Date = now;

    if (timeRange === "custom" && customDateRange.from) {
      cutoff = customDateRange.from;
      endDate = customDateRange.to || now;
    } else {
      const ranges = {
        "6h": 6,
        "12h": 12,
        "24h": 24,
        "7d": 168,
        "custom": 24,
      };
      const hoursBack = ranges[timeRange];
      cutoff = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
    }

    // For 7d view or custom ranges spanning multiple days, include the date to make labels unique
    const hoursSpan = (endDate.getTime() - cutoff.getTime()) / (1000 * 60 * 60);
    const includeDate = hoursSpan > 24;

    return data
      .filter((d) => {
        const date = new Date(d.timestamp);
        return date >= cutoff && date <= endDate;
      })
      .map((d, index) => {
        const date = new Date(d.timestamp);
        const time = includeDate
          ? date.toLocaleDateString("en-GB", { month: "short", day: "numeric" }) +
            " " +
            date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
          : date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
        return {
          ...d,
          index,
          time,
        };
      });
  }, [data, timeRange, customDateRange]);

  const zoomedData = useMemo(() => {
    if (!zoomDomain) return filteredData;
    return filteredData.slice(zoomDomain.left, zoomDomain.right + 1);
  }, [filteredData, zoomDomain]);

  // Calculate statistics for active metrics
  const statistics = useMemo(() => {
    const dataToAnalyze = zoomedData;
    return activeMetrics.map((metric) => {
      const values = dataToAnalyze.map((d) => d[metric] as number).filter((v) => typeof v === "number");
      if (values.length === 0) return { metric, min: 0, max: 0, avg: 0 };

      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

      return { metric, min, max, avg };
    });
  }, [zoomedData, activeMetrics]);

  const toggleMetric = (metric: MetricKey) => {
    setActiveMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  const handleMouseDown = useCallback((e: any) => {
    if (e && e.activeLabel) {
      setRefAreaLeft(e.activeLabel);
      setIsSelecting(true);
    }
  }, []);

  const handleMouseMove = useCallback((e: any) => {
    if (isSelecting && e && e.activeLabel) {
      setRefAreaRight(e.activeLabel);
    }
  }, [isSelecting]);

  const handleMouseUp = useCallback(() => {
    if (refAreaLeft && refAreaRight) {
      const leftIndex = zoomedData.findIndex((d) => d.time === refAreaLeft);
      const rightIndex = zoomedData.findIndex((d) => d.time === refAreaRight);

      if (leftIndex !== -1 && rightIndex !== -1) {
        const [left, right] = leftIndex < rightIndex
          ? [leftIndex, rightIndex]
          : [rightIndex, leftIndex];

        if (right - left > 1) {
          const baseLeft = zoomDomain ? zoomDomain.left : 0;
          setZoomDomain({
            left: baseLeft + left,
            right: baseLeft + right,
          });
        }
      }
    }

    setRefAreaLeft(null);
    setRefAreaRight(null);
    setIsSelecting(false);
  }, [refAreaLeft, refAreaRight, zoomedData, zoomDomain]);

  const handleZoomIn = useCallback(() => {
    const currentLength = zoomedData.length;
    if (currentLength <= 4) return;

    const zoomAmount = Math.floor(currentLength * 0.25);
    const baseLeft = zoomDomain ? zoomDomain.left : 0;
    const baseRight = zoomDomain ? zoomDomain.right : filteredData.length - 1;

    setZoomDomain({
      left: baseLeft + zoomAmount,
      right: baseRight - zoomAmount,
    });
  }, [zoomedData.length, zoomDomain, filteredData.length]);

  const handleZoomOut = useCallback(() => {
    if (!zoomDomain) return;

    const expandAmount = Math.floor((zoomDomain.right - zoomDomain.left) * 0.5);
    const newLeft = Math.max(0, zoomDomain.left - expandAmount);
    const newRight = Math.min(filteredData.length - 1, zoomDomain.right + expandAmount);

    if (newLeft === 0 && newRight === filteredData.length - 1) {
      setZoomDomain(null);
    } else {
      setZoomDomain({ left: newLeft, right: newRight });
    }
  }, [zoomDomain, filteredData.length]);

  const handleReset = useCallback(() => {
    setZoomDomain(null);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <div className="card-gradient border border-border rounded-lg p-3 shadow-xl">
        <p className="text-sm text-muted-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-foreground">
              {metricLabels[entry.dataKey as MetricKey]}: {entry.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const isZoomed = zoomDomain !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "card-gradient rounded-xl border border-border p-6 glow-effect",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Historical Data</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Click and drag on the chart to zoom into a specific area
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded hover:bg-secondary transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleZoomOut}
              disabled={!isZoomed}
              className={cn(
                "p-1.5 rounded transition-colors",
                isZoomed ? "hover:bg-secondary" : "opacity-50 cursor-not-allowed"
              )}
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleReset}
              disabled={!isZoomed}
              className={cn(
                "p-1.5 rounded transition-colors",
                isZoomed ? "hover:bg-secondary" : "opacity-50 cursor-not-allowed"
              )}
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Time Range */}
          <div className="flex flex-wrap items-center gap-2">
            {(["6h", "12h", "24h", "7d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => {
                  setTimeRange(range);
                  setZoomDomain(null);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  timeRange === range
                    ? "bg-water text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {range}
              </button>
            ))}

            {/* Custom Date Range Picker */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "px-3 py-1.5 h-auto rounded-lg text-sm font-medium transition-all gap-2",
                    timeRange === "custom"
                      ? "bg-water text-white border-water hover:bg-water/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent"
                  )}
                >
                  <CalendarIcon className="w-4 h-4" />
                  {timeRange === "custom" && customDateRange.from && (
                    customDateRange.to ? (
                      <>
                        {format(customDateRange.from, "MMM d")} - {format(customDateRange.to, "MMM d")}
                      </>
                    ) : (
                      format(customDateRange.from, "MMM d, yyyy")
                    )
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Select date range</h4>
                    <p className="text-xs text-muted-foreground">
                      Choose start and end dates for the chart
                    </p>
                  </div>
                  <Calendar
                    mode="range"
                    selected={{ from: customDateRange.from, to: customDateRange.to }}
                    onSelect={(range) => {
                      setCustomDateRange({ from: range?.from, to: range?.to });
                    }}
                    numberOfMonths={1}
                    className="pointer-events-auto"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setCustomDateRange({ from: undefined, to: undefined });
                        setIsCalendarOpen(false);
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-water hover:bg-water/90"
                      onClick={() => {
                        if (customDateRange.from) {
                          setTimeRange("custom");
                          setZoomDomain(null);
                        }
                        setIsCalendarOpen(false);
                      }}
                      disabled={!customDateRange.from}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(metricLabels) as MetricKey[]).map((metric) => (
          <button
            key={metric}
            onClick={() => toggleMetric(metric)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
              activeMetrics.includes(metric)
                ? "border-transparent"
                : "border-border bg-transparent text-muted-foreground hover:text-foreground"
            )}
            style={{
              backgroundColor: activeMetrics.includes(metric)
                ? metricColors[metric].bg
                : undefined,
              color: activeMetrics.includes(metric)
                ? getContrastText(metricColors[metric].lightness)
                : undefined,
            }}
          >
            {metricLabels[metric]}
          </button>
        ))}
      </div>

      <div className="h-[400px] select-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={zoomedData}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartColors.grid}
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke={chartColors.axis}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={chartColors.axis}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            {activeMetrics.map((metric) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={metricColors[metric].bg}
                strokeWidth={2}
                dot={false}
                animationDuration={150}
                activeDot={{
                  r: 6,
                  fill: metricColors[metric].bg,
                  stroke: chartColors.cardBg,
                  strokeWidth: 2,
                }}
              />
            ))}

            {refAreaLeft && refAreaRight && (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
                fill="hsl(173, 80%, 40%)"
                fillOpacity={0.3}
              />
            )}

            {!isZoomed && (
              <Brush
                dataKey="time"
                height={40}
                stroke={chartColors.primary}
                fill={chartColors.brushFill}
                travellerWidth={10}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {isZoomed && (
        <div className="mt-4 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">
            Showing {zoomedData.length} of {filteredData.length} data points
          </span>
        </div>
      )}

      {/* Statistics Section */}
      {activeMetrics.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-4">Basic statistics for selected period</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statistics.map(({ metric, min, max, avg }) => (
              <div
                key={metric}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: metricColors[metric].bg }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {metricLabels[metric]}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                    <span>Min: <span className="text-foreground font-medium">{min.toFixed(1)}</span></span>
                    <span>Max: <span className="text-foreground font-medium">{max.toFixed(1)}</span></span>
                    <span>Avg: <span className="text-foreground font-medium">{avg.toFixed(1)}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
