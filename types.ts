// Fix: Create types.ts to define shared data structures for the application.
export interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  car?: Car;
  kraPin?: string;
  isDriver: boolean;
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
  currentLocation?: string;
  route?: any; // Could be a GeoJSON object or similar
}
