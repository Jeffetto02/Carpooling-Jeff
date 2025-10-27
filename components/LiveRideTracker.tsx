import React from 'react';
import { Ride } from '../types';
import MapView from './MapView';

interface LiveRideTrackerProps {
  ride: Ride;
  onBack: () => void;
}

const LiveRideTracker: React.FC<LiveRideTrackerProps> = ({ ride, onBack }) => {
  const { driver, destination, eta, car } = ride;
  
  const formatETA = (etaDate?: Date) => {
    if (!etaDate) return 'Calculating...';
    const minutes = Math.round((etaDate.getTime() - new Date().getTime()) / 60000);
    return `~${Math.max(0, minutes)} min`;
  };

  return (
    <div>
      <button onClick={onBack} className="mb-6 text-primary font-semibold hover:underline">
        &larr; Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map View */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl shadow-lg overflow-hidden">
            <MapView userLocation={ride.currentLocation || ride.originCoords || null} trackedRide={ride} />
        </div>
        
        {/* Details Panel */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl shadow-lg p-6 lg:p-8 self-start">
            <div className="text-center mb-6">
                <p className="text-sm text-gray-400">Arriving at</p>
                <h1 className="text-3xl font-bold text-dark">{destination}</h1>
                <p className="text-5xl font-bold text-primary mt-2">{formatETA(eta)}</p>
            </div>
            
            <div className="space-y-6">
                {/* Driver Info */}
                <div className="border-t border-slate-700 pt-6">
                    <h2 className="text-xl font-bold text-dark mb-4">Your Driver</h2>
                    <div className="flex items-center gap-4">
                        <img src={driver.avatar} alt={driver.name} className="w-16 h-16 rounded-full border-2 border-slate-600" />
                        <div>
                            <p className="font-bold text-lg text-dark">{driver.name}</p>
                            <p className="text-sm text-yellow-400">{driver.rating.toFixed(1)} ★ Rating</p>
                        </div>
                    </div>
                    {driver.car && (
                         <div className="mt-4 text-sm text-gray-400 bg-slate-700/50 p-3 rounded-lg">
                            <p><strong>Vehicle:</strong> {driver.car.model} ({driver.car.type})</p>
                            <div className="flex items-center gap-2">
                                <strong>Color:</strong>
                                <span className="w-4 h-4 rounded-full inline-block border border-slate-500" style={{ backgroundColor: driver.car.color }}></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Contact Actions */}
                <div className="border-t border-slate-700 pt-6">
                     <h2 className="text-xl font-bold text-dark mb-4">Contact</h2>
                     <a 
                        href={`tel:${driver.phoneNumber}`} 
                        className="w-full block text-center bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300"
                     >
                        Call {driver.name}
                     </a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRideTracker;