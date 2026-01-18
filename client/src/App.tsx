import { useAuth } from '@/context/AuthContext';
import { ResourceTree } from '@/components/ResourceTree';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

function App() {
  const { isDetecting, isLoading, isSuccess, isError } = useAuth();

  // Определение платформы Telegram
  if (isDetecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Wifi className="size-8 text-muted-foreground animate-pulse mb-4" />
        <p className="text-muted-foreground text-sm">
          Подключение к Telegram...
        </p>
      </div>
    );
  }

  // Загрузка данных пользователя
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Spinner className="size-8 mb-4" />
        <p className="text-muted-foreground text-sm">
          Авторизация...
        </p>
      </div>
    );
  }

  // Ошибка авторизации
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Alert variant="destructive" className="max-w-sm">
          <AlertCircle className="size-4" />
          <AlertTitle>Ошибка авторизации</AlertTitle>
          <AlertDescription>
            <WifiOff className="size-4 inline mr-1" />
            Не удалось авторизоваться. Пожалуйста, откройте приложение через Telegram.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Успешная авторизация
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 bg-background border-b px-4 py-3">
          <h1 className="text-lg font-semibold text-center">
            Бронирование переговорных
          </h1>
        </header>
        <main>
          <ResourceTree />
        </main>
      </div>
    );
  }

  // Fallback состояние
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <p className="text-muted-foreground text-sm">
        Загрузка приложения...
      </p>
    </div>
  );
}

export default App;
