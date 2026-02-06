import { Bell, Gauge, Moon, Sun, Shield, Database, Wifi } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useTheme } from "next-themes";

export const SettingsPanel = () => {
  const { theme, setTheme } = useTheme();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [refreshRate, setRefreshRate] = useState([3]);
  const [dataRetention, setDataRetention] = useState("30");

  return (
    <div className="space-y-6">
      {/* Notifications Section */}
      <div className="card-gradient rounded-xl border border-border p-6 glow-effect">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-water/10">
            <Bell className="w-5 h-5 text-water" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">Configure how you receive alerts</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-alerts" className="text-foreground">Email Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive alerts via email</p>
            </div>
            <Switch
              id="email-alerts"
              checked={emailAlerts}
              onCheckedChange={setEmailAlerts}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications" className="text-foreground">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Browser push notifications</p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="critical-alerts" className="text-foreground">Critical Alerts Only</Label>
              <p className="text-sm text-muted-foreground">Only notify for critical thresholds</p>
            </div>
            <Switch
              id="critical-alerts"
              checked={criticalAlerts}
              onCheckedChange={setCriticalAlerts}
            />
          </div>
        </div>
      </div>

      {/* Display & Appearance */}
      <div className="card-gradient rounded-xl border border-border p-6 glow-effect">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-water/10">
            {theme === "dark" ? (
              <Moon className="w-5 h-5 text-water" />
            ) : (
              <Sun className="w-5 h-5 text-water" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
            <p className="text-sm text-muted-foreground">Customize the interface</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Theme</Label>
              <p className="text-sm text-muted-foreground">Choose light or dark mode</p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Monitoring Settings */}
      <div className="card-gradient rounded-xl border border-border p-6 glow-effect">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-water/10">
            <Gauge className="w-5 h-5 text-water" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Monitoring</h3>
            <p className="text-sm text-muted-foreground">Sensor and data settings</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-foreground">Refresh Rate</Label>
              <span className="text-sm text-muted-foreground">{refreshRate[0]} seconds</span>
            </div>
            <Slider
              value={refreshRate}
              onValueChange={setRefreshRate}
              min={1}
              max={10}
              step={1}
              className="w-full [&>span:first-child>span]:bg-water [&_[role=slider]]:!border-water [&_[role=slider]]:ring-water/50"
            />
            <p className="text-sm text-muted-foreground mt-1">How often sensor data updates</p>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Data Retention</Label>
              <p className="text-sm text-muted-foreground">How long to keep historical data</p>
            </div>
            <Select value={dataRetention} onValueChange={setDataRetention}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card-gradient rounded-xl border border-border p-6 glow-effect">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-water/10">
            <Shield className="w-5 h-5 text-water" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">System</h3>
            <p className="text-sm text-muted-foreground">Connection and status information</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <Wifi className="w-4 h-4 text-normal" />
              <span className="text-sm text-foreground">Sensor Connection</span>
            </div>
            <span className="text-sm font-medium text-normal">Connected</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-normal" />
              <span className="text-sm text-foreground">Database Status</span>
            </div>
            <span className="text-sm font-medium text-normal">Healthy</span>
          </div>
          
          <Separator />
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              Export Data
            </Button>
            <Button variant="outline" className="flex-1">
              Reset Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
