// Fix: Create the main App.tsx component to structure and manage the application.
import React, { useState } from 'react';
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

// Mock Data
const MOCK_USER_RIDER: User = { id: 'user-1', name: 'Alex Rider', avatar: `https://i.pravatar.cc/150?u=alex`, rating: 4.8, isDriver: false };
const MOCK_USER_DRIVER: User = { 
  id: 'user-2', 
  name: 'Ben Driver', 
  avatar: `https://i.pravatar.cc/150?u=ben`, 
  rating: 4.9, 
  isDriver: true,
  car: { model: 'Toyota Prius', type: 'Hybrid', color: '#cccccc' },
  kraPin: 'A001234567Z'
};
const MOCK_RIDES: Ride[] = [
    {
        id: 'ride-1',
        driver: MOCK_USER_DRIVER,
        origin: 'Maple Creek Residential',
        destination: 'Downtown Financial District',
        departureTime: new Date(Date.now() + 3600 * 1000 * 2), // 2 hours from now
        availableSeats: 2,
        totalSeats: 3,
        fare: 350,
        riders: [MOCK_USER_RIDER],
        status: 'scheduled',
    },
    {
        id: 'ride-2',
        driver: { ...MOCK_USER_DRIVER, id: 'user-3', name: 'Chloe Drive', avatar: 'https://i.pravatar.cc/150?u=chloe' },
        origin: 'Oakridge Shopping Mall',
        destination: 'Seaside Heights Beach',
        departureTime: new Date(Date.now() + 3600 * 1000 * 4), // 4 hours from now
        availableSeats: 4,
        totalSeats: 4,
        fare: 500,
        riders: [],
        status: 'scheduled',
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
        riders: [],
        status: 'completed',
    }
];


type View = 'role-selection' | 'onboarding' | 'dashboard' | 'history' | 'earnings' | 'profile';
type ProfileViewTarget = User | null;

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [rides, setRides] = useState<Ride[]>(MOCK_RIDES);
    const [view, setView] = useState<View>('role-selection');
    const [profileViewTarget, setProfileViewTarget] = useState<ProfileViewTarget>(null);
    const [ratingRide, setRatingRide] = useState<Ride | null>(null);

    const handleRoleSelect = (role: 'driver' | 'rider') => {
        if (role === 'rider') {
            setUser(MOCK_USER_RIDER);
            setView('dashboard');
        } else {
            // For driver, check if they have completed onboarding
            // For this mock, we assume they haven't and show onboarding.
            setUser({ ...MOCK_USER_RIDER, name: 'New Driver', isDriver: true });
            setView('onboarding');
        }
    };

    const handleOnboardingComplete = (details: { carDetails: Car; kraPin?: string }) => {
        if(user) {
            setUser({ ...user, car: details.carDetails, kraPin: details.kraPin, isDriver: true });
            setView('dashboard');
        }
    };

    const handleCreateRide = (rideData: Omit<Ride, 'id' | 'driver' | 'currentLocation' | 'route' | 'riders' | 'status'>) => {
        if (user && user.isDriver) {
            const newRide: Ride = {
                id: `ride-${Date.now()}`,
                driver: user,
                ...rideData,
                riders: [],
                status: 'scheduled',
            };
            setRides(prev => [newRide, ...prev]);
        }
    };

    const handleCancelRide = (rideId: string) => {
        setRides(prev => prev.map(r => r.id === rideId ? { ...r, status: 'cancelled' } : r));
    };

    const handleBookSeat = (rideId: string) => {
        setRides(prev => prev.map(r => {
            if (r.id === rideId && r.availableSeats > 0 && user) {
                return { ...r, availableSeats: r.availableSeats - 1, riders: [...r.riders, user] };
            }
            return r;
        }));
        alert('Ride booked successfully!');
    };

    const handleNavigate = (newView: 'dashboard' | 'history' | 'earnings' | 'profile') => {
        if(newView === 'profile') {
            setProfileViewTarget(user);
        }
        setView(newView);
    }
    
    const handleShowProfile = (userId: string) => {
        const targetUser = rides.find(r => r.driver.id === userId)?.driver || MOCK_RIDES.flatMap(r => r.riders).find(u => u.id === userId) || user;
        if(targetUser) {
            setProfileViewTarget(targetUser);
            setView('profile');
        }
    }
    
    const handleLogout = () => {
        setUser(null);
        setView('role-selection');
    };

    const handleRatingSubmit = (rideId: string, rating: number, comment: string) => {
        console.log(`Rating for ride ${rideId}: ${rating} stars, comment: "${comment}"`);
        setRatingRide(null); // Close modal
        alert('Thanks for your feedback!');
    };

    const renderContent = () => {
        if (!user || view === 'role-selection') {
            return <RoleSelector onSelect={handleRoleSelect} />;
        }
        
        if (view === 'onboarding') {
            return <DriverOnboarding onOnboardingComplete={handleOnboardingComplete} />
        }
        
        if (view === 'profile' && profileViewTarget) {
            return <ProfilePage user={profileViewTarget} userRides={[]} onBack={() => setView('dashboard')} />
        }

        switch (view) {
            case 'dashboard':
                return user.isDriver ? (
                    <DriverDashboard
                        onCreateRide={handleCreateRide}
                        driverRides={rides.filter(r => r.driver.id === user.id && r.status === 'scheduled')}
                        onCancelRide={handleCancelRide}
                    />
                ) : (
                    <RiderDashboard 
                        availableRides={rides.filter(r => r.status === 'scheduled')}
                        onBookSeat={handleBookSeat}
                        onShowProfile={handleShowProfile}
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
