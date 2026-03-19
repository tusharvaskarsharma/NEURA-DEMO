"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NGODashboard() {
  const router = useRouter();
  
  const [medicines, setMedicines] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth check and Fetch all medicines
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        return router.push('/login');
      }

      const user = JSON.parse(userStr);
      if (user.role.toLowerCase() !== 'ngo') {
        return router.push('/login');
      }

      try {
        const res = await fetch('http://localhost:5000/medicine/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) {
          if (res.status === 401) return router.push('/login');
          if (res.status === 403) throw new Error('Access denied: NGO role required');
          throw new Error('Failed to fetch medicine inventory');
        }
        
        const data = await res.json();
        setMedicines(data);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 text-gray-700">
        Loading Inventory...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">NGO Inventory Browser</h1>
            <p className="text-gray-600 mt-2">View all medicines donated by the community.</p>
          </div>
          <button 
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="text-sm text-red-600 hover:underline font-medium"
          >
            Logout
          </button>
        </header>

        {/* Messaging */}
        {errorMsg && (
          <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* All Medicines Inventory */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Medicine Pool</h2>
          <div className="overflow-x-auto">
            {medicines.length === 0 ? (
              <p className="text-gray-500 py-4 text-sm">No medicines available in the inventory yet.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Medicine Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Donated By</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicines.map((med) => (
                    <tr key={med._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{med.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{med.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(med.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {med.userId?.name || 'Anonymous'} ({med.userId?.email || 'N/A'})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-800 font-semibold transition duration-150">
                          Request
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
