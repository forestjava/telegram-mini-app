import type { Resource } from '@/types/resource';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: Resource | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  resource,
  onConfirm,
  isDeleting,
}: DeleteConfirmDialogProps) {
  if (!resource) return null;

  const hasChildren = resource.children && resource.children.length > 0;

  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить ресурс?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы собираетесь удалить <strong>«{resource.title}»</strong>.
            {hasChildren && (
              <>
                <br />
                <span className="text-destructive font-medium">
                  Внимание: все дочерние ресурсы ({resource.children.length}) также будут удалены!
                </span>
              </>
            )}
            <br />
            Это действие нельзя отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
