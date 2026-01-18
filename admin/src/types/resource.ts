export interface Resource {
  id: number;
  title: string;
  parentId: number | null;
  metadata: Record<string, unknown> | null;
  children: Resource[];
}

export interface CreateResourceDto {
  title: string;
  parentId?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateResourceDto {
  title?: string;
  parentId?: number;
  metadata?: Record<string, unknown>;
}
