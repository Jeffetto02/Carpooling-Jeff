// Fix: Create RideCard.tsx component to display ride details.
import React from 'react';
import { Ride } from '../types';
import { Icons } from '../constants';

interface RideCardProps {
  ride: Ride;
  onBookSeat: (rideId: string) => void;
  onShowProfile: (userId: string) => void;
  isDriverView?: boolean;
  onCancelRide?: (rideId: string) => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onBookSeat, onShowProfile, isDriverView = false, onCancelRide }) => {
  const { driver, origin, destination, departureTime, availableSeats, totalSeats, fare } = ride;

  const handleBook = () => {
    if (availableSeats > 0) {
      onBookSeat(ride.id);
    }
  };
  
  const handleCancel = () => {
    if (onCancelRide) {
        onCancelRide(ride.id);
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl shadow-lg p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center cursor-pointer" onClick={() => onShowProfile(driver.id)}>
            <img src={driver.avatar} alt={driver.name} className="w-12 h-12 rounded-full mr-4 border-2 border-slate-600" />
            <div>
              <p className="font-bold text-dark">{driver.name}</p>
              <p className="text-sm text-gray-400">Rating: {driver.rating.toFixed(1)} ★</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">Ksh {fare}</p>
            <p className="text-xs text-gray-400">per seat</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <p><strong className="text-gray-400">From:</strong> {origin}</p>
          <p><strong className="text-gray-400">To:</strong> {destination}</p>
          <p><strong className="text-gray-400">Time:</strong> {departureTime.toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-300">
          <Icons.UserGroup className="w-5 h-5 mr-2" />
          <span>{availableSeats}/{totalSeats} seats left</span>
        </div>
        {isDriverView ? (
            <button 
                onClick={handleCancel}
                className="bg-red-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 text-sm"
            >
                Cancel Ride
            </button>
        ) : (
            <button 
                onClick={handleBook}
                disabled={availableSeats === 0}
                className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed text-sm"
            >
                {availableSeats > 0 ? 'Book Seat' : 'Full'}
            </button>
        )}
      </div>
    </div>
  );
};

export default RideCard;
