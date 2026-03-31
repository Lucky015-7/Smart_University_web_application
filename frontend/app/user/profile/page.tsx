'use client';

/**
 * User Profile Page
 * Demonstrates role checking with detailed permissions
 */

import { useAuth } from '@/lib/auth-context';
import { UserRole, getRoleDisplayName } from '@/lib/roles';
import { ProtectByAnyRole, AdminOnly, HideFromRole } from '@/components/auth/RoleGuards';

export default function ProfilePage() {
  const { loading, error, name, email, roles, primaryRole, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-800">
        Error loading profile: {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>

      {/* Basic User Info - Visible to all authenticated users */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <p className="text-lg font-medium">{name}</p>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <p className="text-lg">{email}</p>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <div className="flex gap-2">
              {roles.map((role) => (
                <span
                  key={role}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    role === UserRole.ADMIN
                      ? 'bg-red-100 text-red-800'
                      : role === UserRole.TECHNICIAN
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {getRoleDisplayName(role)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Only Settings */}
      <AdminOnly>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4">Administrator Settings</h2>
          <p className="text-red-800 mb-4">
            As an administrator, you have access to system-wide configuration options.
          </p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Manage System Settings
          </button>
        </div>
      </AdminOnly>

      {/* Technician Special Features */}
      <ProtectByAnyRole requiredRoles={[UserRole.ADMIN, UserRole.TECHNICIAN]}>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Maintenance Tools</h2>
          <p className="text-blue-800 mb-4">
            Your technician privileges give you access to maintenance and support functions.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Access Maintenance Dashboard
          </button>
        </div>
      </ProtectByAnyRole>

      {/* User Features - Hidden from admins demonstrating HideFromRole */}
      <HideFromRole hiddenRole={UserRole.ADMIN}>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Your Requests</h2>
          <p className="text-green-800">
            View and manage your personal resource requests and bookings.
          </p>
        </div>
      </HideFromRole>

      {/* Preferences - Visible to all authenticated users */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <span>Email Notifications</span>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 rounded border-gray-300 text-primary"
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <span>Email on Role Change</span>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 rounded border-gray-300 text-primary"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <span>Dark Mode</span>
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
