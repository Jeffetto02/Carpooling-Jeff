// Fix: Create RiderDashboard.tsx component for riders to find rides.
import React, { useState, useEffect } from 'react';
import { Ride, User } from '../types';
import RideCard from './RideCard';
import MapView from './MapView'; // Import the new MapView component

interface RiderDashboardProps {
  user: User;
  availableRides: Ride[];
  onRequestSeat: (rideId: string) => void;
  onShowProfile: (userId: string) => void;
  onTrackRide: (rideId: string) => void;
}

type ViewMode = 'list' | 'map';

const RiderDashboard: React.FC<RiderDashboardProps> = ({ user, availableRides, onRequestSeat, onShowProfile, onTrackRide }) => {
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [rideCode, setRideCode] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
        setUserLocation({ lat: -1.2921, lng: 36.8219 });
      }
    );
  }, []);

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };
  
  const ridesWithDistance = availableRides.map(ride => {
    let distance;
    const startCoords = ride.status === 'in-progress' && ride.currentLocation ? ride.currentLocation : ride.originCoords;
    if (userLocation && startCoords) {
      distance = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, startCoords.lat, startCoords.lng);
    }
    return { ...ride, distance };
  }).sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  
  const yourTrips = ridesWithDistance.filter(ride => ride.riders.some(r => r.id === user.id) && (ride.status === 'scheduled' || ride.status === 'in-progress'));
  const liveRides = ridesWithDistance.filter(ride => ride.status === 'in-progress' && !ride.riders.some(r => r.id === user.id) && ride.availableSeats > 0);
  const scheduledRides = ridesWithDistance.filter(ride => ride.status === 'scheduled' && !ride.riders.some(r => r.id === user.id) && ride.availableSeats > 0);

  const filteredScheduledRides = scheduledRides.filter(ride =>
    ride.origin.toLowerCase().includes(searchOrigin.toLowerCase()) &&
    ride.destination.toLowerCase().includes(searchDestination.toLowerCase()) &&
    (rideCode ? ride.shareCode?.toLowerCase() === rideCode.toLowerCase() : true)
  );
  
  const renderRideList = (rides: (Ride & { distance?: number })[], isYourTrip: boolean = false) => (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rides.map(ride => (
              <RideCard 
                  key={ride.id} 
                  ride={ride} 
                  currentUser={user}
                  onRequestSeat={onRequestSeat} 
                  onShowProfile={onShowProfile}
                  onTrackRide={onTrackRide}
                  distance={ride.distance}
              />
          ))}
      </div>
  );

  return (
    <div className="space-y-12">
      {yourTrips.length > 0 && (
        <div>
             <h3 className="text-2xl font-bold text-dark mb-4">Your Upcoming & Active Trips</h3>
             {renderRideList(yourTrips, true)}
        </div>
      )}

       {liveRides.length > 0 && (
        <div>
             <h3 className="text-2xl font-bold text-dark mb-4">Live Now: Instant Pickups</h3>
             {renderRideList(liveRides)}
        </div>
      )}
      
      <div>
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-8 rounded-xl shadow-lg mb-8">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-3xl font-bold text-dark">Find a Scheduled Ride</h2>
                 <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button onClick={() => setViewMode('list')} className={`px-4 py-1 text-sm rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-slate-700'}`}>List</button>
                    <button onClick={() => setViewMode('map')} className={`px-4 py-1 text-sm rounded-md transition-colors ${viewMode === 'map' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-slate-700'}`}>Map</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <input type="text" placeholder="Search by origin..." value={searchOrigin} onChange={(e) => setSearchOrigin(e.target.value)} className="px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary"/>
                <input type="text" placeholder="Search by destination..." value={searchDestination} onChange={(e) => setSearchDestination(e.target.value)} className="px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary"/>
            </div>
             {user.savedLocations && user.savedLocations.length > 0 && (
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-sm text-gray-400">Quick search:</span>
                    {user.savedLocations.map(loc => (
                        <button key={loc.name} onClick={() => setSearchOrigin(loc.address)} className="px-3 py-1 bg-slate-700 text-sm rounded-full hover:bg-primary">{loc.name}</button>
                    ))}
                </div>
             )}
            <div>
                 <label className="block text-sm font-medium text-gray-300 mb-1">Have a Ride Code?</label>
                 <div className="flex gap-2">
                    <input type="text" placeholder="e.g., ABC-123" value={rideCode} onChange={(e) => setRideCode(e.target.value)} className="flex-grow px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary" />
                    <button onClick={() => setRideCode('')} className="px-4 py-2 bg-slate-600 rounded-md text-sm hover:bg-slate-500">Clear</button>
                 </div>
            </div>
        </div>
        
        {viewMode === 'list' ? (
            filteredScheduledRides.length > 0 ? (
                renderRideList(filteredScheduledRides)
            ) : (
            <div className="text-center py-10 bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-lg shadow">
                <p className="text-gray-400">No scheduled rides match your search. Check the map or live rides!</p>
            </div>
            )
        ) : (
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl shadow-lg p-2">
                <MapView rides={filteredScheduledRides} userLocation={userLocation} />
            </div>
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;