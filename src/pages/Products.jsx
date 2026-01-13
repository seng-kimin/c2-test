import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('https://api.escuelajs.co/api/v1/products?limit=12&offset=0')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load products');
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-slate-600">Manage your product catalog</p>
        </div>

        <Link
          to="/products/new"
          className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
          + Add product
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading products...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600 font-medium">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No products found</div>
      ) : (
        <div
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1"
        >
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="
                group rounded-xl border border-slate-200 bg-white p-4
                hover:shadow-md hover:border-slate-300 transition-all duration-200
                flex flex-row sm:flex-col
              "
            >
              <img
                src={p.images?.[0] ?? "https://placehold.co/600x400"}
                alt={p.title}
                className="
                  h-28 w-28 object-cover rounded-l-lg sm:rounded-l-none sm:rounded-t-lg
                  sm:h-44 sm:w-full
                "
                loading="lazy"
              />

              <div className="flex-1 sm:mt-3 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium line-clamp-2 group-hover:text-slate-900">
                      {p.title}
                    </div>
                    <div className="mt-0.5 text-sm text-slate-500 line-clamp-1">
                      {p.category?.name || '—'}
                    </div>
                  </div>
                  <div className="shrink-0 font-semibold text-lg text-slate-900">
                    ${p.price}
                  </div>
                </div>

                <p className="mt-2 text-sm text-slate-600 line-clamp-2 md:line-clamp-3">
                  {p.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}