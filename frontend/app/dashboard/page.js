"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState({ name: '', quantity: '', expiryDate: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      router.push('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      if (parsedUser.role !== 'Customer') {
        // NGO Dashboard could be different, for now we only handle Customer
        setError("Only customers can manage medicine donations here.");
        setLoading(false);
        return;
      }
      fetchMedicines();
    } catch (e) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/medicine/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch medicines');
      const data = await res.json();
      setMedicines(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/medicine/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add medicine');
      
      // Update local list
      setMedicines([...medicines, data.medicine]);
      setFormData({ name: '', quantity: '', expiryDate: '' });
      alert("Medicine added successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
      <div className="text-xl font-semibold">Loading Dashboard...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, <span className="font-semibold text-gray-800">{user?.name}</span>. Manage your medicine donations here.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2.5 rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm"
          >
            Logout
          </button>
        </header>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {/* Add Medicine Form */}
        <section className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Add New Medicine</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Paracetamol" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="block w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 10" 
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="block w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                <input 
                  type="date" 
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  className="block w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all outline-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all shadow-lg active:scale-95"
              >
                Submit Donation
              </button>
            </div>
          </form>
        </section>

        {/* Your Medicines List */}
        <section className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Your Donations</h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            {medicines.length === 0 && !loading ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No donations found. Start by adding a medicine above!</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Medicine Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicines.map((med) => (
                    <tr key={med._id || med.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{med.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">{med.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(med.expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
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

