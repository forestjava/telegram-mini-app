import type { Resource } from '@/types/resource';
import { ResourceItem } from './ResourceItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, TreeDeciduous } from 'lucide-react';

interface ResourceTreeProps {
  resources: Resource[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddRoot: () => void;
  onAddChild: (parentId: number) => void;
  onEdit: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
}

export function ResourceTree({
  resources,
  isLoading,
  onRefresh,
  onAddRoot,
  onAddChild,
  onEdit,
  onDelete,
}: ResourceTreeProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <TreeDeciduous className="h-5 w-5 text-primary" />
          <CardTitle>Ресурсы</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
          <Button size="sm" onClick={onAddRoot}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить корневой
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TreeDeciduous className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              Пока нет ресурсов. Создайте первый!
            </p>
            <Button onClick={onAddRoot}>
              <Plus className="mr-2 h-4 w-4" />
              Создать ресурс
            </Button>
          </div>
        ) : (
          <div className="space-y-0.5">
            {resources.map((resource) => (
              <ResourceItem
                key={resource.id}
                resource={resource}
                level={0}
                onAddChild={onAddChild}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
