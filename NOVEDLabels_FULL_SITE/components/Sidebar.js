'use client';

// components/Sidebar.js
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  TruckIcon,
  UserGroupIcon,
  StarIcon,
  PlusCircleIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  Cog8ToothIcon,
  TicketIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Ship', href: '/ship', icon: TruckIcon },
  { name: 'Tickets', href: '/dashboard/tickets', icon: TicketIcon },
  { name: 'Referral', href: '/referral', icon: UserGroupIcon },
  { name: 'Partner', href: '/partner', icon: StarIcon },
  { name: 'Earn', href: '/earn', icon: CurrencyDollarIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog8ToothIcon },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            NOVED
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;