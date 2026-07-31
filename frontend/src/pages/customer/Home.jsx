import { useEffect, useState } from "react";
import api from "../../services/api";
import ProductCard from "../../components/customer/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("-createdAt");

  useEffect(() => {
    fetchProducts();
  }, [keyword, category, sort]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get(`/products/customer?keyword=${keyword}&category=${category}&sort=${sort}`);
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-6 py-8">

        <h1 className="text-4xl font-bold mb-8">
          Latest Products
        </h1>

        <div className="bg-white p-4 rounded-xl shadow mb-8 flex flex-wrap gap-4">

          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2"
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="price">Price ↑</option>
            <option value="-price">Price ↓</option>
          </select>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}

        </div>

      </div>

    </div>
  );
}

export default Home;