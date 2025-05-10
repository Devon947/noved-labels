'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import MetaTags from '../components/MetaTags';
import LoginCheck from '../components/LoginCheck';
import TimedPopup from '../components/TimedPopup';

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    referral: ''
  });
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [prizes, setPrizes] = useState(null);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    // Fetch leaderboard and prizes
    fetch('/api/waitlist')
      .then(res => res.json())
      .then(data => {
        setLeaderboard(data.leaderboard);
        setPrizes(data.prizes);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully joined the waitlist!');
        setFormData({ name: '', email: '', phone: '', referral: '' });
        // Refresh leaderboard
        const leaderboardRes = await fetch('/api/waitlist');
        const leaderboardData = await leaderboardRes.json();
        setLeaderboard(leaderboardData.leaderboard);
      } else {
        toast.error(data.error || 'Failed to join waitlist');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginCheck>
      <>
        <MetaTags
          title="Join Our Waitlist - Win Amazing Prizes"
          description="Join the NOVEDLabels waitlist for a chance to win AirPods Pro 4 ANC or Nike Air Force 1 Low. Limited time giveaway!"
        />
        
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                Join Our Waitlist
              </h1>
              <p className="text-xl text-gray-300">
                Be among the first to experience NOVEDLabels and win amazing prizes!
              </p>
            </motion.div>

            {/* Prizes Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 gap-8 mb-12"
            >
              {prizes && Object.entries(prizes).map(([key, prize]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800 rounded-xl p-6 shadow-xl"
                >
                  <div className="relative h-48 mb-4">
                    <img
                      src={prize.image}
                      alt={prize.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{prize.name}</h3>
                  <p className="text-gray-400">{prize.description}</p>
                  <div className="mt-4 text-sm text-blue-400">
                    {key === 'first' ? '1st Place Prize' : '2nd Place Prize'}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Referral Code (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.referral}
                    onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? 'Joining...' : 'Join Waitlist'}
                </motion.button>
              </form>
            </motion.div>

            {/* Leaderboard Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Top Referrers</h2>
              <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-blue-400">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{entry.name}</div>
                          <div className="text-sm text-gray-400">{entry.points} points</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {entry.entries} entries
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Timed Popup */}
        <TimedPopup 
          delay={5000} 
          onClose={() => setShowPopup(false)}
        >
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2 text-blue-400">Don't Miss Out!</h3>
            <p className="text-gray-300 mb-4">
              Join our waitlist now for a chance to win amazing prizes and be among the first to experience NOVEDLabels!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPopup(false)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Join Now
            </motion.button>
          </div>
        </TimedPopup>
      </>
    </LoginCheck>
  );
} 