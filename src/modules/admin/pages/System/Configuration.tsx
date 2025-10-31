import { DataTable, Column } from "@/shared/components/Table/DataTable";

interface ConfigProperty {
  source: string;
  key: string;
  value: string;
}

const mockConfig: ConfigProperty[] = [
  { source: "application.yml", key: "server.port", value: "8080" },
  { source: "application.yml", key: "spring.datasource.url", value: "jdbc:postgresql://localhost:5432/qcaihub" },
  { source: "application.yml", key: "jwt.secret", value: "***" },
  { source: "application.yml", key: "consul.host", value: "localhost:8300" },
  { source: "application-dev.yml", key: "logging.level.root", value: "INFO" },
];

export function Configuration() {
  const columns: Column<ConfigProperty>[] = [
    { key: "source", label: "Property Source", sortable: true },
    { key: "key", label: "Key", sortable: true },
    { key: "value", label: "Value" },
  ];

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={mockConfig} />
    </div>
  );
}

