// Fix: Create the main App.tsx component to structure and manage the application.
import React, { useState, useEffect } from 'react';
import { User, Ride, Car } from './types';
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
const MOCK_USER_RIDER: User = { id: 'user-1', name: 'Alex Rider', avatar: `https://i.pravatar.cc/150?u=alex`, rating: 4.8, isDriver: false, phoneNumber: '0712345678' };
const MOCK_USER_DRIVER: User = { 
  id: 'user-2', 
  name: 'Ben Driver', 
  avatar: `https://i.pravatar.cc/150?u=ben`, 
  rating: 4.9, 
  isDriver: true,
  car: { model: 'Toyota Prius', type: 'Hybrid', color: '#cccccc' },
  kraPin: 'A001234567Z',
  phoneNumber: '0787654321',
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
        status: 'scheduled',
        rideType: 'scheduled',
        originCoords: { lat: -1.286389, lng: 36.817223 },
        destinationCoords: { lat: -1.3032, lng: 36.8204 },
    },
    {
        id: 'ride-2',
        driver: { ...MOCK_USER_DRIVER, id: 'user-3', name: 'Chloe Drive', avatar: 'https://i.pravatar.cc/150?u=chloe', phoneNumber: '0722000000' },
        origin: 'Oakridge Shopping Mall',
        destination: 'Seaside Heights Beach',
        departureTime: new Date(Date.now() + 3600 * 1000 * 4), // 4 hours from now
        availableSeats: 4,
        totalSeats: 4,
        fare: 500,
        riders: [],
        status: 'scheduled',
        rideType: 'scheduled',
        originCoords: { lat: -1.314, lng: 36.832 },
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
        status: 'completed',
        rideType: 'scheduled',
        originCoords: { lat: -1.286389, lng: 36.817223 },
    }
];


type View = 'role-selection' | 'onboarding' | 'dashboard' | 'history' | 'earnings' | 'profile' | 'live-ride';
type ProfileViewTarget = User | null;

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [rides, setRides] = useState<Ride[]>([]);
    const [view, setView] = useState<View>('role-selection');
    const [profileViewTarget, setProfileViewTarget] = useState<ProfileViewTarget>(null);
    const [ratingRide, setRatingRide] = useState<Ride | null>(null);
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
            setUser({ ...MOCK_USER_RIDER, name: 'New Driver', isDriver: true, phoneNumber: '0711223344' });
            setView('onboarding');
        }
    };

    const handleOnboardingComplete = (details: { carDetails: Car; kraPin?: string }) => {
        if(user) {
            setUser({ ...user, car: details.carDetails, kraPin: details.kraPin, isDriver: true });
            setView('dashboard');
        }
    };

    const handleCreateRide = (rideData: Omit<Ride, 'id' | 'driver' | 'currentLocation' | 'route' | 'riders' | 'status' | 'rideType'>) => {
        if (user && user.isDriver) {
            const newRide: Ride = {
                id: `ride-${Date.now()}`,
                driver: user,
                ...rideData,
                riders: [],
                status: 'scheduled',
                rideType: 'scheduled',
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
        setRides(prev => prev.map(r => r.id === rideId ? { ...r, status: 'completed' } : r));
        if (rideToEnd) {
             alert(`Ride to ${rideToEnd.destination} has been marked as completed.`);
             setRatingRide(rideToEnd); // Prompt for rating upon completion
        }
    };

    const handleBookSeat = (rideId: string) => {
        const rideToBook = rides.find(r => r.id === rideId);
        if (!user || !rideToBook) return;

        // Double-booking check
        const userBookedRides = rides.filter(r => 
            r.riders.some(rider => rider.id === user.id) && r.status === 'scheduled'
        );

        const tenMinutes = 10 * 60 * 1000;
        const conflict = userBookedRides.find(bookedRide => 
            Math.abs(bookedRide.departureTime.getTime() - rideToBook.departureTime.getTime()) < tenMinutes
        );

        if (conflict) {
            alert(`Booking failed: This ride's departure time is too close to your already booked ride to "${conflict.destination}". Please cancel the other ride first.`);
            return;
        }

        setRides(prev => prev.map(r => {
            if (r.id === rideId && r.availableSeats > 0) {
                const updatedRide = { ...r, availableSeats: r.availableSeats - 1, riders: [...r.riders, user] };
                alert('Ride booked successfully! Track its progress on your dashboard.');
                return updatedRide;
            }
            return r;
        }));
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
        const targetUser = rides.find(r => r.driver.id === userId)?.driver || MOCK_RIDES.flatMap(r => r.riders).find(u => u.id === userId) || (user?.id === userId ? user : null);
        if(targetUser) {
            setProfileViewTarget(targetUser);
            setView('profile');
        }
    }
    
    const handleLogout = () => {
        setUser(null);
        setView('role-selection');
        localStorage.removeItem('ecoRideUser');
        localStorage.removeItem('ecoRideRides'); // Or reset to mocks
    };

    const handleRatingSubmit = (rideId: string, rating: number, comment: string) => {
        console.log(`Rating for ride ${rideId}: ${rating} stars, comment: "${comment}"`);
        setRatingRide(null);
        alert('Thanks for your feedback!');
    };

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
                onBack={() => setView('dashboard')} 
                isCurrentUser={user.id === profileViewTarget.id}
                onUpdateProfile={handleUpdateProfile}
            />
        }

        switch (view) {
            case 'dashboard':
                return user.isDriver ? (
                    <DriverDashboard
                        driverRides={rides.filter(r => r.driver.id === user.id && (r.status === 'scheduled' || r.status === 'in-progress'))}
                        onCreateRide={handleCreateRide}
                        onStartInstantDrive={handleStartInstantDrive}
                        onCancelRide={handleCancelRide}
                        onEndRide={handleEndRide}
                        onExtendDepartureTime={handleExtendDepartureTime}
                        onNotifyPassengers={handleNotifyPassengers}
                    />
                ) : (
                    <RiderDashboard
                        user={user}
                        availableRides={rides}
                        onBookSeat={handleBookSeat}
                        onShowProfile={handleShowProfile}
                        onTrackRide={handleTrackRide}
                    />
                );
            case 'history':
                return <RideHistory user={user} rides={rides} onRateRide={setRatingRide} />;
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
            <RatingModal ride={ratingRide} onClose={() => setRatingRide(null)} onSubmit={handleRatingSubmit} />
        </div>
    );
};

export default App;