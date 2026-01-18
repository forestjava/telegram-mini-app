export interface Resource {
  id: string;
  title: string;
  parentId: string | null;
  metadata: Record<string, unknown> | null;
  children: Resource[];
}

export interface CreateResourceDto {
  title: string;
  parentId?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateResourceDto {
  title?: string;
  parentId?: string;
  metadata?: Record<string, unknown>;
}
