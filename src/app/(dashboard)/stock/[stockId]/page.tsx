import TableStock from "@components/DataTable/TableStock";

export default function MyComponent() {
  const inStock = false;
  
  return (
    <>
      <h3>Arrival 20 March 2025</h3>
      <h4 className="text-blue-500">Total : <span className="text-bold">25pcs</span></h4>
      <div>
        {inStock ? 
          <p className="text-yello-500">Remaining : <span className="text-bold">5pcs</span></p> : 
          <p className="text-green-500">Out of Stock</p>
        }
      </div>
      <TableStock />
    </>
  );
}
