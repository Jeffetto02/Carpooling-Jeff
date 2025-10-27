// Fix: Create Header.tsx component for navigation.
import React from 'react';
import { User } from '../types';

type NavView = 'dashboard' | 'history' | 'earnings' | 'profile';

interface HeaderProps {
  user: User | null;
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentView, onNavigate, onLogout }) => {
  if (!user) return null;
  
  const NavLink: React.FC<{ view: NavView; children: React.ReactNode }> = ({ view, children }) => (
    <button
      onClick={() => onNavigate(view)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        currentView === view
          ? 'bg-primary text-white'
          : 'text-gray-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <header className="bg-slate-800/30 backdrop-blur-lg border-b border-slate-700 p-4 mb-8 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-dark">EcoRide</div>
        <nav className="flex items-center space-x-2 md:space-x-4">
          <NavLink view="dashboard">Dashboard</NavLink>
          <NavLink view="history">History</NavLink>
          {user.isDriver && <NavLink view="earnings">Earnings</NavLink>}
          <div className="flex items-center space-x-4 pl-4 border-l border-slate-700">
            <button onClick={() => onNavigate('profile')} className="flex items-center space-x-2">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                <span className="hidden md:block text-sm font-medium text-gray-200">{user.name}</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-md text-sm font-medium bg-slate-700 text-gray-300 hover:bg-red-600/80 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
