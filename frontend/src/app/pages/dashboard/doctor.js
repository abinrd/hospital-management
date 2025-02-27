import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { fetchDoctors } from '../../lib/api';

export default function Doctors() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  
  // Fetch doctors
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Failed to load doctors:', error);
        showToast('Failed to load doctors', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, [showToast]);

  // Get unique specializations for filter
  const specializations = [...new Set(doctors.map(doctor => doctor.specialization))].sort();

  // Filter doctors based on search and specialization
  const filteredDoctors = doctors.filter(doctor => {
    const nameMatch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const specializationMatch = selectedSpecialization === '' || doctor.specialization === selectedSpecialization;
    return nameMatch && specializationMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Doctors</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-1/2">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">🔍</span>
              </div>
              <input
                id="search"
                type="text"
                placeholder="Search doctors by name..."
                className="pl-10 p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <label htmlFor="specialization" className="sr-only">Specialization</label>
            <select
              id="specialization"
              className="p-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">No doctors found matching your criteria.</p>
          {searchTerm || selectedSpecialization ? (
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization('');
              }}
              className="mt-4 text-blue-500 hover:text-blue-700 underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-50 p-4 flex items-center justify-center">
                <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
                  👨‍⚕️
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                  Dr. {doctor.name}
                </h3>
                <p className="text-blue-600 text-center mb-4">{doctor.specialization}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-start">
                    <span className="text-gray-500 mr-2">📧</span>
                    <p className="text-gray-600">{doctor.email}</p>
                  </div>
                  {doctor.phoneNumber && (
                    <div className="flex items-start">
                      <span className="text-gray-500 mr-2">📞</span>
                      <p className="text-gray-600">{doctor.phoneNumber}</p>
                    </div>
                  )}
                  {doctor.experience && (
                    <div className="flex items-start">
                      <span className="text-gray-500 mr-2">⏱️</span>
                      <p className="text-gray-600">{doctor.experience} years of experience</p>
                    </div>
                  )}
                </div>
                
                {doctor.about && (
                  <p className="text-gray-600 mb-6 line-clamp-3">{doctor.about}</p>
                )}
                
                <div className="flex justify-center">
                  <Link href={`/pages/dashboard/book-appointment?doctor=${doctor.id}`}>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Book Appointment
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}