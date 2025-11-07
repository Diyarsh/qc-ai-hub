import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Bug } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorFallbackProps {
  error: Error;
  onRetry?: () => void;
  onReport?: () => void;
}

export function ErrorFallback({ error, onRetry, onReport }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle>Произошла ошибка</CardTitle>
          </div>
          <CardDescription>
            Приложение столкнулось с неожиданной ошибкой
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-mono text-muted-foreground break-all">
              {error.message || "Неизвестная ошибка"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Перезагрузить страницу
              </Button>
            )}
            {onReport && (
              <Button variant="outline" onClick={onReport} className="flex-1">
                <Bug className="h-4 w-4 mr-2" />
                Сообщить об ошибке
              </Button>
            )}
            {!onRetry && (
              <Button
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Перезагрузить страницу
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


