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

const StockList = ({ loading }: {loading: boolean}) => {
  return (
   <>
   {loading ? (
      <div className="flex justify-center items-center h-40">
        <span className="text-lg font-semibold text-gray-500 animate-pulse">Loading...</span>
      </div>
    ) : (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {stocks.map((stock) => (
       // bg-gradient-to-r from-green-400 to-green-600
        <div
          key={stock.label}
          className="flex flex-col p-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-gradient-to-r from-blue-400 to-blue-600 text-white"
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
    </>
  );
};

export default StockList;
