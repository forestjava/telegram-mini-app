import { useState, useEffect } from 'react';
import type { Resource } from '@/types/resource';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: Resource | null; // null for create, Resource for edit
  parentId: string | null; // for create with parent
  onSubmit: (data: { title: string; parentId?: string }) => Promise<void>;
  isSubmitting: boolean;
}

export function ResourceDialog({
  open,
  onOpenChange,
  resource,
  parentId,
  onSubmit,
  isSubmitting,
}: ResourceDialogProps) {
  const [title, setTitle] = useState('');

  const isEditing = resource !== null;

  useEffect(() => {
    if (open) {
      setTitle(resource?.title ?? '');
    }
  }, [open, resource]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const data: { title: string; parentId?: string } = { title: title.trim() };
    if (!isEditing && parentId) {
      data.parentId = parentId;
    }

    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Редактировать ресурс' : 'Создать ресурс'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Измените название ресурса.'
                : parentId
                  ? 'Создайте дочерний ресурс.'
                  : 'Создайте новый корневой ресурс.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название..."
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={!title.trim() || isSubmitting}>
              {isSubmitting ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
