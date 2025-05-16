'use client';

import React, { useEffect } from 'react';

interface UserSwitcherProps {
  userName: string;
  profilePicture?: string;
  onSwitch?: () => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({
  userName,
  profilePicture = '/api/placeholder/200/200',
  onSwitch = () => {},
}) => {
  useEffect(() => {
    onSwitch();
  }, [onSwitch]);

  return (
    <div className="flex flex-col items-center justify-between max-h-[50vh] bg-black text-black">
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

            <svg
              className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 10l5-5 5 5" />
            </svg>
            <svg
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 14l5 5 5-5" />
            </svg>
          </div>

          {/* Text */}
          <div className="text-center">
            <p className="text-xl">Changement vers</p>
            <p className="text-xl font-bold truncate max-w-xs">{userName}</p>
          </div>

          {/* logo */}
          <div className="w-full bg-white py-8 flex justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">f</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default UserSwitcher;
