import { useState } from 'react';
import { useResources, useCreateBooking, useDeleteBooking } from '@/hooks/useResources';
import { useAuth } from '@/context/AuthContext';
import type { Resource } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Check, X, AlertCircle } from 'lucide-react';

/**
 * Get user initials for avatar fallback
 */
function getUserInitials(firstName: string | null, lastName: string | null, username: string | null): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName.slice(0, 2).toUpperCase();
  }
  if (username) {
    return username.slice(0, 2).toUpperCase();
  }
  return '??';
}

/**
 * Get display name for user
 */
function getUserDisplayName(firstName: string | null, lastName: string | null, username: string | null): string {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (username) {
    return `@${username}`;
  }
  return 'Unknown';
}

interface ResourceItemProps {
  resource: Resource;
  depth: number;
  onBook: (resourceId: number) => void;
  onUnbook: (resourceId: number) => void;
  processingResourceId: number | null;
  isBookingInProgress: boolean;
  isUnbookingInProgress: boolean;
}

function ResourceItem({
  resource,
  depth,
  onBook,
  onUnbook,
  processingResourceId,
  isBookingInProgress,
  isUnbookingInProgress,
}: ResourceItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = resource.children.length > 0;
  const isBooked = !!resource.booking;
  const { user: currentUser } = useAuth();
  const isOwnBooking = isBooked && resource.booking?.user.id === currentUser?.id;
  const isLeaf = !hasChildren;
  
  const isThisResourceProcessing = processingResourceId === resource.id;
  const isBooking = isBookingInProgress && isThisResourceProcessing;
  const isUnbooking = isUnbookingInProgress && isThisResourceProcessing;
  const isProcessing = isBooking || isUnbooking;

  // Контент для родительских узлов (не листовые)
  const parentContent = (
    <div className="flex items-center gap-2 py-2 px-3 rounded-lg transition-colors">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="size-6 p-0">
          {isOpen ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <span className="flex-1 font-medium text-sm">{resource.title}</span>
    </div>
  );

  // Контент для листовых узлов (комнаты) - адаптивная компоновка с flex-wrap
  const leafContent = (
    <div
      className={`
        flex flex-wrap items-center gap-x-6 gap-y-2 py-2 px-3 rounded-lg transition-colors border
        ${isBooked ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900' : ''}
        ${!isBooked ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900' : ''}
      `}
    >
      {/* Название ресурса */}
      <div className="font-medium text-sm">{resource.title}</div>
      
      {isBooked ? (
        <>
          {/* Аватар и имя - переносятся как группа */}
          <div className="flex items-center gap-2">
            <Avatar className="size-6 shrink-0">
              <AvatarImage src={resource.booking?.user.photoUrl ?? undefined} />
              <AvatarFallback className="text-xs">
                {getUserInitials(
                  resource.booking?.user.firstName ?? null,
                  resource.booking?.user.lastName ?? null,
                  resource.booking?.user.username ?? null
                )}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {getUserDisplayName(
                resource.booking?.user.firstName ?? null,
                resource.booking?.user.lastName ?? null,
                resource.booking?.user.username ?? null
              )}
            </span>
          </div>
          {/* Статус и кнопка - переносятся как группа */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Занято
            </Badge>
            {isOwnBooking && (
              <Button
                variant="destructive"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onUnbook(resource.id)}
                disabled={isProcessing}
              >
                {isUnbooking ? <Spinner className="size-3" /> : <X className="size-3" />}
                Освободить
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <Badge variant="outline" className="text-xs text-green-600 border-green-300">
            Свободно
          </Badge>
          <Button
            variant="default"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onBook(resource.id)}
            disabled={isProcessing}
          >
            {isBooking ? <Spinner className="size-3" /> : <Check className="size-3" />}
            Забронировать
          </Button>
        </>
      )}
    </div>
  );

  const content = isLeaf ? leafContent : parentContent;

  if (!hasChildren) {
    return <div className="ml-1">{content}</div>;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      {content}
      <CollapsibleContent>
        <div className="ml-4 mt-1 space-y-1 border-l-2 border-muted pl-2">
          {resource.children.map((child) => (
            <ResourceItem
              key={child.id}
              resource={child}
              depth={depth + 1}
              onBook={onBook}
              onUnbook={onUnbook}
              processingResourceId={processingResourceId}
              isBookingInProgress={isBookingInProgress}
              isUnbookingInProgress={isUnbookingInProgress}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ResourceTreeSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="ml-6 space-y-2">
            {[1, 2].map((j) => (
              <div key={j} className="flex items-center gap-2">
                <Skeleton className="size-6" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ResourceTree() {
  const { data: resources, isLoading, isError, error, refetch } = useResources();
  const createBooking = useCreateBooking();
  const deleteBooking = useDeleteBooking();

  const [processingResourceId, setProcessingResourceId] = useState<number | null>(null);

  const handleBook = async (resourceId: number) => {
    setProcessingResourceId(resourceId);
    try {
      await createBooking.mutateAsync({ resourceId });
    } catch {
      // Error handled by mutation
    } finally {
      setProcessingResourceId(null);
    }
  };

  const handleUnbook = async (resourceId: number) => {
    setProcessingResourceId(resourceId);
    try {
      await deleteBooking.mutateAsync(resourceId);
    } catch {
      // Error handled by mutation
    } finally {
      setProcessingResourceId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <ResourceTreeSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Ошибка загрузки</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Не удалось загрузить ресурсы'}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => refetch()}
            >
              Повторить
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Нет доступных ресурсов для бронирования
      </div>
    );
  }

  const mutationError = createBooking.error || deleteBooking.error;

  return (
    <div className="p-4 space-y-4">
      {mutationError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>
            {mutationError instanceof Error
              ? mutationError.message
              : 'Не удалось выполнить операцию'}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        {resources.map((resource) => (
          <ResourceItem
            key={resource.id}
            resource={resource}
            depth={0}
            onBook={handleBook}
            onUnbook={handleUnbook}
            processingResourceId={processingResourceId}
            isBookingInProgress={createBooking.isPending}
            isUnbookingInProgress={deleteBooking.isPending}
          />
        ))}
      </div>
    </div>
  );
}
