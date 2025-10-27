import React, { useState, useEffect } from 'react';
import { Ride } from '../types';
import RideCard from './RideCard';
import { MOCK_DESTINATIONS, MOCK_RECENT_DESTINATIONS, Icons } from '../constants';

interface DriverDashboardProps {
  onCreateRide: (rideData: Omit<Ride, 'id' | 'driver' | 'currentLocation' | 'route'>) => void;
  driverRides: Ride[];
  onCancelRide: (rideId: string) => void;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ onCreateRide, driverRides, onCancelRide }) => {
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [seats, setSeats] = useState(1);
  const [fare, setFare] = useState(300);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (destination.length > 2) {
      const filtered = MOCK_DESTINATIONS.filter(d => 
        d.toLowerCase().includes(destination.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [destination]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !origin || !departureTime || seats <= 0 || fare < 0) {
        alert("Please fill all fields correctly.");
        return;
    }
    onCreateRide({
      destination,
      origin,
      departureTime: new Date(departureTime),
      availableSeats: seats,
      totalSeats: seats,
      fare,
    });
    // Reset form
    setDestination('');
    setOrigin('');
    setDepartureTime('');
    setSeats(1);
    setFare(300);
  };

  return (
    <div>
      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-8 rounded-xl shadow-lg mb-12">
        <h2 className="text-3xl font-bold text-dark mb-6">Create a New Ride</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label htmlFor="origin" className="block text-sm font-medium text-gray-300">Origin</label>
            <div className="relative">
              <input type="text" id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g., Maple Creek Residential" className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
              <button type="button" onClick={() => setOrigin('My Current Location')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-primary">
                <Icons.Location className="w-5 h-5"/>
              </button>
            </div>
          </div>
          <div className="md:col-span-1 relative">
            <label htmlFor="destination" className="block text-sm font-medium text-gray-300">Destination</label>
            <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g., Downtown Financial District" className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" autoComplete="off" required />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-slate-800 border border-slate-600 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                {suggestions.map(s => (
                  <li key={s} onClick={() => { setDestination(s); setSuggestions([]); }} className="px-3 py-2 cursor-pointer hover:bg-slate-700">{s}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="md:col-span-1">
            <label htmlFor="departure" className="block text-sm font-medium text-gray-300">Departure Time</label>
            <input type="datetime-local" id="departure" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="seats" className="block text-sm font-medium text-gray-300">Available Seats</label>
            <input type="number" id="seats" value={seats} onChange={(e) => setSeats(parseInt(e.target.value, 10))} min="1" max="6" className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="fare" className="block text-sm font-medium text-gray-300">Fare per Seat (Ksh)</label>
            <input type="number" id="fare" value={fare} onChange={(e) => setFare(parseFloat(e.target.value))} min="0" step="50" className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
          </div>
          <div className="md:col-span-1 lg:col-span-1 flex items-end">
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300">Publish Ride</button>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-300 mb-2">Or select a recent destination</label>
              <div className="flex flex-wrap gap-2">
                  {MOCK_RECENT_DESTINATIONS.map(dest => (
                      <button type="button" key={dest} onClick={() => setDestination(dest)} className="bg-slate-700 text-gray-200 px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
                          {dest}
                      </button>
                  ))}
              </div>
          </div>
        </form>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-dark mb-4">Your Published Rides</h3>
        {driverRides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {driverRides.map(ride => (
              <RideCard 
                key={ride.id} 
                ride={ride} 
                onBookSeat={() => {}}
                onShowProfile={() => {}} 
                isDriverView={true} 
                onCancelRide={onCancelRide}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg shadow">
            <p className="text-gray-400">You haven't published any rides yet. Create one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;