"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  image: string;
  path: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isNew: boolean;
  inStock: boolean;
  categoryId: number;
}

interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.isAdmin) {
      router.push("/account");
      return;
    }

    // Fetch data based on active tab
    const fetchData = async () => {
      setIsLoading(true);
      try {
        switch (activeTab) {
          case "categories":
            const categoriesRes = await fetch("/api/categories");
            const categoriesData = await categoriesRes.json();
            setCategories(categoriesData);
            break;
          case "products":
            const productsRes = await fetch("/api/products");
            const productsData = await productsRes.json();
            setProducts(productsData);
            break;
          case "orders":
            const ordersRes = await fetch("/api/orders");
            const ordersData = await ordersRes.json();
            setOrders(ordersData);
            break;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [activeTab, router]);

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.path;
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image");
      return null;
    }
  };

  const handleDeleteImage = async (imagePath: string) => {
    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: imagePath }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setUploadError("Failed to delete image");
    }
  };

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("image") as File;

    try {
      // Upload image first
      const imagePath = await handleImageUpload(imageFile);
      if (!imagePath) return;

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          image: imagePath,
          path: formData.get("path"),
        }),
      });

      if (res.ok) {
        const newCategory = await res.json();
        setCategories([...categories, newCategory]);
    
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setUploadError("Failed to add category");
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("image") as File;

    try {
      // Upload image first
      const imagePath = await handleImageUpload(imageFile);
      if (!imagePath) return;

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          price: parseFloat(formData.get("price") as string),
          image: imagePath,
          categoryId: parseInt(formData.get("categoryId") as string),
          isNew: formData.get("isNew") === "true",
          inStock: formData.get("inStock") === "true",
        }),
      });

      if (res.ok) {
        const newProduct = await res.json();
        setProducts([...products, newProduct]);
   
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setUploadError("Failed to add product");
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: number, imagePath: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all products in this category.')) {
      return;
    }

    try {
      // First delete the image
      await handleDeleteImage(imagePath);

      // Then delete the category
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      // Update the UI
      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
      setUploadError("Failed to delete category");
    }
  };

  const handleDeleteProduct = async (productId: number, imagePath: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      // First delete the image
      await handleDeleteImage(imagePath);

      // Then delete the product
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Update the UI
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      setUploadError("Failed to delete product");
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      {uploadError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {uploadError}
        </div>
      )}

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 rounded ${
            activeTab === "categories"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded ${
            activeTab === "products"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded ${
            activeTab === "orders"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Orders
        </button>
      </div>

      {activeTab === "categories" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-4 mb-8">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Path</label>
              <input
                type="text"
                name="path"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Add Category
            </button>
          </form>

          <h2 className="text-xl font-semibold mb-4">Categories List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="border rounded p-4"
              >
                <h3 className="font-semibold">{category.name}</h3>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 object-cover mt-2"
                />
                <p className="text-sm text-gray-600 mt-2">Path: {category.path}</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleDeleteImage(category.image)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete Image
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.image)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete Category
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="space-y-4 mb-8">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Price</label>
              <input
                type="number"
                name="price"
                step="0.01"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Category</label>
              <select
                name="categoryId"
                required
                className="w-full p-2 border rounded"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isNew"
                  value="true"
                  className="mr-2"
                />
                New Product
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  value="true"
                  className="mr-2"
                />
                In Stock
              </label>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Add Product
            </button>
          </form>

          <h2 className="text-xl font-semibold mb-4">Products List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded p-4"
              >
                <h3 className="font-semibold">{product.name}</h3>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover mt-2"
                />
                <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                <p className="font-semibold mt-2">€{product.price}</p>
                <div className="flex space-x-2 mt-2">
                  {product.isNew && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      New
                    </span>
                  )}
                  {product.inStock ? (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      In Stock
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                      Out of Stock
                    </span>
                  )}
                </div>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleDeleteImage(product.image)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete Image
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id, product.image)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Orders List</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      Total: €{order.totalPrice}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Gebruikers adres: {order.shippingAddress.street}, {order.shippingAddress.postalCode} {order.shippingAddress.city}
                    </p>
                  </div>
                  <div>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="p-2 border rounded"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 