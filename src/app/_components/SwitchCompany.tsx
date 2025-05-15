'use client';

import React from 'react';

interface UserSwitcherProps {
  userName: string;
  profilePicture?: string;
  onSwitch?: () => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({
  userName,
  profilePicture = '/api/placeholder/200/200',
  onSwitch
}) => {
  const handleSwitchUser = () => {
    if (onSwitch) {
      onSwitch();
    } else {
      console.log('Switching to user:', userName);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-black text-black">
      {/* Status bar */}
      <div className="w-full px-4 py-2 flex justify-between items-center bg-white">
        <div className="text-lg font-medium">23:50</div>
        <div className="flex items-center space-x-2">
          <span className="text-xs">4g+</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="10" width="3" height="10" />
            <rect x="8" y="7" width="3" height="13" />
            <rect x="13" y="4" width="3" height="16" />
            <rect x="18" y="2" width="3" height="18" />
          </svg>
          <div className="relative">
            <div className="w-10 h-5 bg-green-500 rounded-full flex items-center px-1">
              <div className="text-xs font-bold text-white">82</div>
            </div>
            <svg className="w-4 h-4 absolute right-0 top-0 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L13 10 21 10" transform="rotate(45 13 10)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full flex-1 flex flex-col">
        <div className="w-full h-full bg-white rounded-lg flex flex-col items-center justify-center p-8">
          {/* Profile picture with sync arrows */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden border-2 border-gray-300">
              <img
                src={profilePicture}
                alt={`${userName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            <div
              className="absolute inset-0 w-full h-full rounded-full border-2 border-gray-300 border-dashed animate-spin"
              style={{ animationDuration: '8s' }}
            ></div>

            <svg className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 10l5-5 5 5" />
            </svg>
            <svg className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 14l5 5 5-5" />
            </svg>
          </div>

          {/* Text */}
          <div className="text-center">
            <p className="text-xl">Changement vers</p>
            <p className="text-xl font-bold truncate max-w-xs">{userName}</p>
          </div>

          {/* Optional: Add a button to trigger onSwitch */}
          <button
            onClick={handleSwitchUser}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full"
          >
            Utiliser ce compte
          </button>
        </div>
      </div>

      {/* Facebook logo */}
      <div className="w-full bg-white py-8 flex justify-center">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl font-bold">f</span>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="w-full bg-black h-16 flex justify-around items-center">
        <div className="w-8 h-8 bg-gray-400 rounded"></div>
        <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-300"></div>
        <div className="w-8 h-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M20 12l-8 8-8-8" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default UserSwitcher;
