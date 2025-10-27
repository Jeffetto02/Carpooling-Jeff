// Fix: Create RatingModal.tsx component for rating rides.
import React, { useState, useEffect } from 'react';
import { Ride, User } from '../types';

interface RatingTask {
    ride: Ride;
    ratee: User;
}

interface RatingModalProps {
  task: RatingTask | null;
  onClose: () => void;
  onSubmit: (task: RatingTask, rating: number, comment: string) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ task, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (task) {
        setRating(5);
        setComment('');
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task, rating, comment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
        <h2 className="text-2xl font-bold text-dark mb-4">Rate Your Experience</h2>
        <p className="text-gray-400 mb-6">How was your interaction with <span className="font-semibold text-primary">{task.ratee.name}</span> on the ride to <span className="font-semibold text-primary">{task.ride.destination}</span>?</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
            <div className="flex justify-center text-4xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-300">Comment (Optional)</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Tell us more about your experience..."
              className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300">
            Submit Rating
          </button>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;