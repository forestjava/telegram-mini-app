/**
 * Types for Booking API
 */

export interface BookingUser {
  id: number;
  type: "Telegram" | "Keycloak";
  telegramId?: number;
  keycloakId?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
}

export interface Booking {
  user: BookingUser;
}

export interface Resource {
  id: number;
  title: string;
  parentId?: number;
  metadata?: Record<string, unknown>;
  children?: Resource[];
  booking?: Booking;
}

export interface CreateBookingDto {
  resourceId: number;
}

export interface BookingResponse {
  id: number;
  resourceId: number;
  userId: number;
  resource: {
    id: number;
    title: string;
    parentId: number | null;
    metadata: Record<string, unknown> | null;
  };
  user: {
    id: number;
    type: "Telegram" | "Keycloak";
    telegramId: number | null;
    keycloakId: string | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    photoUrl: string | null;
  };
}
