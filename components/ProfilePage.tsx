// Fix: Create ProfilePage.tsx component to display user profiles.
import React from 'react';
import { User, Ride } from '../types';

interface ProfilePageProps {
  user: User;
  userRides: Ride[];
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, userRides, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 text-primary font-semibold hover:underline">
        &larr; Back to Dashboard
      </button>
      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-8">
        <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full border-4 border-primary" />
        <div>
          <h1 className="text-4xl font-bold text-dark">{user.name}</h1>
          <p className="text-xl text-gray-300 mt-1">{user.isDriver ? 'Verified Driver' : 'Rider'}</p>
          <div className="flex items-center text-yellow-400 text-lg mt-2">
            {'★'.repeat(Math.round(user.rating))}
            {'☆'.repeat(5 - Math.round(user.rating))}
            <span className="text-gray-400 text-sm ml-2">({user.rating.toFixed(1)})</span>
          </div>
          {user.isDriver && user.car && (
            <div className="mt-4 text-sm text-gray-400 bg-slate-700/50 p-3 rounded-lg">
                <p><strong>Vehicle:</strong> {user.car.model} ({user.car.type})</p>
                <div className="flex items-center gap-2">
                    <strong>Color:</strong>
                    <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: user.car.color }}></span>
                    <span>{user.car.color}</span>
                </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-dark mb-4">Recent Reviews</h2>
        {/* Placeholder for reviews */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-8 rounded-xl shadow-lg text-center text-gray-400">
            <p>Reviews will be shown here.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
