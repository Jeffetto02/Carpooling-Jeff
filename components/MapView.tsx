import React, { useEffect, useRef } from 'react';
import { Ride } from '../types';

declare var L: any; // Leaflet is loaded from CDN, so we declare it globally

interface MapViewProps {
  rides?: Ride[];
  userLocation: { lat: number; lng: number } | null;
  onBookSeat?: (rideId: string) => void;
  onShowProfile?: (userId: string) => void;
  trackedRide?: Ride | null;
}

const MapView: React.FC<MapViewProps> = ({ rides, userLocation, onBookSeat, onShowProfile, trackedRide }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any>({}); // Use an object to store markers by ID
  const routeLineRef = useRef<any>(null);

  // Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
        const initialLocation = userLocation || { lat: -1.2921, lng: 36.8219 };
        mapRef.current = L.map(mapContainerRef.current).setView([initialLocation.lat, initialLocation.lng], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(mapRef.current);
    }
  }, [userLocation]);

  // Handle Ride Discovery Mode
  useEffect(() => {
    if (mapRef.current && rides && !trackedRide) {
        // Simple logic to add/remove/update markers based on the `rides` prop
        const currentMarkerIds = Object.keys(markersRef.current);
        const rideIds = rides.map(r => r.id);

        // Remove old markers
        currentMarkerIds.forEach(id => {
            if (!rideIds.includes(id)) {
                markersRef.current[id].remove();
                delete markersRef.current[id];
            }
        });

        // Add/update ride markers
        rides.forEach(ride => {
            if (ride.originCoords && !markersRef.current[ride.id]) {
                const driverIcon = L.divIcon({
                    html: `<img src="${ride.driver.avatar}" class="w-10 h-10 rounded-full border-2 border-primary">`,
                    className: '', iconSize: [40, 40], iconAnchor: [20, 40]
                });
                const marker = L.marker([ride.originCoords.lat, ride.originCoords.lng], { icon: driverIcon }).addTo(mapRef.current);
                
                const popupContent = `<div class="text-sm">...</div>`; // Simplified
                marker.bindPopup(popupContent);
                markersRef.current[ride.id] = marker;
            }
        });
    }
  }, [rides, trackedRide]);

  // Handle Ride Tracking Mode
  useEffect(() => {
     if (mapRef.current && trackedRide) {
        // Clear all discovery markers
        Object.values(markersRef.current).forEach((marker: any) => marker.remove());
        markersRef.current = {};

        const { currentLocation, originCoords, destinationCoords, driver } = trackedRide;
        
        // Update or create driver marker
        if (currentLocation) {
            const driverIcon = L.divIcon({
                html: `<div class="relative"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10 text-primary drop-shadow-lg"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" /></svg><img src="${driver.avatar}" class="absolute w-6 h-6 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-[8px] border-2 border-slate-900"/></div>`,
                className: '', iconSize: [40, 40], iconAnchor: [20, 40]
            });
            if (markersRef.current.driver) {
                markersRef.current.driver.setLatLng([currentLocation.lat, currentLocation.lng]);
            } else {
                markersRef.current.driver = L.marker([currentLocation.lat, currentLocation.lng], { icon: driverIcon, zIndexOffset: 1000 }).addTo(mapRef.current);
            }
        }
        
        // Add destination marker if not present
        if (destinationCoords && !markersRef.current.destination) {
            const destIcon = L.divIcon({
                html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10 text-secondary"><path fill-rule="evenodd" d="M12 2.25c-3.31 0-6 2.69 6 6 0 1.5-.53 2.87-1.4 3.94l.6 1.8c.14.41-.02.87-.38 1.12L13.5 18v2.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75V18l-3.32-2.89c-.36-.25-.52-.71-.38-1.12l.6-1.8c-.87-1.07-1.4-2.44-1.4-3.94 0-3.31 2.69-6 6-6Zm0 1.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5Z" clip-rule="evenodd" /></svg>`,
                className: '', iconSize: [40, 40], iconAnchor: [20, 40]
            });
            markersRef.current.destination = L.marker([destinationCoords.lat, destinationCoords.lng], { icon: destIcon }).addTo(mapRef.current);
            markersRef.current.destination.bindPopup(`Destination: ${trackedRide.destination}`);
        }
        
        // Draw or update route line
        // Fix: Removed the type assertion `as L.LatLngExpression[]` to resolve the "Cannot find namespace 'L'" error.
        const points = [originCoords, currentLocation, destinationCoords].filter(Boolean);
        if (points.length >= 2) {
             if (routeLineRef.current) {
                routeLineRef.current.setLatLngs(points);
             } else {
                routeLineRef.current = L.polyline(points, { color: '#005f73', weight: 5, opacity: 0.8 }).addTo(mapRef.current);
             }
             mapRef.current.fitBounds(routeLineRef.current.getBounds(), { padding: [50, 50] });
        }
     }
  }, [trackedRide]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[400px] md:min-h-[600px] rounded-lg bg-slate-900" />;
};

export default MapView;