import { useState, useEffect } from "react";
import { Modal } from "@/shared/components/Modal";
import { Input } from "@/shared/components/Forms/Input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/shared/components/Badge";
import { User } from "./mockData";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: Partial<User> & { id?: number }) => void;
  user?: User | null;
}

const AVAILABLE_ROLES = ["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"];

export function UserForm({ isOpen, onClose, onSubmit, user }: UserFormProps) {
  const isEdit = !!user;
  const [formData, setFormData] = useState({
    login: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    roles: [] as string[],
    activated: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        login: user.login,
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        password: "",
        roles: [...user.roles],
        activated: user.activated,
      });
    } else {
      setFormData({
        login: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        roles: [],
        activated: true,
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.login.trim()) {
      newErrors.login = "Логин обязателен";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Некорректный email";
    }
    if (!isEdit && !formData.password) {
      newErrors.password = "Пароль обязателен при создании";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData: Partial<User> & { id?: number } = {
      login: formData.login.trim(),
      email: formData.email.trim(),
      firstName: formData.firstName.trim() || undefined,
      lastName: formData.lastName.trim() || undefined,
      roles: formData.roles,
      activated: formData.activated,
    };

    if (isEdit && user) {
      submitData.id = user.id;
    }
    if (formData.password) {
      (submitData as any).password = formData.password;
    }

    onSubmit(submitData);
  };

  const toggleRole = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Редактировать пользователя" : "Создать пользователя"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Логин *"
            value={formData.login}
            onChange={(e) => setFormData({ ...formData, login: e.target.value })}
            error={errors.login}
            required
          />
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Имя"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          <Input
            label="Фамилия"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>

        <Input
          label={isEdit ? "Новый пароль (оставьте пустым чтобы не менять)" : "Пароль *"}
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          required={!isEdit}
        />

        <div className="space-y-2">
          <Label>Роли *</Label>
          <div className="flex flex-wrap gap-2 p-3 border border-border rounded-md bg-muted/30">
            {AVAILABLE_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  formData.roles.includes(role)
                    ? "bg-blue-600 text-white"
                    : "bg-card border border-border hover:bg-muted text-foreground"
                }`}
              >
                {role.replace("ROLE_", "")}
              </button>
            ))}
          </div>
          {formData.roles.length === 0 && errors.roles && (
            <p className="text-sm text-red-500">Выберите хотя бы одну роль</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Switch
            checked={formData.activated}
            onCheckedChange={(checked) => setFormData({ ...formData, activated: checked })}
          />
          <Label>Активирован</Label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Отменить
          </Button>
          <Button type="submit">{isEdit ? "Сохранить" : "Создать"}</Button>
        </div>
      </form>
    </Modal>
  );
}

