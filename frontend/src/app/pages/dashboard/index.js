import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { fetchDashboardStats } from '../../lib/api';

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    appointments: 0,
    doctors: 0,
    patients: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showToast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [showToast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="welcome-banner bg-blue-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold">Welcome, {user?.name || 'User'}!</h2>
            <p className="text-gray-600 mt-2">
              {user?.role === 'doctor' 
                ? 'Manage your appointments and availability from your dashboard.' 
                : user?.role === 'admin' 
                  ? 'Monitor system statistics and manage users from your admin dashboard.'
                  : 'Book appointments and track your medical history from your dashboard.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatsCard 
              title="Total Appointments" 
              value={stats.appointments} 
              icon="📅" 
              color="bg-blue-500"
            />
            <StatsCard 
              title="Doctors" 
              value={stats.doctors} 
              icon="👨‍⚕️" 
              color="bg-green-500"
            />
            <StatsCard 
              title="Patients" 
              value={stats.patients} 
              icon="🧑‍🤝‍🧑" 
              color="bg-purple-500"
            />
            {user?.role === 'admin' && (
              <StatsCard 
                title="Pending Approvals" 
                value={stats.pendingApprovals} 
                icon="⏳" 
                color="bg-yellow-500"
              />
            )}
          </div>

          <div className="recent-activity bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {/* Activity list would be implemented here */}
            <p className="text-gray-500">Your recent activity will appear here.</p>
          </div>
        </>
      )}
    </div>
  );
}

const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center">
      <div className={`${color} text-white p-3 rounded-full`}>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="ml-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);