import { useState, useMemo } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { DataTable, Column } from "@/shared/components/Table/DataTable";
import { Pagination } from "@/shared/components/Table/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/Forms/Input";
import { Badge } from "@/shared/components/Badge";
import { Modal } from "@/shared/components/Modal";
import { useToast } from "@/shared/components/Toast";
import { User } from "./mockData";
import { UserForm } from "./UserForm";

interface UserListProps {
  users: User[];
  onUserCreate: (user: Partial<User> & { id?: number }) => void;
  onUserUpdate: (user: Partial<User> & { id?: number }) => void;
  onUserDelete: (id: number) => void;
}

export function UserList({ users, onUserCreate, onUserUpdate, onUserDelete }: UserListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const { showToast } = useToast();
  const pageSize = 10;

  const availableRoles = ["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.login.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter.length === 0 ||
        roleFilter.some((role) => user.roles.includes(role));

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  const handleCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user: User) => {
    setDeleteConfirm({ isOpen: true, user });
  };

  const confirmDelete = () => {
    if (deleteConfirm.user) {
      onUserDelete(deleteConfirm.user.id);
      showToast("Пользователь удален", "success");
      setDeleteConfirm({ isOpen: false, user: null });
    }
  };

  const handleFormSubmit = (userData: Partial<User> & { id?: number }) => {
    if (editingUser) {
      onUserUpdate(userData);
      showToast("Пользователь обновлен", "success");
    } else {
      onUserCreate(userData);
      showToast("Пользователь создан", "success");
    }
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns: Column<User>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
    },
    {
      key: "login",
      label: "Логин",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "firstName",
      label: "Имя",
      render: (_, row) => `${row.firstName || ""} ${row.lastName || ""}`.trim() || "—",
    },
    {
      key: "roles",
      label: "Роли",
      render: (_, row) => (
        <div className="flex flex-wrap gap-1">
          {row.roles.map((role) => (
            <Badge
              key={role}
              variant={
                role === "ROLE_SUPER_ADMIN"
                  ? "error"
                  : role === "ROLE_ADMIN"
                  ? "warning"
                  : "default"
              }
            >
              {role.replace("ROLE_", "")}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "activated",
      label: "Статус",
      render: (_, row) => (
        <Badge variant={row.activated ? "success" : "error"}>
          {row.activated ? "Активирован" : "Неактивен"}
        </Badge>
      ),
    },
    {
      key: "createdDate",
      label: "Создан",
      sortable: true,
      render: (value) => formatDate(value as string),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Пользователи</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Создать пользователя
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по логину, email или имени..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {availableRoles.map((role) => (
            <Button
              key={role}
              variant={roleFilter.includes(role) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setRoleFilter((prev) =>
                  prev.includes(role)
                    ? prev.filter((r) => r !== role)
                    : [...prev, role]
                );
                setCurrentPage(1);
              }}
            >
              {role.replace("ROLE_", "")}
            </Button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedUsers}
        actions={(row) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </>
        )}
        emptyMessage="Пользователи не найдены"
      />

      {filteredUsers.length > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredUsers.length / pageSize)}
          totalElements={filteredUsers.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      <UserForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleFormSubmit}
        user={editingUser}
      />

      <Modal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, user: null })}
        title="Подтверждение удаления"
        size="sm"
      >
        <div className="space-y-4">
          <p>
            Вы уверены, что хотите удалить пользователя{" "}
            <strong>{deleteConfirm.user?.login}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ isOpen: false, user: null })}
            >
              Отменить
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Удалить
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

