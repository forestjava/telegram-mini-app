import type { Resource, CreateResourceDto, UpdateResourceDto } from '@/types/resource';

const API_BASE = '/api/resources';

export async function fetchResources(): Promise<Resource[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error('Failed to fetch resources');
  }
  return response.json();
}

export async function fetchResource(id: number): Promise<Resource> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Resource not found');
    }
    throw new Error('Failed to fetch resource');
  }
  return response.json();
}

export async function createResource(data: CreateResourceDto): Promise<Resource> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create resource');
  }
  return response.json();
}

export async function updateResource(id: number, data: UpdateResourceDto): Promise<Resource> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Resource not found');
    }
    throw new Error('Failed to update resource');
  }
  return response.json();
}

export async function deleteResource(id: number): Promise<Resource> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Resource not found');
    }
    throw new Error('Failed to delete resource');
  }
  return response.json();
}
