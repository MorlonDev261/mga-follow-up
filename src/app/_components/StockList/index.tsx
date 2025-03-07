import { FaRegCalendarAlt } from "react-icons/fa";

const stocks = [
  { label: 'Stock 24-03-25', inStock: 457900, sales: 3636 },
  { label: 'Stock 01-02-25', inStock: 457900, sales: 846 },
  { label: 'Pending', inStock: 457900, sales: 5353 },
  { label: 'Employers', inStock: 7, sales: 35 },
  { label: 'Payement', inStock: 53, sales: 386 },
  { label: 'Customers', inStock: 7, sales: 5263 },
  { label: 'Profile', inStock: 568, sales: 56 },
  { label: 'Settings', inStock: 567, sales: 56 },
];

const StockList = () => {
  return (
    <>
      {stocks.map((stock) => (
        <div
          key={stock.label}
          className="flex flex-col my-1 h-15 w-full justify-between rounded bg-green-500 hover:bg-green-600 p-2 transition-colors duration-300"
        >
          <span className="text-lg flex items-center gap-1">
            <FaRegCalendarAlt />
            <span className="text-xs">{stock.label}</span>
          </span>
          {stock.inStock > 0 ?
            <div className="flex items-center justify-between">
              <span>In stock: <b className="text-xs">{stock.inStock}pcs</b></span>
              <span>Sales: <b>{stock.sales}pcs</b></span>
            </div>
            :
            <span className="text-green-500">Out of stock</span>
          }
        </div>
      ))}
    </>
  );
};

export default StockList;
