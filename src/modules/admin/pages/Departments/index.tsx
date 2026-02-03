import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Users, Plus, Search, Edit, Trash2, Mail, Phone } from "lucide-react";
import { Badge } from "@/shared/components/Badge";

interface Department {
  id: number;
  name: string;
  code: string;
  head: string;
  employeesCount: number;
  email: string;
  phone?: string;
  status: "active" | "inactive";
}

const mockDepartments: Department[] = [
  { id: 1, name: "Отдел разработки", code: "DEV", head: "Иван Петров", employeesCount: 25, email: "dev@company.com", phone: "+7 (777) 123-45-67", status: "active" },
  { id: 2, name: "Отдел аналитики", code: "ANALYTICS", head: "Мария Сидорова", employeesCount: 12, email: "analytics@company.com", phone: "+7 (777) 123-45-68", status: "active" },
  { id: 3, name: "Отдел поддержки", code: "SUPPORT", head: "Алексей Козлов", employeesCount: 18, email: "support@company.com", phone: "+7 (777) 123-45-69", status: "active" },
  { id: 4, name: "Отдел маркетинга", code: "MARKETING", head: "Елена Волкова", employeesCount: 15, email: "marketing@company.com", status: "active" },
  { id: 5, name: "Отдел HR", code: "HR", head: "Дмитрий Новиков", employeesCount: 8, email: "hr@company.com", phone: "+7 (777) 123-45-70", status: "active" },
];

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Департаменты</h1>
          <p className="text-muted-foreground mt-1">Управление структурой департаментов компании</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить департамент
        </Button>
      </div>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию, коду или руководителю..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.map((department) => (
            <Card
              key={department.id}
              className="p-5 bg-card border-border hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{department.name}</h3>
                    <p className="text-sm text-muted-foreground">{department.code}</p>
                  </div>
                </div>
                <Badge variant={department.status === "active" ? "success" : "default"} className="text-xs">
                  {department.status === "active" ? "Активен" : "Неактивен"}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">Руководитель:</span>
                  <span className="text-muted-foreground">{department.head}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">Сотрудников:</span>
                  <span className="text-muted-foreground">{department.employeesCount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{department.email}</span>
                </div>
                {department.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{department.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Edit className="h-4 w-4" />
                  Редактировать
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(department.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-foreground">Всего департаментов</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{departments.length}</p>
        </Card>
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold text-foreground">Активных</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {departments.filter(d => d.status === "active").length}
          </p>
        </Card>
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold text-foreground">Всего сотрудников</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {departments.reduce((sum, d) => sum + d.employeesCount, 0)}
          </p>
        </Card>
      </div>
    </div>
  );
}
