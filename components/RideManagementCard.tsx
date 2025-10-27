import React, { useState } from 'react';
import { Ride } from '../types';

interface RideManagementCardProps {
  ride: Ride;
  onCancelRide: (rideId: string) => void;
  onEndRide: (rideId: string) => void;
  onExtendDepartureTime: (rideId: string, newTime: Date) => void;
  onNotifyPassengers: (rideId: string) => void;
}

const RideManagementCard: React.FC<RideManagementCardProps> = ({ ride, onCancelRide, onEndRide, onExtendDepartureTime, onNotifyPassengers }) => {
    // Helper to format date for datetime-local input, which requires 'YYYY-MM-DDTHH:mm'
    const toISOStringWithTimezone = (date: Date) => {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, -1);
        return localISOTime.substring(0, 16);
    };

    const [newDepartureTime, setNewDepartureTime] = useState(toISOStringWithTimezone(ride.departureTime));

    const handleTimeUpdate = () => {
        if (newDepartureTime) {
            onExtendDepartureTime(ride.id, new Date(newDepartureTime));
        }
    }

    const isLive = ride.status === 'in-progress';
    
    return (
        <div className={`bg-slate-800/50 backdrop-blur-lg border rounded-xl shadow-lg p-6 transition-all duration-300 ${isLive ? 'border-green-500' : 'border-slate-700'}`}>
            {/* Ride details header */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-2xl font-bold text-dark">{ride.destination}</h3>
                        {isLive && (
                             <span className="flex items-center gap-2 text-sm font-semibold text-green-400 bg-green-900/50 px-3 py-1 rounded-full">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                In Progress
                             </span>
                        )}
                    </div>
                    <p className="text-gray-400">From: {ride.origin}</p>
                </div>
                <div className="text-left md:text-right w-full md:w-auto">
                     <p className="text-xl font-bold text-primary">Ksh {ride.fare}</p>
                     <p className="text-xs text-gray-400">per seat</p>
                </div>
            </div>

            {/* Passenger List */}
            <div className="mb-6">
                <h4 className="font-bold text-dark mb-2 border-t border-slate-700 pt-4">Booked Passengers ({ride.riders.length}/{ride.totalSeats})</h4>
                {ride.riders.length > 0 ? (
                    <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                       {ride.riders.map(rider => (
                           <li key={rider.id} className="bg-slate-700/50 p-3 rounded-lg flex items-center justify-between">
                               <div className="flex items-center">
                                   <img src={rider.avatar} alt={rider.name} className="w-8 h-8 rounded-full mr-3"/>
                                   <span className="font-medium">{rider.name}</span>
                               </div>
                               <a href={`tel:${rider.phoneNumber}`} className="text-sm text-primary hover:underline">{rider.phoneNumber || 'No contact'}</a>
                           </li>
                       ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-sm">No passengers have booked yet.</p>
                )}
            </div>

            {/* Management Actions */}
            <div className="border-t border-slate-700 pt-6">
                { isLive ? (
                    <div className="flex justify-center">
                        <button onClick={() => onEndRide(ride.id)} className="w-full md:w-1/2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                            End Ride & Complete
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    {/* Time Extension */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Update Departure Time</label>
                        <div className="flex gap-2">
                            <input 
                                type="datetime-local" 
                                value={newDepartureTime}
                                onChange={e => setNewDepartureTime(e.target.value)}
                                className="block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            />
                            <button onClick={handleTimeUpdate} className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary-dark transition-colors">Update</button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Current: {ride.departureTime.toLocaleString()}</p>
                    </div>
                    {/* Main actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => onNotifyPassengers(ride.id)} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors">Start Ride</button>
                        <button onClick={() => onCancelRide(ride.id)} className="w-full bg-red-600/80 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors">Cancel Ride</button>
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RideManagementCard;