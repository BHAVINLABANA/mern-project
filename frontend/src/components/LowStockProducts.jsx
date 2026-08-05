function LowStockProducts({ products }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold">
            📦 Low Stock
        </h2>

        <span className="text-red-500 font-semibold">
            Attention Needed
        </span>

        </div>

      {products.length === 0 ? (
        <p className="text-green-600 font-medium">
          All products are sufficiently stocked.
        </p>
      ) : (
        <div className="space-y-4">

          {products.map((product) => (

            <div
              key={product._id}
              className="flex justify-between items-center border-b pb-3"
            >

              <div>

                <h3 className="font-semibold">
                  {product.name}
                </h3>

              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  product.stock <= 2
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {product.stock} Left
              </span>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default LowStockProducts;