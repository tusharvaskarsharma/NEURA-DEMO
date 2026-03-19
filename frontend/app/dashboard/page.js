"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  
  const [medicines, setMedicines] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth check and Fetch medicines
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        return router.push('/login');
      }

      const user = JSON.parse(userStr);
      if (user.role !== 'customer') {
        return router.push('/login');
      }

      try {
        const res = await fetch('http://localhost:5000/medicine/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) {
          if (res.status === 401) return router.push('/login');
          throw new Error('Failed to fetch medicines');
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

  // Handle new medicine submission
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/medicine/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, quantity: Number(quantity), expiryDate })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add medicine');

      setSuccessMsg('Medicine added successfully!');
      
      // Append the newly created medicine 
      setMedicines((prev) => [...prev, data.medicine]);
      
      // Clear form inputs
      setName('');
      setQuantity('');
      setExpiryDate('');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 text-gray-700">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
          <p className="text-gray-600 mt-2">Add and view the medicines you have available for donation.</p>
        </header>

        {/* Messaging */}
        {(errorMsg || successMsg) && (
          <div className={`p-4 rounded-md ${errorMsg ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {errorMsg || successMsg}
          </div>
        )}

        {/* Add Medicine Form */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Medicine</h2>
          <form className="space-y-4" onSubmit={handleAddMedicine}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Paracetamol" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  placeholder="e.g. 10" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input 
                  type="date" 
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button 
                type="submit" 
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
              >
                Submit Medicine
              </button>
            </div>
          </form>
        </section>

        {/* Your Medicines Section */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Medicines</h2>
          <div className="overflow-x-auto">
            {medicines.length === 0 ? (
              <p className="text-gray-500 py-4 text-sm">No medicines added yet.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Medicine Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicines.map((med) => (
                    <tr key={med._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{med.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{med.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(med.expiryDate).toLocaleDateString()}
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
