/**
 * Types for Booking API
 */

export interface BookingUser {
  id: string;
  type: "Telegram" | "Keycloak";
  telegramId: number | null;
  keycloakId: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
}

export interface Booking {
  user: BookingUser;
}

export interface Resource {
  id: string;
  title: string;
  parentId: string | null;
  metadata: Record<string, unknown> | null;
  children: Resource[];
  booking?: Booking;
}

export interface CreateBookingDto {
  resourceId: string;
}

export interface BookingResponse {
  id: string;
  resourceId: string;
  userId: string;
  resource: {
    id: string;
    title: string;
    parentId: string | null;
    metadata: Record<string, unknown> | null;
  };
  user: {
    id: string;
    type: "Telegram" | "Keycloak";
    telegramId: number | null;
    keycloakId: string | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    photoUrl: string | null;
  };
}
