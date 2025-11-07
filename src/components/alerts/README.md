# Компоненты алертов и ошибок

Система компонентов для отображения уведомлений, ошибок и предупреждений в AI Hub.

## Компоненты

### 1. BannerAlert

Баннеры для важных сообщений, которые должны быть видны постоянно.

```tsx
import { BannerAlert } from "@/components/alerts";

<BannerAlert
  variant="critical" // "critical" | "warning" | "info"
  title="Не удается подключиться к серверу"
  description="Проверьте подключение к интернету"
  action={{
    label: "Повторить",
    onClick: () => window.location.reload(),
  }}
  onClose={() => console.log("Closed")}
/>
```

### 2. InlineError

Встроенные ошибки для форм валидации.

```tsx
import { InlineError } from "@/components/alerts";

<input {...register("email")} />
{errors.email && <InlineError message={errors.email.message} />}
```

### 3. ErrorFallback

Компонент для ErrorBoundary при критических ошибках.

```tsx
import { ErrorFallback } from "@/components/alerts";

<ErrorBoundary fallback={ErrorFallback}>
  {children}
</ErrorBoundary>
```

### 4. Toast (улучшенный)

Всплывающие уведомления (уже реализован в `src/shared/components/Toast.tsx`).

```tsx
import { useToast } from "@/shared/components/Toast";

const { showToast } = useToast();
showToast("Операция выполнена", "success");
```

### 5. Alert (shadcn/ui)

Базовый компонент Alert для различных сообщений.

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Ошибка</AlertTitle>
  <AlertDescription>Описание ошибки</AlertDescription>
</Alert>
```

### 6. AlertDialog (shadcn/ui)

Диалоги подтверждения для критических действий.

```tsx
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

<AlertDialog>
  <AlertDialogTrigger>Удалить</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
      <AlertDialogDescription>
        Это действие нельзя отменить.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Отмена</AlertDialogCancel>
      <AlertDialogAction>Удалить</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## ErrorHandler

Централизованная обработка ошибок.

```tsx
import { ErrorHandler } from "@/shared/services/errorHandler";

// Обработка любой ошибки
try {
  await apiCall();
} catch (error) {
  ErrorHandler.handle(error, "API Call");
}

// Обработка ошибок API
ErrorHandler.handleApiError(error, "Не удалось загрузить данные");

// Создание кастомной ошибки
const error = ErrorHandler.createError(
  ErrorType.NETWORK,
  "Проблемы с подключением"
);
```

## Примеры использования

См. файл `src/components/alerts/examples.tsx` для полных примеров всех компонентов.

## Рекомендации

1. **Toast** - для кратких уведомлений о действиях
2. **BannerAlert** - для важных системных сообщений
3. **InlineError** - для ошибок валидации в формах
4. **AlertDialog** - для подтверждения критических действий
5. **ErrorPanel** - для детальных ошибок в Laboratory
6. **ErrorBoundary** - для критических ошибок React


