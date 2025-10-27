// Fix: Create types.ts to define shared data structures for the application.
export interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  car?: Car;
  kraPin?: string;
  isDriver: boolean;
  phoneNumber?: string;
}

export interface Car {
  model: string;
  type: string;
  color: string;
}

export interface Ride {
  id: string;
  driver: User;
  origin: string;
  destination: string;
  departureTime: Date;
  availableSeats: number;
  totalSeats: number;
  fare: number;
  riders: User[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  currentLocation?: { lat: number; lng: number };
  route?: any; // Could be a GeoJSON object or similar
  originCoords?: { lat: number; lng: number };
  destinationCoords?: { lat: number; lng: number };
  rideType?: 'scheduled' | 'instant';
  eta?: Date;
}