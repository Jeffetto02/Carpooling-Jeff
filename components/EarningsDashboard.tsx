import React from 'react';
import { Ride, User } from '../types';
import { APP_COMMISSION_RATE, TAXABLE_INCOME_THRESHOLD, KRA_TAX_RATE } from '../constants';

interface EarningsDashboardProps {
    user: User;
    completedRides: Ride[];
}

const formatCurrency = (amount: number) => `Ksh ${amount.toFixed(2)}`;

const EarningsDashboard: React.FC<EarningsDashboardProps> = ({ user, completedRides }) => {
    const grossEarnings = completedRides.reduce((sum, ride) => sum + (ride.fare * ride.totalSeats), 0);
    const appCommission = grossEarnings * APP_COMMISSION_RATE;
    const netEarningsBeforeTax = grossEarnings - appCommission;
    
    const isTaxable = netEarningsBeforeTax > TAXABLE_INCOME_THRESHOLD;
    const taxDeducted = isTaxable && user.kraPin ? netEarningsBeforeTax * KRA_TAX_RATE : 0;
    
    const finalPayout = netEarningsBeforeTax - taxDeducted;

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-dark">Earnings Summary</h1>
                <p className="text-lg text-gray-400 mt-2">Your financial performance on EcoRide.</p>
            </div>

            {/* --- Summary Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-6 rounded-xl shadow-lg text-center">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase">Gross Earnings</h3>
                    <p className="text-3xl font-bold text-dark mt-2">{formatCurrency(grossEarnings)}</p>
                </div>
                 <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-6 rounded-xl shadow-lg text-center">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase">App Commission ({APP_COMMISSION_RATE * 100}%)</h3>
                    <p className="text-3xl font-bold text-red-400 mt-2">- {formatCurrency(appCommission)}</p>
                </div>
                 <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-6 rounded-xl shadow-lg text-center">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase">KRA Tax Deduction</h3>
                    <p className="text-3xl font-bold text-yellow-400 mt-2">- {formatCurrency(taxDeducted)}</p>
                    {!user.kraPin && isTaxable && <p className="text-xs text-yellow-500 mt-1">Add KRA PIN to enable payout.</p>}
                </div>
                 <div className="bg-green-800/30 backdrop-blur-lg border border-green-600 p-6 rounded-xl shadow-lg text-center">
                    <h3 className="text-sm font-semibold text-green-300 uppercase">Your Net Payout</h3>
                    <p className="text-3xl font-bold text-green-300 mt-2">{formatCurrency(finalPayout)}</p>
                </div>
            </div>

            {/* --- Tax Information Notice --- */}
            {isTaxable && !user.kraPin && (
                <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg relative text-center">
                    <strong className="font-bold">Action Required: </strong>
                    <span className="block sm:inline">Your earnings have reached the taxable threshold. Please update your profile with your KRA PIN to ensure compliance and receive your payout.</span>
                </div>
            )}
            
            {/* --- Completed Rides History --- */}
            <div>
                 <h2 className="text-3xl font-bold text-dark mb-6">Earnings History</h2>
                 <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl shadow-lg overflow-hidden">
                    <div className="divide-y divide-slate-700">
                        {completedRides.length > 0 ? completedRides.map(ride => (
                             <div key={ride.id} className="p-4 flex items-center justify-between hover:bg-slate-700/30">
                                <div>
                                    <p className="font-bold text-dark">{ride.destination}</p>
                                    <p className="text-sm text-gray-400">From: {ride.origin}</p>
                                    <p className="text-xs text-gray-500 mt-1">{ride.departureTime.toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-lg text-green-400">+ {formatCurrency(ride.fare * ride.totalSeats)}</p>
                                    <p className="text-xs text-gray-400">{ride.totalSeats} seats</p>
                                </div>
                             </div>
                        )) : (
                            <p className="p-8 text-center text-gray-400">You have no completed rides yet. Your earnings will appear here once you finish a trip.</p>
                        )}
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default EarningsDashboard;