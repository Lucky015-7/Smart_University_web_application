'use client';

/**
 * Technician Dashboard Page
 * Shows content for TECHNICIAN and ADMIN roles
 */

import { TechnicianOnly } from '@/components/auth/RoleGuards';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/roles';

export default function TechnicianDashboard() {
  const { loading, error, name } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Technician Dashboard</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          Error: {error}
        </div>
      )}

      <TechnicianOnly
        fallback={
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <h2 className="font-semibold text-amber-900 mb-2">Technician Access Required</h2>
            <p className="text-amber-800">
              This area is reserved for technicians and administrators.
            </p>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Maintenance Tasks</h2>
            <ul className="space-y-2 text-blue-800">
              <li>• Monitor system health</li>
              <li>• Manage facilities maintenance</li>
              <li>• Handle support tickets</li>
              <li>• Generate system reports</li>
            </ul>
          </div>

          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-xl font-semibold text-green-900 mb-4">Active Tickets</h2>
            <p className="text-green-800">View and manage support tickets here</p>
          </div>
        </div>
      </TechnicianOnly>
    </>
  );
}
