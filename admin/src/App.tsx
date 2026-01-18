import { useState, useEffect, useCallback } from 'react';
import type { Resource } from '@/types/resource';
import { fetchResources, createResource, updateResource, deleteResource } from '@/api/resources';
import { ResourceTree } from '@/components/ResourceTree';
import { ResourceDialog } from '@/components/ResourceDialog';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import './App.css';

function App() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [parentIdForCreate, setParentIdForCreate] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadResources = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchResources();
      setResources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleAddRoot = () => {
    setEditingResource(null);
    setParentIdForCreate(null);
    setDialogOpen(true);
  };

  const handleAddChild = (parentId: number) => {
    setEditingResource(null);
    setParentIdForCreate(parentId);
    setDialogOpen(true);
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setParentIdForCreate(null);
    setDialogOpen(true);
  };

  const handleDeleteClick = (resource: Resource) => {
    setResourceToDelete(resource);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (data: { title: string; parentId?: number }) => {
    setIsSubmitting(true);
    try {
      if (editingResource) {
        await updateResource(editingResource.id, { title: data.title });
      } else {
        await createResource(data);
      }
      await loadResources();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!resourceToDelete) return;
    setIsDeleting(true);
    try {
      await deleteResource(resourceToDelete.id);
      await loadResources();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления');
    } finally {
      setIsDeleting(false);
      setResourceToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Управление ресурсами</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Иерархический редактор ресурсов для бронирования
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[600px] px-4 py-6">
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-4 text-destructive">
            {error}
            <button
              className="ml-4 underline hover:no-underline"
              onClick={() => setError(null)}
            >
              Закрыть
            </button>
          </div>
        )}

        <ResourceTree
          resources={resources}
          isLoading={isLoading}
          onRefresh={loadResources}
          onAddRoot={handleAddRoot}
          onAddChild={handleAddChild}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </main>

      <ResourceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        resource={editingResource}
        parentId={parentIdForCreate}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        resource={resourceToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default App;
