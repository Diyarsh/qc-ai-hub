import { AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const memoryData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  heap: 2000 + Math.random() * 500,
  nonHeap: 500 + Math.random() * 200,
}));

const cpuData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  usage: 30 + Math.random() * 40,
}));

const threadData = [
  { name: "RUNNABLE", value: 45 },
  { name: "WAITING", value: 20 },
  { name: "BLOCKED", value: 5 },
  { name: "TIMED_WAITING", value: 30 },
];

const httpData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  requests: Math.floor(100 + Math.random() * 200),
}));

const responseTimeData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  p50: 50 + Math.random() * 20,
  p75: 80 + Math.random() * 30,
  p95: 150 + Math.random() * 50,
  p99: 250 + Math.random() * 100,
}));

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

export function Metrics() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="font-semibold">JVM Memory</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={memoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="heap" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
              <Area type="monotone" dataKey="nonHeap" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">CPU Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cpuData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="usage" stroke="#ec4899" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Thread States</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={threadData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {threadData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">HTTP Requests/sec</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={httpData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requests" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Response Times (Percentiles)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={responseTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="p50" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="p75" stroke="#8b5cf6" strokeWidth={2} />
            <Line type="monotone" dataKey="p95" stroke="#ec4899" strokeWidth={2} />
            <Line type="monotone" dataKey="p99" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

