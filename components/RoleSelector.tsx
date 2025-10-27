import React from 'react';
import { Icons } from '../constants';

interface RoleSelectorProps {
  onSelect: (role: 'driver' | 'rider') => void;
}

const RoleCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl shadow-lg p-8 text-center cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 ease-in-out hover:border-primary"
  >
    <div className="flex justify-center items-center mb-4 text-primary">
      {icon}
    </div>
    <h2 className="text-2xl font-bold text-dark mb-2">{title}</h2>
    <p className="text-gray-400">{description}</p>
  </div>
);


const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-dark mb-4">Welcome to EcoRide!</h1>
        <p className="text-lg text-gray-300 mb-12 max-w-2xl">Your community carpooling solution. Share rides to save money, reduce traffic, and protect the environment. How are you traveling today?</p>
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
            <RoleCard
              title="Offer a Ride"
              description="Share your empty seats, set your own fare, and earn while you drive."
              icon={<Icons.Car className="w-20 h-20" />}
              onClick={() => onSelect('driver')}
            />
            <RoleCard
              title="Find a Ride"
              description="Book a comfortable and affordable ride with a trusted driver from your area."
              icon={<Icons.UserGroup className="w-20 h-20" />}
              onClick={() => onSelect('rider')}
            />
        </div>
    </div>
  );
};

export default RoleSelector;