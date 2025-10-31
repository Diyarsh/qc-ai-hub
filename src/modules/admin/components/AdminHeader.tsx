export function AdminHeader() {
  return (
    <header className="h-16 bg-gray-800 text-white flex items-center px-8 border-b border-gray-900 justify-between">
      <div className="font-bold text-lg">QC AI-HUB Admin</div>
      <div className="flex items-center gap-6">
        {/* todo: добавить имя пользователя */}
        <div className="rounded-full bg-blue-600 text-white px-3 py-1 font-medium">ADMIN</div>
        <button className="rounded hover:bg-gray-700 px-3 py-1">Настройки</button>
        <button className="rounded hover:bg-gray-700 px-3 py-1">Выйти</button>
      </div>
    </header>
  );
}
