import { useState, useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

const stocks = [
  { label: '24-03-25', inStock: 457900, sales: 3636 },
  { label: '01-02-25', inStock: 457900, sales: 846 },
  { label: '24-01-25', inStock: 457900, sales: 5353 },
  { label: '07-02-25', inStock: 7, sales: 35 },
  { label: '10-02-25', inStock: 53, sales: 386 },
  { label: '14-02-25', inStock: 7, sales: 5263 },
  { label: '06-03-25', inStock: 568, sales: 56 },
  { label: '08-03-25', inStock: 567, sales: 56 },
];

const StockList = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule un chargement de 2 secondes
    const timer = setTimeout(() => setLoading(false), 2000);
    
    return () => clearTimeout(timer); // Nettoie le timer au démontage du composant
  }, []);

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-lg font-semibold text-gray-500 animate-pulse">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-700 ease-in-out">
          {stocks.map((stock, index) => (
            <div
              key={stock.label}
              className={`flex flex-col p-4 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out
                ${index % 2 === 0 ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gradient-to-r from-blue-400 to-blue-600"}
                text-white translate-y-5 animate-fade-in`}
            >
              <span className="text-lg flex items-center gap-2 font-semibold">
                <FaRegCalendarAlt />
                {stock.label}
              </span>
              {stock.inStock > 0 ? (
                <div className="mt-2 text-sm">
                  <span className="block">In stock: <b>{stock.inStock} pcs</b></span>
                  <span className="block">Sales: <b>{stock.sales} pcs</b></span>
                </div>
              ) : (
                <span className="mt-2 text-red-500 font-semibold">Out of stock</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockList;
