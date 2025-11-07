import { showToast } from "@/shared/components/Toast";

export enum ErrorType {
  NETWORK = "network",
  VALIDATION = "validation",
  AUTH = "auth",
  SERVER = "server",
  PERMISSION = "permission",
  NOT_FOUND = "not_found",
  UNKNOWN = "unknown",
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  originalError?: Error;
}

const errorMessages: Record<ErrorType, string> = {
  [ErrorType.NETWORK]: "Ошибка подключения. Проверьте интернет-соединение",
  [ErrorType.VALIDATION]: "Ошибка валидации данных",
  [ErrorType.AUTH]: "Ошибка аутентификации. Войдите снова",
  [ErrorType.SERVER]: "Ошибка сервера. Попробуйте позже",
  [ErrorType.PERMISSION]: "Недостаточно прав для выполнения действия",
  [ErrorType.NOT_FOUND]: "Запрашиваемый ресурс не найден",
  [ErrorType.UNKNOWN]: "Произошла неизвестная ошибка",
};

export class ErrorHandler {
  /**
   * Обработка ошибки с показом пользователю
   */
  static handle(error: Error | AppError, context?: string): void {
    // Логирование
    const logContext = context ? `[${context}]` : "";
    console.error(`${logContext} Error:`, error);

    // Определение типа ошибки
    const appError = this.normalizeError(error);

    // Получение понятного сообщения
    const userMessage = this.getUserFriendlyMessage(appError);

    // Показ пользователю
    showToast(userMessage, "error");

    // TODO: Отправка в систему мониторинга (Sentry, etc.)
    // this.reportToMonitoring(appError);
  }

  /**
   * Нормализация ошибки в AppError
   */
  static normalizeError(error: Error | AppError): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    // Определение типа по сообщению или коду
    const type = this.detectErrorType(error);

    return {
      type,
      message: error.message,
      originalError: error,
    };
  }

  /**
   * Определение типа ошибки
   */
  static detectErrorType(error: Error | any): ErrorType {
    // Проверка на сетевые ошибки
    if (
      error.message?.toLowerCase().includes("network") ||
      error.message?.toLowerCase().includes("fetch") ||
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED"
    ) {
      return ErrorType.NETWORK;
    }

    // Проверка на ошибки аутентификации
    if (
      error.response?.status === 401 ||
      error.message?.toLowerCase().includes("unauthorized") ||
      error.message?.toLowerCase().includes("auth")
    ) {
      return ErrorType.AUTH;
    }

    // Проверка на ошибки прав доступа
    if (
      error.response?.status === 403 ||
      error.message?.toLowerCase().includes("permission") ||
      error.message?.toLowerCase().includes("forbidden")
    ) {
      return ErrorType.PERMISSION;
    }

    // Проверка на 404
    if (
      error.response?.status === 404 ||
      error.message?.toLowerCase().includes("not found")
    ) {
      return ErrorType.NOT_FOUND;
    }

    // Проверка на серверные ошибки
    if (
      error.response?.status >= 500 ||
      error.message?.toLowerCase().includes("server")
    ) {
      return ErrorType.SERVER;
    }

    // Проверка на ошибки валидации
    if (
      error.response?.status === 400 ||
      error.message?.toLowerCase().includes("validation") ||
      error.message?.toLowerCase().includes("invalid")
    ) {
      return ErrorType.VALIDATION;
    }

    return ErrorType.UNKNOWN;
  }

  /**
   * Получение понятного сообщения для пользователя
   */
  static getUserFriendlyMessage(error: AppError): string {
    // Если есть кастомное сообщение, используем его
    if (error.message && !error.originalError) {
      return error.message;
    }

    // Базовое сообщение по типу
    const baseMessage = errorMessages[error.type];

    // Дополнительные детали из оригинальной ошибки
    if (error.originalError) {
      const originalMessage = error.originalError.message;

      // Если сообщение уже понятное, используем его
      if (
        originalMessage &&
        !originalMessage.includes("Error") &&
        !originalMessage.includes("Failed")
      ) {
        return originalMessage;
      }
    }

    return baseMessage;
  }

  /**
   * Проверка, является ли ошибка AppError
   */
  static isAppError(error: any): error is AppError {
    return error && typeof error === "object" && "type" in error;
  }

  /**
   * Создание AppError из различных источников
   */
  static createError(
    type: ErrorType,
    message: string,
    details?: any
  ): AppError {
    return {
      type,
      message,
      details,
    };
  }

  /**
   * Обработка ошибок API запросов
   */
  static handleApiError(error: any, defaultMessage?: string): void {
    const appError = this.normalizeError(error);

    if (defaultMessage) {
      appError.message = defaultMessage;
    }

    this.handle(appError, "API");
  }

  /**
   * Обработка ошибок валидации форм
   */
  static handleValidationError(field: string, message: string): AppError {
    return this.createError(ErrorType.VALIDATION, `${field}: ${message}`);
  }
}

