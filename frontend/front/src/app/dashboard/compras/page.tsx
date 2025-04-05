import React from 'react';

function PurchaseHistory() {
  const purchases = [
    {
      id: 1,
      date: '15 Marzo 2024',
      item: 'Membresía Premium',
      amount: '49.99',
      status: 'Completado',
    },
    {
      id: 2,
      date: '1 Marzo 2024',
      item: 'Curso Avanzado',
      amount: '29.99',
      status: 'Completado',
    },
    {
      id: 3,
      date: '15 Febrero 2024',
      item: 'Membresía Básica',
      amount: '29.99',
      status: 'Completado',
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-semibold text-[#5e1914]">Historial de Compras</h2>
      <p className="mt-4 text-[#5e1914]">
        Revisa todas tus transacciones y compras realizadas.
      </p>

      <div className="mt-8 bg-[#ffffff] rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#5e1914] text-[#f1f1f1] ">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Item</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Monto</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#5e1914] text-[#5e1914]">
            {purchases.map((purchase) => (
              <tr key={purchase.id}>
                <td className="px-6 py-4 text-sm ">{purchase.date}</td>
                <td className="px-6 py-4 text-sm">{purchase.item}</td>
                <td className="px-6 py-4 text-sm">${purchase.amount}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">
                    {purchase.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PurchaseHistory;