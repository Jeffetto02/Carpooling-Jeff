// Fix: Create RideCard.tsx component to display ride details.
import React from 'react';
import { Ride, User } from '../types';
import { Icons } from '../constants';

interface RideCardProps {
  ride: Ride;
  currentUser: User;
  onRequestSeat: (rideId: string) => void;
  onShowProfile: (userId: string) => void;
  onTrackRide: (rideId: string) => void;
  distance?: number;
}

const RideCard: React.FC<RideCardProps> = ({ ride, currentUser, onRequestSeat, onShowProfile, onTrackRide, distance }) => {
  const { driver, origin, destination, departureTime, availableSeats, totalSeats, fare, status, riders, pendingRequests } = ride;

  const handleRequest = () => {
    if (availableSeats > 0) {
      onRequestSeat(ride.id);
    }
  };

  const handleTrack = () => {
    onTrackRide(ride.id);
  }
  
  const isBooked = riders.some(r => r.id === currentUser.id);
  const isPending = pendingRequests.some(r => r.id === currentUser.id);
  const isLive = status === 'in-progress';

  const getButtonState = () => {
      if (isBooked) {
          return isLive 
              ? <button onClick={handleTrack} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 text-sm">Track Ride</button>
              : <div className="text-sm font-semibold text-green-400">Booked</div>;
      }
      if (isPending) {
          return <div className="text-sm font-semibold text-yellow-400">Request Sent</div>;
      }
      return (
          <button onClick={handleRequest} disabled={availableSeats === 0} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed text-sm">
              {availableSeats > 0 ? 'Request Seat' : 'Full'}
          </button>
      );
  }

  return (
    <div className={`bg-slate-800/50 backdrop-blur-lg border rounded-xl shadow-lg p-6 flex flex-col justify-between transition-all duration-300 ${isBooked ? 'border-primary' : 'border-slate-700'} ${isLive ? 'border-green-500' : ''}`}>
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

        {isLive && (
             <div className="my-4 p-2 bg-green-900/50 border border-green-700 rounded-lg text-center flex items-center justify-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <p className="font-bold text-green-300 text-sm">
                    {isBooked ? 'Your ride is in progress!' : 'Live now!'}
                </p>
             </div>
        )}

        {isBooked && !isLive && (
             <div className="my-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-center">
                <p className="font-bold text-green-300">✅ Your request was approved!</p>
             </div>
        )}
        <div className="space-y-3 text-sm">
          <p><strong className="text-gray-400">From:</strong> {origin} {distance !== undefined && <span className="text-sm text-primary font-semibold ml-2">({distance.toFixed(1)} km away)</span>}</p>
          <p><strong className="text-gray-400">To:</strong> {destination}</p>
          <p><strong className="text-gray-400">Time:</strong> {departureTime.toLocaleString()}</p>
        </div>
      </div>
      {isBooked && (
          <div className="mt-4 bg-slate-700/50 p-3 rounded-lg text-sm">
            <p className="font-bold text-dark mb-1">Driver & Vehicle Info:</p>
            <p className="text-gray-300"><strong>Name:</strong> {driver.name}</p>
            <p className="text-gray-300"><strong>Phone:</strong> {driver.phoneNumber || 'Not available'}</p>
            {driver.car && <p className="text-gray-300"><strong>Plate:</strong> {driver.car.numberPlate}</p>}
          </div>
      )}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-300">
          <Icons.UserGroup className="w-5 h-5 mr-2" />
          <span>{availableSeats}/{totalSeats} seats left</span>
        </div>
        {getButtonState()}
      </div>
    </div>
  );
};

export default RideCard;