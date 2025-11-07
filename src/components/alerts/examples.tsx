/**
 * Примеры использования компонентов алертов
 * Этот файл можно использовать как справочник
 */

import { BannerAlert } from "./BannerAlert";
import { InlineError } from "./InlineError";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/shared/components/Toast";
import { ErrorHandler } from "@/shared/services/errorHandler";

// Пример 1: Banner Alert - Критическая ошибка
export function CriticalBannerExample() {
  return (
    <BannerAlert
      variant="critical"
      title="Не удается подключиться к серверу"
      description="Проверьте подключение к интернету и попробуйте снова."
      action={{
        label: "Повторить",
        onClick: () => window.location.reload(),
      }}
      onClose={() => console.log("Closed")}
    />
  );
}

// Пример 2: Banner Alert - Предупреждение
export function WarningBannerExample() {
  return (
    <BannerAlert
      variant="warning"
      title="Достигнут лимит запросов"
      description="Вы использовали все запросы на сегодня. Лимит обновится завтра."
    />
  );
}

// Пример 3: Banner Alert - Информация
export function InfoBannerExample() {
  return (
    <BannerAlert
      variant="info"
      title="Новая версия доступна"
      description="Обновите приложение для получения новых функций."
      action={{
        label: "Обновить",
        onClick: () => console.log("Update"),
      }}
    />
  );
}

// Пример 4: Inline Error в форме
export function InlineErrorExample() {
  const hasError = true;
  const errorMessage = "Это поле обязательно для заполнения";

  return (
    <div>
      <input className="border rounded p-2" />
      {hasError && <InlineError message={errorMessage} />}
    </div>
  );
}

// Пример 5: Alert Dialog - Подтверждение удаления
export function DeleteConfirmDialogExample() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Удалить</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя отменить. Это навсегда удалит проект и все связанные данные.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={() => console.log("Deleted")}>
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Пример 6: Toast уведомления
export function ToastExamples() {
  const { showToast } = useToast();

  return (
    <div className="space-y-2">
      <Button onClick={() => showToast("Операция выполнена успешно", "success")}>
        Success Toast
      </Button>
      <Button onClick={() => showToast("Произошла ошибка", "error")}>
        Error Toast
      </Button>
      <Button onClick={() => showToast("Предупреждение", "warning")}>
        Warning Toast
      </Button>
      <Button onClick={() => showToast("Информация", "info")}>
        Info Toast
      </Button>
    </div>
  );
}

// Пример 7: Обработка ошибок API
export function ApiErrorHandlingExample() {
  const handleApiCall = async () => {
    try {
      const response = await fetch("/api/data");
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      // Обработка данных
    } catch (error) {
      ErrorHandler.handleApiError(error, "Не удалось загрузить данные");
    }
  };

  return <Button onClick={handleApiCall}>Загрузить данные</Button>;
}

// Пример 8: Alert с действием
export function AlertWithActionExample() {
  return (
    <Alert>
      <AlertTitle>Внимание</AlertTitle>
      <AlertDescription>
        Workflow не сохранен. Сохранить перед выходом?
      </AlertDescription>
      <div className="mt-4 flex gap-2">
        <Button size="sm">Сохранить</Button>
        <Button size="sm" variant="outline">
          Отмена
        </Button>
      </div>
    </Alert>
  );
}

// Пример 9: Loading State с ошибкой
export function LoadingWithErrorExample() {
  const isLoading = false;
  const error = null;
  const data = null;

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Alert variant="destructive">
          <AlertTitle>Ошибка загрузки</AlertTitle>
          <AlertDescription>
            Не удалось загрузить данные. Попробуйте обновить страницу.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Обновить
        </Button>
      </div>
    );
  }

  return <div>{data && "Данные загружены"}</div>;
}


