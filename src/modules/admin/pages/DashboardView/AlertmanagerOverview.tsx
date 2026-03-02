import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Star, Share2, ChevronLeft, ChevronRight, RefreshCw, Info, ChevronRight as ChevronRightIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock time-series data (last 1h, ~50 points from 08:50 to 09:40)
const timeLabels = Array.from({ length: 51 }, (_, i) => {
  const min = 50 + Math.floor((i * 50) / 51);
  return `${8 + Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`;
});

// Alerts: step-like values 5-6 (green)
const alertsData = timeLabels.map((t, i) => ({
  time: t,
  alerts: i < 15 ? 6 : i < 35 ? 5 : 6,
}));

// Alerts receive rate: Received (yellow) + Invalid (red), ops/s
const alertsRateData = timeLabels.map((_, i) => ({
  time: timeLabels[i],
  received: 0.055 + Math.sin(i / 8) * 0.015 + (i === 25 ? 0.02 : 0),
  invalid: 0.002 + Math.random() * 0.003,
}));

// Notifications: 36 integrations (from Grafana alertmanager-mixin)
const notificationIntegrations = [
  "discord", "email", "incidentio", "jira", "mattermost", "msteams", "msteamsv2", "opsgenie",
  "pagerduty", "slack", "telegram", "webhook", "pushover", "victorops", "sns", "servicenow",
  "kafka", "dingtalk", "wechat", "line", "rocketchat", "hipchat", "bigpanda", "xmatters",
  "twilio", "smtp", "pushbullet", "gotify", "threema", "groupme", "webex", "googlechat",
  "teams", "zendesk", "zulip", "matrix", "oncall", "grafana",
] as const;
const notificationsData = timeLabels.map((t, i) => {
  const base: Record<string, number | string> = { time: t };
  notificationIntegrations.forEach((int, j) => {
    base[`${int}Total`] = 60 + Math.sin((i + j * 10) / 5) * 20 + Math.random() * 5;
    base[`${int}Failed`] = Math.max(0, 2 + Math.random() * 4);
  });
  return base;
});

const CHART_COLORS = {
  green: "hsl(142, 76%, 36%)",
  yellow: "hsl(45, 93%, 47%)",
  red: "hsl(0, 84%, 60%)",
  blue: "hsl(217, 91%, 60%)",
  purple: "hsl(262, 83%, 58%)",
  orange: "hsl(25, 95%, 53%)",
};

export default function AlertmanagerOverview() {
  const [alertsOpen, setAlertsOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(true);

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/admin/dashboard" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/admin/dashboard" className="hover:text-foreground transition-colors">
          Dashboards
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Alertmanager / Overview</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            Export <ChevronDown className="h-3 w-3" />
          </Button>
          <Button size="sm" className="gap-1">
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-lg border border-border bg-muted/30">
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium">
          <option>Data Source: Prometheus</option>
        </select>
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option>namespace: monitoring</option>
        </select>
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option>service: monitoring-kube-prometheus-alertmanager</option>
        </select>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="gap-1 min-w-[140px]">
            Last 1 hour UTC <ChevronDown className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" /> Refresh <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Collapsible open={alertsOpen} onOpenChange={setAlertsOpen}>
        <section className="space-y-4">
          <div className="flex items-center gap-2 w-full">
            <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left py-1 rounded hover:bg-muted/50 transition-colors">
              <ChevronRightIcon className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ${alertsOpen ? "rotate-90" : ""}`} />
              <h2 className="text-lg font-semibold text-foreground">Alerts</h2>
              <span className="text-sm text-muted-foreground">(2 panels)</span>
            </CollapsibleTrigger>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" title="Current set of alerts stored in the Alertmanager">
              <Info className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          <CollapsibleContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-7">
          <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
            <div className="px-4 py-2 border-b border-border bg-muted/20">
              <h3 className="text-sm font-medium text-foreground">Alerts</h3>
              <p className="text-xs text-muted-foreground">Current set of alerts stored in the Alertmanager</p>
            </div>
            <div className="p-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={alertsData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="alertsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[4, 7]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="stepAfter"
                    dataKey="alerts"
                    stroke={CHART_COLORS.green}
                    fill="url(#alertsGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
            <div className="px-4 py-2 border-b border-border bg-muted/20">
              <h3 className="text-sm font-medium text-foreground">Alerts receive rate</h3>
              <p className="text-xs text-muted-foreground">Rate of successful and invalid alerts received by the Alertmanager</p>
            </div>
            <div className="p-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={alertsRateData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 0.1]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" unit=" ops/s" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    formatter={(value: number) => [value.toFixed(4) + " ops/s", ""]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="received" stroke="hsl(45, 93%, 47%)" strokeWidth={2} name="Received" dot={false} />
                  <Line type="monotone" dataKey="invalid" stroke="hsl(0, 84%, 60%)" strokeWidth={2} name="Invalid" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
          </CollapsibleContent>
        </section>
      </Collapsible>

      <Collapsible open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <section className="space-y-4">
          <div className="flex items-center gap-2 w-full">
            <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left py-1 rounded hover:bg-muted/50 transition-colors">
              <ChevronRightIcon className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ${notificationsOpen ? "rotate-90" : ""}`} />
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
              <span className="text-sm text-muted-foreground">(36 panels)</span>
            </CollapsibleTrigger>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" title="Rate of notifications sent by the Alertmanager">
              <Info className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          <CollapsibleContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pl-7">
          {notificationIntegrations.map((int, idx) => (
            <div key={int} className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
              <div className="px-4 py-2 border-b border-border bg-muted/20">
                <h3 className="text-sm font-medium text-foreground truncate" title={`${int}: Notifications Send Rate`}>
                  {int}: Notifications Send Rate
                </h3>
                <p className="text-xs text-muted-foreground">Rate of successful and invalid notifications sent</p>
              </div>
              <div className="p-4 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={notificationsData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={[0, 120]} tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" unit=" ops/s" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={`${int}Total`}
                      stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                      strokeWidth={2}
                      name="Total"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey={`${int}Failed`}
                      stroke="hsl(0, 84%, 60%)"
                      strokeWidth={2}
                      name="Failed"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
          </CollapsibleContent>
        </section>
      </Collapsible>
    </div>
  );
}
