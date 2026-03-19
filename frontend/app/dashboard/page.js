export default function Dashboard() {
  // Static dummy data for the UI
  const dummyMedicines = [
    { id: 1, name: "Paracetamol", quantity: 20, expiry: "2026-12-01" },
    { id: 2, name: "Amoxicillin", quantity: 15, expiry: "2025-08-15" },
    { id: 3, name: "Vitamin C", quantity: 50, expiry: "2027-01-20" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
          <p className="text-gray-600 mt-2">Add and view the medicines you have available for donation.</p>
        </header>

        {/* Add Medicine Form */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Medicine</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Paracetamol" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input 
                  type="number" 
                  placeholder="e.g. 10" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input 
                  type="date" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button 
                type="button" 
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
              >
                Submit Medicine
              </button>
            </div>
          </form>
        </section>

        {/* Your Medicines Placeholder */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Medicines</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Medicine Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyMedicines.map((med) => (
                  <tr key={med.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{med.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{med.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{med.expiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
