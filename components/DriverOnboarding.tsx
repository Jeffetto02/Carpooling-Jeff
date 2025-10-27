import React, { useState } from 'react';
import { Car } from '../types';
import { Icons } from '../constants';

interface DriverOnboardingProps {
  onOnboardingComplete: (details: { carDetails: Car; kraPin?: string }) => void;
}

const DriverOnboarding: React.FC<DriverOnboardingProps> = ({ onOnboardingComplete }) => {
  const [model, setModel] = useState('');
  const [type, setType] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [kraPin, setKraPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !type) {
      alert('Please fill in your car model and type.');
      return;
    }
    
    setIsVerifying(true);
    // Simulate API call for verification
    setTimeout(() => {
        onOnboardingComplete({ carDetails: { model, type, color }, kraPin });
        setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-dark">Become a Driver</h1>
            <p className="text-lg text-gray-400 mt-2">Just a few more details to get you on the road.</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-8 rounded-xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <h3 className="text-xl font-bold text-dark mb-4">Your Vehicle Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="model" className="block text-sm font-medium text-gray-300">Car Model</label>
                            <input type="text" id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g., Toyota Camry" className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-300">Car Type</label>
                            <input type="text" id="type" value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g., Sedan" className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="color" className="block text-sm font-medium text-gray-300">Car Color</label>
                            <div className="flex items-center gap-4 mt-1">
                                <input type="color" id="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-10 p-1 bg-slate-700 border border-slate-600 rounded-md cursor-pointer"/>
                                <span className="px-3 py-2 rounded-md bg-slate-700 text-sm font-mono">{color}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-dark mb-2">Tax Information</h3>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label htmlFor="kraPin" className="block text-sm font-medium text-gray-300">KRA PIN (Optional)</label>
                            <input type="text" id="kraPin" value={kraPin} onChange={(e) => setKraPin(e.target.value)} placeholder="e.g., A123456789Z" className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                            <p className="text-xs text-gray-400 mt-2">Your KRA PIN is required to automate tax deductions for monthly earnings over Ksh 25,000.</p>
                        </div>
                    </div>
                </div>


                <div>
                    <h3 className="text-xl font-bold text-dark mb-2">Identity Verification</h3>
                    <div className="bg-slate-700/50 p-4 rounded-lg text-sm text-gray-300">
                        <p>For the safety of our community, we require drivers to verify their identity. This is a one-time process.</p>
                        <button type="button" className="text-secondary font-semibold mt-2 hover:underline">Learn more about verification</button>
                    </div>
                </div>

                <div>
                    <button 
                        type="submit" 
                        disabled={isVerifying}
                        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300 disabled:bg-slate-600 flex justify-center items-center"
                    >
                         {isVerifying ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Complete Setup & Start Driving'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default DriverOnboarding;