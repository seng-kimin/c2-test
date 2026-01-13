import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProductNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const newProduct = {
      title: formData.get("title")?.toString().trim(),
      price: Number(formData.get("price")),
      description: formData.get("description")?.toString().trim() || "",
      categoryId: Number(formData.get("categoryId")),
      images: [formData.get("image")?.toString().trim()],
    };

    // Basic client-side checks
    if (!newProduct.title) {
      alert("Title is required");
      return;
    }
    if (isNaN(newProduct.price) || newProduct.price <= 0) {
      alert("Price must be a positive number");
      return;
    }
  
    if (!newProduct.images[0]) {
      alert("Image URL is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://api.escuelajs.co/api/v1/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error(`Failed to create product (status ${response.status})`);
      }

      const data = await response.json();
      console.log("Created product:", data);

      alert("Successfully saved a new product");
      navigate("/products");
    } catch (error) {
      alert("Saved a new product failed" );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add new product</h1>
        <p className="text-sm text-slate-600">
          Fill in the product information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Product title"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            name="price"
            type="number"
            required
            min={0}
            step="0.01"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="0.00"
          />
        </div>

        {/* Category ID (1–5 only) */}
        <div>
          <label className="block text-sm font-medium">Category ID</label>
          <input
            name="categoryId"
            type="number"
            required
            min={1}
            max={10}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            name="image"
            type="url"
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={3}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Product description"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
              loading ? "bg-slate-500 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {loading ? "Saving..." : "Save product"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-slate-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
