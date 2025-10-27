import React, { useState, useEffect } from 'react';
import { Ride, User } from '../types';
import RideManagementCard from './RideManagementCard';
import { MOCK_DESTINATIONS, MOCK_RECENT_DESTINATIONS, Icons } from '../constants';

interface DriverDashboardProps {
  driver: User;
  onCreateRide: (rideData: Omit<Ride, 'id' | 'driver' | 'currentLocation' | 'route' | 'riders' | 'status' | 'rideType' | 'pendingRequests' | 'shareCode'>) => void;
  onStartInstantDrive: (destination: string) => void;
  driverRides: Ride[];
  onCancelRide: (rideId: string) => void;
  onEndRide: (rideId: string) => void;
  onExtendDepartureTime: (rideId: string, newTime: Date) => void;
  onNotifyPassengers: (rideId: string) => void;
  onApproveRequest: (rideId: string, riderId: string) => void;
  onRejectRequest: (rideId: string, riderId: string) => void;
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DriverDashboard: React.FC<DriverDashboardProps> = ({ driver, onCreateRide, onStartInstantDrive, driverRides, onCancelRide, onEndRide, onExtendDepartureTime, onNotifyPassengers, onApproveRequest, onRejectRequest }) => {
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [seats, setSeats] = useState(1);
  const [fare, setFare] = useState(300);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [instantDestination, setInstantDestination] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<string[]>([]);

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

  const handleToggleRecurringDay = (day: string) => {
    setRecurringDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  }

  const handleScheduleSubmit = (e: React.FormEvent) => {
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
      isRecurring,
      recurringDays: isRecurring ? recurringDays : []
    });
    // Reset form
    setDestination('');
    setOrigin('');
    setDepartureTime('');
    setSeats(1);
    setFare(300);
    setIsRecurring(false);
    setRecurringDays([]);
  };

  const handleInstantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!instantDestination) {
        alert("Please enter a destination.");
        return;
    }
    onStartInstantDrive(instantDestination);
    setInstantDestination('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2">
        <h3 className="text-2xl font-bold text-dark mb-4">Your Active & Scheduled Rides</h3>
        {driverRides.length > 0 ? (
          <div className="space-y-6">
            {driverRides.map(ride => (
              <RideManagementCard 
                key={ride.id} 
                ride={ride} 
                onCancelRide={onCancelRide}
                onEndRide={onEndRide}
                onExtendDepartureTime={onExtendDepartureTime}
                onNotifyPassengers={onNotifyPassengers}
                onApproveRequest={onApproveRequest}
                onRejectRequest={onRejectRequest}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg shadow">
            <p className="text-gray-400">You haven't published any rides yet. Create one on the right!</p>
          </div>
        )}
      </div>
      <div className="lg:col-span-1 space-y-8">
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-6 rounded-xl shadow-lg">
           <h2 className="text-2xl font-bold text-dark mb-4">Instant Drive</h2>
           <form onSubmit={handleInstantSubmit} className="space-y-4">
              <div>
                  <label htmlFor="instant_destination" className="block text-sm font-medium text-gray-300">Destination</label>
                  <input type="text" id="instant_destination" value={instantDestination} onChange={(e) => setInstantDestination(e.target.value)} placeholder="Where are you going?" className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
              </div>
              <button type="submit" className="w-full bg-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-secondary-dark transition-colors duration-300">Start Driving Now</button>
           </form>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-dark mb-4">Schedule a Ride</h2>
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-300">Origin</label>
              <div className="relative">
                <input type="text" id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g., Maple Creek" className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-300">Destination</label>
              <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g., Downtown" className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" autoComplete="off" required />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-slate-800 border border-slate-600 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {suggestions.map(s => (
                    <li key={s} onClick={() => { setDestination(s); setSuggestions([]); }} className="px-3 py-2 cursor-pointer hover:bg-slate-700">{s}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label htmlFor="departure" className="block text-sm font-medium text-gray-300">Departure Time</label>
              <input type="datetime-local" id="departure" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            {/* Recurring Ride Section */}
            <div className="border-t border-slate-700 pt-4">
                 <div className="flex items-center justify-between">
                    <label htmlFor="recurring" className="font-medium text-gray-300">Recurring Ride?</label>
                    <input type="checkbox" id="recurring" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                 </div>
                 {isRecurring && (
                    <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Repeat on:</label>
                        <div className="flex justify-between gap-1">
                            {WEEK_DAYS.map(day => (
                                <button key={day} type="button" onClick={() => handleToggleRecurringDay(day)} className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${recurringDays.includes(day) ? 'bg-primary text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}>{day}</button>
                            ))}
                        </div>
                    </div>
                 )}
            </div>
            <div>
              <label htmlFor="seats" className="block text-sm font-medium text-gray-300">Available Seats</label>
              <input type="number" id="seats" value={seats} onChange={(e) => setSeats(parseInt(e.target.value, 10))} min="1" max="6" className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            <div>
              <label htmlFor="fare" className="block text-sm font-medium text-gray-300">Fare per Seat (Ksh)</label>
              <input type="number" id="fare" value={fare} onChange={(e) => setFare(parseFloat(e.target.value))} min="0" step="50" className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300">Publish Ride</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;