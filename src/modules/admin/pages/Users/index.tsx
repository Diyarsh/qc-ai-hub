import { useState } from "react";
import { UserList } from "./UserList";
import { mockUsers, User } from "./mockData";

export default function Users() {
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handleCreate = (userData: Partial<User> & { id?: number }) => {
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      login: userData.login!,
      email: userData.email!,
      firstName: userData.firstName,
      lastName: userData.lastName,
      roles: userData.roles || [],
      activated: userData.activated ?? true,
      createdDate: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
  };

  const handleUpdate = (userData: Partial<User> & { id?: number }) => {
    setUsers(
      users.map((u) =>
        u.id === userData.id ? { ...u, ...userData } : u
      )
    );
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <UserList
      users={users}
      onUserCreate={handleCreate}
      onUserUpdate={handleUpdate}
      onUserDelete={handleDelete}
    />
  );
}

