'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import useAuth from '../../hooks/useAuth';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  const menuItems = [
    { 
      label: 'Dashboard', 
      href: '/dashboard',
      accessibleTo: ['admin', 'doctor', 'patient'],
      active: pathname === '/dashboard' || pathname === '/dashboard/index'
    },
    { 
      label: 'My Profile', 
      href: '/dashboard/profile',
      accessibleTo: ['admin', 'doctor', 'patient'],
      active: pathname === '/dashboard/profile'
    },
    { 
      label: 'Appointments', 
      href: '/dashboard/appointment',
      accessibleTo: ['admin', 'doctor', 'patient'],
      active: pathname === '/dashboard/appointment'
    },
    { 
      label: 'Book Appointment', 
      href: '/dashboard/book-appointment',
      accessibleTo: ['patient'],
      active: pathname === '/dashboard/book-appointment'
    },
    { 
      label: 'My Availability', 
      href: '/dashboard/availability',
      accessibleTo: ['doctor'],
      active: pathname === '/dashboard/availability'
    },
    { 
      label: 'Doctors', 
      href: '/dashboard/doctors',
      accessibleTo: ['admin', 'patient'],
      active: pathname === '/dashboard/doctors'
    },
    { 
      label: 'Doctor Approval', 
      href: '/dashboard/doctor-approval',
      accessibleTo: ['admin'],
      active: pathname === '/dashboard/doctor-approval'
    },
    { 
      label: 'Users', 
      href: '/dashboard/users',
      accessibleTo: ['admin'],
      active: pathname === '/dashboard/users'
    },
    { 
      label: 'Medical Records', 
      href: '/dashboard/document',
      accessibleTo: ['doctor', 'patient'],
      active: pathname === '/dashboard/document'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.accessibleTo.includes(user?.role || '')
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden fixed top-4 right-4 z-20 bg-primary-600 text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-10 w-64 bg-gray-800 text-white transition-transform duration-300 transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-700">
            <Link href="/dashboard" className="flex items-center">
              <Image src="/file.svg" alt="Logo" width={36} height={36} className="w-8 h-8" />
              <span className="ml-2 text-xl font-semibold">HMS</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {filteredMenuItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white
                      ${item.active ? 'bg-gray-700 text-white border-l-4 border-primary-500' : ''}
                    `}
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-700">
            <button 
              onClick={logout} 
              className="flex items-center text-gray-300 hover:text-white"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}