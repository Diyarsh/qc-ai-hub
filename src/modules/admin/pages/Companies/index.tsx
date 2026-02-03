import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Users, Plus, Search, Edit, Trash2, Mail, Phone, Globe, MapPin } from "lucide-react";
import { Badge } from "@/shared/components/Badge";

interface Company {
  id: number;
  name: string;
  code: string;
  industry: string;
  employeesCount: number;
  contactPerson: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  status: "active" | "inactive";
  createdAt: string;
}

const mockCompanies: Company[] = [
  { id: 1, name: "ООО ТехноСофт", code: "TECHNO001", industry: "IT", employeesCount: 150, contactPerson: "Иван Петров", email: "info@technosoft.kz", phone: "+7 (727) 123-45-67", website: "www.technosoft.kz", address: "г. Алматы, ул. Абая, 150", status: "active", createdAt: "2023-01-15" },
  { id: 2, name: "ТОО Аналитика Плюс", code: "ANALYTICS001", industry: "Консалтинг", employeesCount: 45, contactPerson: "Мария Сидорова", email: "contact@analytics.kz", phone: "+7 (727) 234-56-78", website: "www.analytics.kz", status: "active", createdAt: "2023-03-20" },
  { id: 3, name: "АО Финанс Групп", code: "FINANCE001", industry: "Финансы", employeesCount: 200, contactPerson: "Алексей Козлов", email: "info@finance.kz", phone: "+7 (717) 345-67-89", address: "г. Астана, пр. Кабанбай батыра, 12", status: "active", createdAt: "2023-02-10" },
  { id: 4, name: "ИП Маркетинг Про", code: "MARKET001", industry: "Маркетинг", employeesCount: 30, contactPerson: "Елена Волкова", email: "hello@marketing.kz", status: "active", createdAt: "2023-04-05" },
  { id: 5, name: "ТОО Логистика Сервис", code: "LOGISTICS001", industry: "Логистика", employeesCount: 80, contactPerson: "Дмитрий Новиков", email: "info@logistics.kz", phone: "+7 (727) 456-78-90", address: "г. Алматы, ул. Сатпаева, 30", status: "inactive", createdAt: "2023-05-12" },
];

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setCompanies(companies.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Компании</h1>
          <p className="text-muted-foreground mt-1">Управление компаниями-клиентами</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить компанию
        </Button>
      </div>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию, коду, контактному лицу или отрасли..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="flex items-start justify-between p-5 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">{company.name}</h3>
                    <Badge variant={company.status === "active" ? "success" : "default"} className="text-xs">
                      {company.status === "active" ? "Активна" : "Неактивна"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">#{company.code}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">Отрасль:</span>
                      <span className="text-muted-foreground">{company.industry}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">Сотрудников:</span>
                      <span className="text-muted-foreground">{company.employeesCount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">Контактное лицо:</span>
                      <span className="text-muted-foreground">{company.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{company.email}</span>
                    </div>
                    {company.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{company.phone}</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{company.website}</span>
                      </div>
                    )}
                    {company.address && (
                      <div className="flex items-center gap-2 text-sm md:col-span-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{company.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Редактировать
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(company.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-foreground">Всего компаний</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{companies.length}</p>
        </Card>
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold text-foreground">Активных</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {companies.filter(c => c.status === "active").length}
          </p>
        </Card>
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold text-foreground">Всего сотрудников</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {companies.reduce((sum, c) => sum + c.employeesCount, 0)}
          </p>
        </Card>
      </div>
    </div>
  );
}
