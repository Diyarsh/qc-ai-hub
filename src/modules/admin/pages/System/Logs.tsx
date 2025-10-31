import { useState, useMemo } from "react";
import { Select } from "@/shared/components/Forms/Select";
import { Input } from "@/shared/components/Forms/Input";
import { Badge } from "@/shared/components/Badge";
import { DataTable, Column } from "@/shared/components/Table/DataTable";

type LogLevel = "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "OFF";

interface Logger {
  name: string;
  level: LogLevel;
}

const mockLoggers: Logger[] = [
  { name: "org.springframework", level: "INFO" },
  { name: "org.springframework.web", level: "DEBUG" },
  { name: "org.springframework.security", level: "WARN" },
  { name: "com.qcaihub", level: "DEBUG" },
  { name: "com.qcaihub.admin", level: "INFO" },
  { name: "org.hibernate", level: "WARN" },
  { name: "org.hibernate.SQL", level: "DEBUG" },
  { name: "org.apache.catalina", level: "INFO" },
  { name: "io.netty", level: "WARN" },
];

const LEVELS: { value: LogLevel; label: string }[] = [
  { value: "TRACE", label: "TRACE" },
  { value: "DEBUG", label: "DEBUG" },
  { value: "INFO", label: "INFO" },
  { value: "WARN", label: "WARN" },
  { value: "ERROR", label: "ERROR" },
  { value: "OFF", label: "OFF" },
];

export function Logs() {
  const [loggers, setLoggers] = useState<Logger[]>(mockLoggers);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLoggers = useMemo(() => {
    return loggers.filter((logger) =>
      logger.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [loggers, searchQuery]);

  const handleLevelChange = (loggerName: string, newLevel: LogLevel) => {
    setLoggers(
      loggers.map((l) => (l.name === loggerName ? { ...l, level: newLevel } : l))
    );
  };

  const columns: Column<Logger>[] = [
    { key: "name", label: "Logger Name", sortable: true },
    {
      key: "level",
      label: "Current Level",
      render: (_, row) => (
        <Select
          value={row.level}
          onChange={(e) => handleLevelChange(row.name, e.target.value as LogLevel)}
          options={LEVELS}
          className="w-32"
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Input
        placeholder="Фильтр по имени логгера..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <DataTable columns={columns} data={filteredLoggers} />
    </div>
  );
}

