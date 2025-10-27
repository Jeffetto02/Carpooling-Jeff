// Fix: Create ProfilePage.tsx component to display user profiles.
import React, { useState, useEffect } from 'react';
import { User, Ride, Car } from '../types';

interface ProfilePageProps {
  user: User;
  onBack: () => void;
  isCurrentUser: boolean;
  onUpdateProfile: (updatedDetails: Partial<User>) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onBack, isCurrentUser, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
      name: user.name,
      phoneNumber: user.phoneNumber || '',
      carModel: user.car?.model || '',
      carType: user.car?.type || '',
      carColor: user.car?.color || '#ffffff',
      kraPin: user.kraPin || ''
  });

  useEffect(() => {
    setFormData({
      name: user.name,
      phoneNumber: user.phoneNumber || '',
      carModel: user.car?.model || '',
      carType: user.car?.type || '',
      carColor: user.car?.color || '#ffffff',
      kraPin: user.kraPin || ''
    });
  }, [user, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSave = () => {
    const updatedDetails: Partial<User> = { 
        name: formData.name,
        phoneNumber: formData.phoneNumber
    };
    if(user.isDriver) {
        updatedDetails.kraPin = formData.kraPin;
        updatedDetails.car = {
            model: formData.carModel,
            type: formData.carType,
            color: formData.carColor
        };
    }
    onUpdateProfile(updatedDetails);
    setIsEditing(false);
  };

  const renderViewMode = () => (
    <>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full border-4 border-primary" />
        <div className="flex-grow">
          <h1 className="text-4xl font-bold text-dark">{user.name}</h1>
          <p className="text-xl text-gray-300 mt-1">{user.isDriver ? 'Verified Driver' : 'Rider'}</p>
          <div className="flex items-center text-yellow-400 text-lg mt-2">
            {'★'.repeat(Math.round(user.rating))}
            {'☆'.repeat(5 - Math.round(user.rating))}
            <span className="text-gray-400 text-sm ml-2">({user.rating.toFixed(1)})</span>
          </div>
          {user.phoneNumber && <p className="text-sm text-gray-400 mt-2">Contact: {user.phoneNumber}</p>}
          {user.isDriver && user.car && (
            <div className="mt-4 text-sm text-gray-400 bg-slate-700/50 p-3 rounded-lg">
                <p><strong>Vehicle:</strong> {user.car.model} ({user.car.type})</p>
                <div className="flex items-center gap-2">
                    <strong>Color:</strong>
                    <span className="w-4 h-4 rounded-full inline-block border border-slate-500" style={{ backgroundColor: user.car.color }}></span>
                    <span className="font-mono">{user.car.color}</span>
                </div>
            </div>
          )}
        </div>
        {isCurrentUser && (
            <button onClick={() => setIsEditing(true)} className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary-dark transition-colors self-start md:self-center">
                Edit Profile
            </button>
        )}
      </div>
    </>
  );

  const renderEditMode = () => (
      <div>
        <h2 className="text-3xl font-bold text-dark mb-6">Edit Profile</h2>
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">Phone Number</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
            </div>
            {user.isDriver && (
                <>
                <div>
                    <h3 className="text-xl font-bold text-dark mb-4 border-t border-slate-700 pt-6">Vehicle Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label htmlFor="carModel" className="block text-sm font-medium text-gray-300">Car Model</label>
                            <input type="text" id="carModel" name="carModel" value={formData.carModel} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                         <div>
                            <label htmlFor="carType" className="block text-sm font-medium text-gray-300">Car Type</label>
                            <input type="text" id="carType" name="carType" value={formData.carType} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="carColor" className="block text-sm font-medium text-gray-300">Car Color</label>
                            <div className="flex items-center gap-4 mt-1">
                                <input type="color" id="carColor" name="carColor" value={formData.carColor} onChange={handleChange} className="w-12 h-10 p-1 bg-slate-700 border border-slate-600 rounded-md cursor-pointer"/>
                                <span className="px-3 py-2 rounded-md bg-slate-700 text-sm font-mono">{formData.carColor}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-dark mb-2 border-t border-slate-700 pt-6">Tax Information</h3>
                    <label htmlFor="kraPin" className="block text-sm font-medium text-gray-300">KRA PIN</label>
                    <input type="text" id="kraPin" name="kraPin" value={formData.kraPin} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
                </>
            )}
             <div className="flex justify-end gap-4 pt-6 border-t border-slate-700">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-md text-sm font-medium bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors">Save Changes</button>
             </div>
        </div>
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 text-primary font-semibold hover:underline">
        &larr; Back to Dashboard
      </button>
      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-8 rounded-xl shadow-lg">
          {isEditing && isCurrentUser ? renderEditMode() : renderViewMode()}
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