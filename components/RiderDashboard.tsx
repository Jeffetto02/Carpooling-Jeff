// Fix: Create RiderDashboard.tsx component for riders to find rides.
import React, { useState } from 'react';
import { Ride } from '../types';
import RideCard from './RideCard';

interface RiderDashboardProps {
  availableRides: Ride[];
  onBookSeat: (rideId: string) => void;
  onShowProfile: (userId: string) => void;
}

const RiderDashboard: React.FC<RiderDashboardProps> = ({ availableRides, onBookSeat, onShowProfile }) => {
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDestination, setSearchDestination] = useState('');

  const filteredRides = availableRides.filter(ride =>
    ride.origin.toLowerCase().includes(searchOrigin.toLowerCase()) &&
    ride.destination.toLowerCase().includes(searchDestination.toLowerCase())
  );

  return (
    <div>
      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-8 rounded-xl shadow-lg mb-12">
        <h2 className="text-3xl font-bold text-dark mb-6">Find a Ride</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Search by origin..."
            value={searchOrigin}
            onChange={(e) => setSearchOrigin(e.target.value)}
            className="px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
          <input
            type="text"
            placeholder="Search by destination..."
            value={searchDestination}
            onChange={(e) => setSearchDestination(e.target.value)}
            className="px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-dark mb-4">Available Rides</h3>
        {filteredRides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRides.map(ride => (
              <RideCard 
                key={ride.id} 
                ride={ride} 
                onBookSeat={onBookSeat} 
                onShowProfile={onShowProfile} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg shadow">
            <p className="text-gray-400">No rides match your search. Try broadening your criteria!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;
