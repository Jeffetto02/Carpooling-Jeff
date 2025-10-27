// Fix: Create the main App.tsx component to structure and manage the application.
import React, { useState, useEffect } from 'react';
import { User, Ride, Car, Badge } from './types';
import RoleSelector from './components/RoleSelector';
import DriverDashboard from './components/DriverDashboard';
import RiderDashboard from './components/RiderDashboard';
import Header from './components/Header';
import DriverOnboarding from './components/DriverOnboarding';
import RideHistory from './components/RideHistory';
import EarningsDashboard from './components/EarningsDashboard';
import ProfilePage from './components/ProfilePage';
import RatingModal from './components/RatingModal';
import LiveRideTracker from './components/LiveRideTracker';

// Mock Data
const MOCK_USER_RIDER: User = { 
    id: 'user-1', 
    name: 'Alex Rider', 
    avatar: `https://i.pravatar.cc/150?u=alex`, 
    rating: 4.8, 
    isDriver: false, 
    phoneNumber: '0712345678',
    favoriteDrivers: ['user-2'],
    savedLocations: [
        { name: 'Home', address: 'Maple Creek Residential' },
        { name: 'Work', address: 'Downtown Financial District' }
    ]
};
const MOCK_USER_DRIVER: User = { 
  id: 'user-2', 
  name: 'Ben Driver', 
  avatar: `https://i.pravatar.cc/150?u=ben`, 
  rating: 4.9, 
  isDriver: true,
  car: { model: 'Toyota Prius', type: 'Hybrid', color: '#cccccc', numberPlate: 'KDA 123B' },
  kraPin: 'A001234567Z',
  phoneNumber: '0787654321',
  badges: ['10+ Rides']
};
const MOCK_RIDES: Ride[] = [
    {
        id: 'ride-1',
        driver: MOCK_USER_DRIVER,
        origin: 'Maple Creek Residential',
        destination: 'Downtown Financial District',
        departureTime: new Date(Date.now() + 10000), // 10 seconds from now to show 'in-progress' state
        availableSeats: 2,
        totalSeats: 3,
        fare: 350,
        riders: [MOCK_USER_RIDER],
        pendingRequests: [],
        status: 'scheduled',
        rideType: 'scheduled',
        originCoords: { lat: -1.286389, lng: 36.817223 },
        destinationCoords: { lat: -1.3032, lng: 36.8204 },
        shareCode: 'ABC-123',
    },
    {
        id: 'ride-2',
        driver: { ...MOCK_USER_DRIVER, id: 'user-3', name: 'Chloe Drive', avatar: 'https://i.pravatar.cc/150?u=chloe', phoneNumber: '0722000000', car: { model: 'Subaru Impreza', type: 'Sedan', color: '#0000ff', numberPlate: 'KDB 456C' } },
        origin: 'Oakridge Shopping Mall',
        destination: 'Seaside Heights Beach',
        departureTime: new Date(Date.now() + 3600 * 1000 * 4), // 4 hours from now
        availableSeats: 4,
        totalSeats: 4,
        fare: 500,
        riders: [],
        pendingRequests: [],
        status: 'scheduled',
        rideType: 'scheduled',
        originCoords: { lat: -1.314, lng: 36.832 },
        shareCode: 'XYZ-789'
    },
    {
        id: 'ride-3',
        driver: MOCK_USER_DRIVER,
        origin: 'Downtown Financial District',
        destination: 'Maple Creek Residential',
        departureTime: new Date(Date.now() - 3600 * 1000 * 24 * 2), // 2 days ago
        availableSeats: 0,
        totalSeats: 2,
        fare: 300,
        riders: [{...MOCK_USER_RIDER}],
        pendingRequests: [],
        status: 'completed',
        rideType: 'scheduled',
        originCoords: { lat: -1.286389, lng: 36.817223 },
    }
];


type View = 'role-selection' | 'onboarding' | 'dashboard' | 'history' | 'earnings' | 'profile' | 'live-ride';
type ProfileViewTarget = User | null;
interface RatingTask {
    ride: Ride;
    ratee: User;
}

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [rides, setRides] = useState<Ride[]>([]);
    const [view, setView] = useState<View>('role-selection');
    const [profileViewTarget, setProfileViewTarget] = useState<ProfileViewTarget>(null);
    const [ratingTask, setRatingTask] = useState<RatingTask | null>(null);
    const [activeRideId, setActiveRideId] = useState<string | null>(null);

    // Effect to load state from localStorage on initial render
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('ecoRideUser');
            const savedRides = localStorage.getItem('ecoRideRides');
            
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setView('dashboard'); // Go to dashboard if user exists
            }

            if (savedRides) {
                // Parse and re-instantiate Date objects
                const parsedRides = JSON.parse(savedRides).map((ride: any) => ({
                    ...ride,
                    departureTime: new Date(ride.departureTime),
                    eta: ride.eta ? new Date(ride.eta) : undefined
                }));
                setRides(parsedRides);
            } else {
                // If no saved rides, load mocks
                const parsedMocks = MOCK_RIDES.map(ride => ({...ride, departureTime: new Date(ride.departureTime)}));
                setRides(parsedMocks);
            }
        } catch (error) {
            console.error("Failed to load state from localStorage", error);
            setRides(MOCK_RIDES);
        }
    }, []);

    // Effect to save state to localStorage whenever user or rides change
    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('ecoRideUser', JSON.stringify(user));
            } else {
                localStorage.removeItem('ecoRideUser');
            }
            if (rides.length > 0) {
                 localStorage.setItem('ecoRideRides', JSON.stringify(rides));
            }
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, [user, rides]);

    const updateUserBadges = (driver: User, allRides: Ride[]): User => {
        const completedRidesCount = allRides.filter(r => r.driver.id === driver.id && r.status === 'completed').length;
        const newBadges: Badge[] = [];
        if (completedRidesCount >= 10) newBadges.push('10+ Rides');
        if (completedRidesCount >= 50) newBadges.push('50+ Rides');
        if (driver.rating >= 4.8) newBadges.push('Top Rated');
        return { ...driver, badges: newBadges };
    };

    // Effect to simulate ride progress
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setRides(prevRides => 
                prevRides.map(ride => {
                    // Start ride if departure time has passed
                    if (ride.status === 'scheduled' && ride.departureTime <= now) {
                        return { ...ride, status: 'in-progress', currentLocation: ride.originCoords };
                    }
                    // Simulate driver movement for in-progress rides
                    if (ride.status === 'in-progress' && ride.currentLocation && ride.destinationCoords) {
                        const newLat = ride.currentLocation.lat + (ride.destinationCoords.lat - ride.currentLocation.lat) * 0.05;
                        const newLng = ride.currentLocation.lng + (ride.destinationCoords.lng - ride.currentLocation.lng) * 0.05;
                        const newEta = new Date(Date.now() + 15 * 60 * 1000); // Mock ETA: 15 mins from now
                        return { ...ride, currentLocation: { lat: newLat, lng: newLng }, eta: newEta };
                    }
                    return ride;
                })
            );
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const handleRoleSelect = (role: 'driver' | 'rider') => {
        if (role === 'rider') {
            setUser(MOCK_USER_RIDER);
            setView('dashboard');
        } else {
            setUser({ ...MOCK_USER_RIDER, name: 'New Driver', isDriver: true, phoneNumber: '0711223344', favoriteDrivers: [], savedLocations: [] });
            setView('onboarding');
        }
    };

    const handleOnboardingComplete = (details: { carDetails: Car; kraPin?: string }) => {
        if(user) {
            setUser({ ...user, car: details.carDetails, kraPin: details.kraPin, isDriver: true });
            setView('dashboard');
        }
    };

    const handleCreateRide = (rideData: Omit<Ride, 'id' | 'driver' | 'currentLocation' | 'route' | 'riders' | 'status' | 'rideType' | 'pendingRequests' | 'shareCode'>) => {
        if (user && user.isDriver) {
            const shareCode = `${Math.random().toString(36).substring(2, 5).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
            const newRide: Ride = {
                id: `ride-${Date.now()}`,
                driver: user,
                ...rideData,
                riders: [],
                pendingRequests: [],
                status: 'scheduled',
                rideType: 'scheduled',
                shareCode
            };
            setRides(prev => [newRide, ...prev]);
        }
    };

    const handleStartInstantDrive = (destination: string) => {
        if (user && user.isDriver) {
             const newRide: Ride = {
                id: `ride-instant-${Date.now()}`,
                driver: user,
                origin: "Driver's Current Location", // This would be dynamic
                destination,
                departureTime: new Date(),
                availableSeats: user.car?.type === 'Sedan' ? 3 : 4,
                totalSeats: user.car?.type === 'Sedan' ? 3 : 4,
                fare: 400, // This would be calculated
                riders: [],
                pendingRequests: [],
                status: 'in-progress',
                rideType: 'instant',
                originCoords: { lat: -1.2921, lng: 36.8219 }, // Mocked start location
                destinationCoords: { lat: -1.286389, lng: 36.817223 }, // Mocked destination
                currentLocation: { lat: -1.2921, lng: 36.8219 },
            };
            setRides(prev => [newRide, ...prev]);
            alert(`Instant drive to ${destination} started! You are now visible to nearby riders.`);
        }
    };

    const handleCancelRide = (rideId: string) => {
        setRides(prev => prev.map(r => r.id === rideId ? { ...r, status: 'cancelled' } : r));
    };

    const handleEndRide = (rideId: string) => {
        const rideToEnd = rides.find(r => r.id === rideId);
        if (rideToEnd && user) {
            setRides(prev => {
                const newRides = prev.map(r => r.id === rideId ? { ...r, status: 'completed' } : r);
                const updatedDriver = updateUserBadges(rideToEnd.driver, newRides);

                if(user.id === updatedDriver.id) setUser(updatedDriver);

                return newRides.map(r => r.driver.id === updatedDriver.id ? {...r, driver: updatedDriver} : r);
            });
            alert(`Ride to ${rideToEnd.destination} has been marked as completed.`);
            // For driver to rate the first passenger
            if (rideToEnd.riders.length > 0) {
                 setRatingTask({ ride: rideToEnd, ratee: rideToEnd.riders[0] }); 
            }
        }
    };

    const handleRequestSeat = (rideId: string) => {
        const rideToBook = rides.find(r => r.id === rideId);
        if (!user || !rideToBook) return;
        
        const isAlreadyBooked = rideToBook.riders.some(r => r.id === user.id);
        const isAlreadyPending = rideToBook.pendingRequests.some(r => r.id === user.id);
        if (isAlreadyBooked || isAlreadyPending) {
            alert("You have already booked or requested this ride.");
            return;
        }

        const tenMinutes = 10 * 60 * 1000;
        const conflict = rides.find(r => 
            r.riders.some(rider => rider.id === user.id) && 
            r.status === 'scheduled' &&
            Math.abs(r.departureTime.getTime() - rideToBook.departureTime.getTime()) < tenMinutes
        );

        if (conflict) {
            alert(`Request failed: This ride's departure time is too close to your already booked ride to "${conflict.destination}". Please cancel the other ride first.`);
            return;
        }

        setRides(prev => prev.map(r => r.id === rideId ? { ...r, pendingRequests: [...r.pendingRequests, user] } : r));
        alert('Request sent to driver! You will be notified upon approval.');
    };

    const handleApproveRequest = (rideId: string, riderId: string) => {
        setRides(prev => prev.map(r => {
            if (r.id === rideId && r.availableSeats > 0) {
                const riderToApprove = r.pendingRequests.find(p => p.id === riderId);
                if (!riderToApprove) return r;
                return {
                    ...r,
                    availableSeats: r.availableSeats - 1,
                    riders: [...r.riders, riderToApprove],
                    pendingRequests: r.pendingRequests.filter(p => p.id !== riderId)
                };
            }
            return r;
        }));
    };
    
    const handleRejectRequest = (rideId: string, riderId: string) => {
        setRides(prev => prev.map(r => r.id === rideId ? { ...r, pendingRequests: r.pendingRequests.filter(p => p.id !== riderId) } : r));
    };
    
    const handleUpdateProfile = (updatedDetails: Partial<User>) => {
        if (!user) return;
        
        const updatedUser = { ...user, ...updatedDetails, car: updatedDetails.car ? {...user.car, ...updatedDetails.car} : user.car };
        setUser(updatedUser);

        setRides(prevRides => prevRides.map(ride => {
            let newRide = { ...ride };
            if (ride.driver.id === user.id) {
                newRide.driver = { ...newRide.driver, ...updatedDetails, car: updatedDetails.car ? {...newRide.driver.car, ...updatedDetails.car} : newRide.driver.car };
            }
            newRide.riders = ride.riders.map(rider => 
                rider.id === user.id ? { ...rider, ...updatedDetails, car: updatedDetails.car ? {...rider.car, ...updatedDetails.car} : rider.car } : rider
            );
            newRide.pendingRequests = ride.pendingRequests.map(req => 
                req.id === user.id ? { ...req, ...updatedDetails, car: updatedDetails.car ? {...req.car, ...updatedDetails.car} : req.car } : req
            );
            return newRide;
        }));

        if (profileViewTarget && profileViewTarget.id === user.id) {
            setProfileViewTarget(updatedUser);
        }

        alert('Profile updated successfully!');
    };

    const handleExtendDepartureTime = (rideId: string, newTime: Date) => {
        setRides(prev => prev.map(r => r.id === rideId ? { ...r, departureTime: newTime } : r));
        alert('Departure time has been updated!');
    };

    const handleNotifyPassengers = (rideId: string) => {
        const ride = rides.find(r => r.id === rideId);
        if (ride) {
            setRides(prev => prev.map(r => r.id === rideId ? { ...r, status: 'in-progress' } : r));
            const passengerNames = ride.riders.map(r => r.name).join(', ');
            alert(ride.riders.length > 0 ? `Notifying ${passengerNames}: The ride to ${ride.destination} is starting now!` : 'Starting journey.');
        }
    };
    
    const handleTrackRide = (rideId: string) => {
        setActiveRideId(rideId);
        setView('live-ride');
    };

    const handleNavigate = (newView: 'dashboard' | 'history' | 'earnings' | 'profile') => {
        if(newView === 'profile') setProfileViewTarget(user);
        setActiveRideId(null);
        setView(newView);
    }
    
    const handleShowProfile = (userId: string) => {
        const targetUser = rides.map(r => r.driver).concat(rides.flatMap(r => r.riders)).find(u => u.id === userId) || (user?.id === userId ? user : null);
        if(targetUser) {
            setProfileViewTarget(targetUser);
            setView('profile');
        }
    }
    
    const handleLogout = () => {
        setUser(null);
        setView('role-selection');
        localStorage.removeItem('ecoRideUser');
        // Not removing rides so they persist for next login
    };

    const handleRatingSubmit = (task: RatingTask, rating: number, comment: string) => {
        console.log(`Rating for ${task.ratee.name} in ride ${task.ride.id}: ${rating} stars, comment: "${comment}"`);
        setRatingTask(null);
        alert('Thanks for your feedback!');
    };

    const handleRateFromHistory = (ride: Ride) => {
        if (!user) return;
        // Rider rates driver
        if (!user.isDriver) {
            setRatingTask({ ride, ratee: ride.driver });
        }
    }

    const renderContent = () => {
        if (!user && view !== 'role-selection') { // Handle case where user is logged out
            setView('role-selection');
            return <RoleSelector onSelect={handleRoleSelect} />;
        }
        if (!user || view === 'role-selection') return <RoleSelector onSelect={handleRoleSelect} />;

        const activeRide = rides.find(r => r.id === activeRideId);
        if (view === 'live-ride' && activeRide) {
            return <LiveRideTracker ride={activeRide} onBack={() => { setActiveRideId(null); setView('dashboard'); }} />;
        }
        
        if (view === 'onboarding') return <DriverOnboarding onOnboardingComplete={handleOnboardingComplete} />
        
        if (view === 'profile' && profileViewTarget) {
            return <ProfilePage 
                user={profileViewTarget} 
                allRides={rides}
                onBack={() => setView('dashboard')} 
                isCurrentUser={user.id === profileViewTarget.id}
                onUpdateProfile={handleUpdateProfile}
            />
        }

        switch (view) {
            case 'dashboard':
                return user.isDriver ? (
                    <DriverDashboard
                        driver={user}
                        driverRides={rides.filter(r => r.driver.id === user.id && (r.status === 'scheduled' || r.status === 'in-progress'))}
                        onCreateRide={handleCreateRide}
                        onStartInstantDrive={handleStartInstantDrive}
                        onCancelRide={handleCancelRide}
                        onEndRide={handleEndRide}
                        onExtendDepartureTime={handleExtendDepartureTime}
                        onNotifyPassengers={handleNotifyPassengers}
                        onApproveRequest={handleApproveRequest}
                        onRejectRequest={handleRejectRequest}
                    />
                ) : (
                    <RiderDashboard
                        user={user}
                        availableRides={rides}
                        onRequestSeat={handleRequestSeat}
                        onShowProfile={handleShowProfile}
                        onTrackRide={handleTrackRide}
                    />
                );
            case 'history':
                return <RideHistory user={user} rides={rides} onRateRide={handleRateFromHistory} />;
            case 'earnings':
                 if (!user.isDriver) return null;
                 return <EarningsDashboard user={user} completedRides={rides.filter(r => r.driver.id === user.id && r.status === 'completed')} />;
            default:
                return <RoleSelector onSelect={handleRoleSelect} />;
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen text-white font-sans">
            <Header user={user} currentView={view as any} onNavigate={handleNavigate} onLogout={handleLogout} />
            <main className="container mx-auto p-4 md:p-8">
                {renderContent()}
            </main>
            <RatingModal task={ratingTask} onClose={() => setRatingTask(null)} onSubmit={handleRatingSubmit} />
        </div>
    );
};

export default App;