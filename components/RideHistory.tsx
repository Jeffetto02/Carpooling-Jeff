// Fix: Create RideHistory.tsx component to show past rides.
import React, { useState } from 'react';
import { Ride, User } from '../types';

interface RideHistoryProps {
  user: User;
  rides: Ride[];
  onRateRide: (ride: Ride) => void;
}

const RideHistory: React.FC<RideHistoryProps> = ({ user, rides, onRateRide }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const userHistoryRides = rides.filter(ride => {
    if (ride.status !== 'completed') return false;
    if (user.isDriver) {
      return ride.driver.id === user.id;
    }
    return ride.riders.some(r => r.id === user.id);
  });

  const filteredHistory = userHistoryRides.filter(ride => 
    ride.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ride.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-8">
      <div className="text-center">
          <h1 className="text-4xl font-bold text-dark">Your Ride History</h1>
          <p className="text-lg text-gray-400 mt-2">Review your past trips on EcoRide.</p>
      </div>

      <div className="max-w-xl mx-auto">
        <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by origin or destination..."
            className="w-full px-4 py-3 bg-slate-700/80 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl shadow-lg overflow-hidden">
        <div className="divide-y divide-slate-700">
          {filteredHistory.length > 0 ? (
            filteredHistory.map(ride => {
              const displayUser = ride.driver.id === user.id ? ride.riders[0] || ride.driver : ride.driver;
              return (
              <div key={ride.id} className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-grow flex items-center gap-4">
                  <img src={displayUser.avatar} alt={displayUser.name} className="w-12 h-12 rounded-full hidden sm:block" />
                  <div>
                      <p className="font-bold text-dark text-lg">{ride.destination}</p>
                      <p className="text-sm text-gray-400">From: {ride.origin}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        On {ride.departureTime.toLocaleDateString()} with {ride.driver.id === user.id ? `${ride.riders.length} passengers` : ride.driver.name}
                      </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="text-right flex-grow">
                      <p className="font-semibold text-lg text-primary">{user.isDriver ? '+' : '-'} Ksh {ride.fare}</p>
                      <p className="text-xs text-gray-400">{user.isDriver ? 'Earned' : 'Paid'}</p>
                  </div>
                  {!user.isDriver && (
                    <button
                        onClick={() => onRateRide(ride)}
                        className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary-dark transition-colors duration-300 text-sm whitespace-nowrap"
                    >
                        Rate Driver
                    </button>
                  )}
                </div>
              </div>
            )})
          ) : (
            <p className="p-8 text-center text-gray-400">No rides match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideHistory;