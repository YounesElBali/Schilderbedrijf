import { redirect } from "next/navigation";

export default function AdminIndex() {
  redirect("/admin/categories");
};


// "use client"

// import { useState, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { json } from "stream/consumers";

// interface Category {
//   id: number;
//   name: string;
//   image: string;
//   path: string;
// }
// interface OrderItem {
//   variant: ProductVariant;
//   productId: number;
//   quantity: number;
//   price: number;
//   product: Product;
// }

// interface Icons {
//   id: number;
//   name: string;
//   url: string;
//   productImages: ProductProductImage[]; // renamed from "products"
// }

// interface Images {
//   id: number;
//   url: string;
//   productId: number;
// }

// interface ProductProductImage {
//   productId: number;
//   productImageId: number;
//   product: Product;
//   productImage: Icons;
// }
// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   images: Images[];  // fallback main image if needed
//   description: string;
//   isNew: boolean;
//   inStock: boolean;
//   deliveryCost: number;
//   articlenr: string;
//   productImages: ProductProductImage[];
//   variants?: ProductVariant[];
//   traits: string;
//   categoryId: number;
// }
// interface ProductVariant {
//   id: number;
//   productId: number;
//   name: string;
//   price?: number;
//   inStock: boolean;
// }

// interface ShippingAddress {
//   firstName: string;
//   lastName: string;
//   company?: string;
//   street: string;
//   vatNumber?: string;
//   postalCode: string;
//   city: string;
//   phone: string;
//   country: string;
// }

// interface Order {
//   id: number;
//   userId: number;
//   totalPrice: number;
//   status: string;
//   createdAt: string;
//   items: OrderItem[];
//   orderItems: OrderItem[];
//   shippingAddress: string;
//   shippingParsed: ShippingAddress;
// }
// interface Icons {
//   id: number;
//   name: string;
//   products: Product[];
// }

// export default function AdminDashboard() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("categories");
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [icons, setIcons] = useState<Icons[]>([]);
//   const [selectedIconIds, setSelectedIconIds] = useState<number[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [uploadError, setUploadError] = useState<string | null>(null);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);

//   useEffect(() => {
//     // Check if user is admin
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (!user.isAdmin) {
//       router.push("/account");
//       return;
//     }

//     // Fetch data based on active tab
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         switch (activeTab) {
//           case "categories":
//             const categoriesRes = await fetch("/api/categories");
//             const categoriesData = await categoriesRes.json();
//             setCategories(categoriesData);
//             break;
//           case "products":
//             const productsRes = await fetch("/api/products");
//             const iconsRes = await fetch("/api/icons");
//             const productsData= await productsRes.json();
//             const iconsData = await iconsRes.json();
//             setIcons(iconsData);
//             setProducts(productsData);
//             break;
//           case "orders":
//             const ordersRes = await fetch("/api/orders");
//             const ordersData = await ordersRes.json();
//             setOrders(ordersData);
//             break;
//           case "icons":
//             const iconsRes2 = await fetch("/api/icons");
//             const iconsData2 = await iconsRes2.json();
//             setIcons(iconsData2);
//             break;
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//       setIsLoading(false);
//     };

//     fetchData();
//   }, [activeTab, router]);

//   const handleImageUpload = async (file: File): Promise<string | null> => {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to upload image");
//       }

//       const data = await response.json();
//       return data.path;
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       setUploadError("Failed to upload image");
//       return null;
//     }
//   };

//   const handleDeleteImage = async (imagePath: string) => {
//   try {
   
//       const response = await fetch("/api/upload", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ path: imagePath }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to delete image: ${imagePath}`);
//       }
//   } catch (error) {
//     console.error("Error deleting images:", error);
//     setUploadError("Failed to delete images");
//   }
// };  

// const handleDeleteImages = async (imagePaths: string[]) => {
//   for (const path of imagePaths) {
//     console.log("Deleting image:", path);
//     await handleDeleteImage(path);
//   }
// };

//   const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const imageFile = formData.get("image") as File;

//     try {
//       // Upload image first
//       const imagePath = await handleImageUpload(imageFile);
//       if (!imagePath) return;

//       const res = await fetch("/api/categories", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: formData.get("name"),
//           image: imagePath,
//           path: formData.get("path"),
//         }),
//       });

//       if (res.ok) {
//         const newCategory = await res.json();
//         setCategories([...categories, newCategory]);
    
//       }
//     } catch (error) {
//       console.error("Error adding category:", error);
//       setUploadError("Failed to add category");
//     }
//   };

// const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   const formData = new FormData(e.currentTarget);
//   const imageFiles  = formData.getAll("image") as File[];

//   try {
//      const uploadedImagePaths: string[] = [];
//       for (const file of imageFiles) {
//         const path = await handleImageUpload(file);
//         if (path) {
//           uploadedImagePaths.push(path);
//         }
//       }
//     if (!uploadedImagePaths.length) return;

//     const res = await fetch("/api/products", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: formData.get("name"),
//         description: formData.get("description"),
//         price: parseFloat(formData.get("price") as string),
//         articlenr: formData.get("articlenr"),
//         categoryId: parseInt(formData.get("categoryId") as string),
//         isNew: formData.get("isNew") === "true",
//         inStock: formData.get("inStock") === "true",
//         deliveryCost: parseFloat(formData.get("deliveryCost") as string),
//         traits: formData.get("traits"),
//         image: uploadedImagePaths.map(url => ({ url, productId: 0 })),
//         variants: [],
//         iconIds: selectedIconIds,
//       }),
//     });

//     if (res.ok) {
//       const newProduct = await res.json();
//       setProducts([...products, newProduct]);
//     }
//   } catch (error) {
//     console.error("Error adding product:", error);
//     setUploadError("Failed to add product");
//   }
// };

//   const handleAddVariant = async (productId: number, variantName: string, variantPrice?: number) => {
//     try {
//       const res = await fetch(`/api/products/${productId}/variants`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: variantName,
//           price: variantPrice,
//         }),
//       });

//       if (res.ok) {
//         const newVariant = await res.json();
        
//         // Update the products state with the new variant
//         setProducts(products.map(product => {
//           if (product.id === productId) {
//             return {
//               ...product,
//               variants: [...(product.variants || []), newVariant]
//             };
//           }
//           return product;
//         }));
//       }
//     } catch (error) {
//       console.error("Error adding variant:", error);
//       setUploadError("Failed to add variant");
//     }
//   };

//   const handleUpdateVariant = async (productId: number, variantId: number, updates: { name?: string, price?: number, inStock?: boolean }) => {
//     try {
//       const res = await fetch(`/api/products/${productId}/variants/${variantId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updates),
//       });

//       if (res.ok) {
//         const updatedVariant = await res.json();
        
//         // Update the products state with the updated variant
//         setProducts(products.map(product => {
//           if (product.id === productId) {
//             return {
//               ...product,
//               variants: product.variants?.map(variant => 
//                 variant.id === variantId ? updatedVariant : variant
//               ) || []
//             };
//           }
//           return product;
//         }));
//       }
//     } catch (error) {
//       console.error("Error updating variant:", error);
//       setUploadError("Failed to update variant");
//     }
//   };

//   const handleDeleteVariant = async (productId: number, variantId: number) => {
//     try {
//       const res = await fetch(`/api/products/${productId}/variants/${variantId}`, {
//         method: "DELETE",
//       });

//       if (res.ok) {
//         // Update the products state by removing the deleted variant
//         setProducts(products.map(product => {
//           if (product.id === productId) {
//             return {
//               ...product,
//               variants: product.variants?.filter(variant => variant.id !== variantId) || []
//             };
//           }
//           return product;
//         }));
//       }
//     } catch (error) {
//       console.error("Error deleting variant:", error);
//       setUploadError("Failed to delete variant");
//     }
//   };

//   const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const imageFiles = formData.getAll("image") as File[];
//     try {
//         let uploadedImagePaths: string[] = [];

//       if (imageFiles.length > 0 && imageFiles[0]) {
//         uploadedImagePaths = [];
//         for (const file of imageFiles) {
//           const path = await handleImageUpload(file);
//           if (path) {
//             uploadedImagePaths.push(path);
//           }
//         }
//       }


//       const res = await fetch(`/api/products/${editingProduct?.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: formData.get("name"),
//           description: formData.get("description"),
//           articlenr: formData.get("articlenr"),
//           price: parseFloat(formData.get("price") as string),
//           images: uploadedImagePaths.length ? uploadedImagePaths.map(url => ({ url, productId: editingProduct?.id })) : editingProduct?.images,
//           categoryId: parseInt(formData.get("categoryId") as string),
//           isNew: formData.get("isNew") === "true",
//           inStock: formData.get("inStock") === "true",
//           deliveryCost: parseFloat(formData.get("deliveryCost") as string),
//           variants: formData.get("productVariants") as string,
//           traits: formData.get("traits"),
//           iconIds: selectedIconIds,
//         }),
//       });

//       if (res.ok) {
//         const updatedProduct = await res.json();
//         setProducts(products.map(product => 
//           product.id === updatedProduct.id ? updatedProduct : product
//         ));
//         setEditingProduct(null);
//       }
//     } catch (error) {
//       console.error("Error updating product:", error);
//       setUploadError("Failed to update product");
//     }
//   };

//   const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
//     try {
//       const res = await fetch(`/api/orders/${orderId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       if (res.ok) {
//         const updatedOrder = await res.json();
//         setOrders(orders.map(order => 
//           order.id === orderId ? updatedOrder : order
//         ));
//       }
//     } catch (error) {
//       console.error("Error updating order:", error);
//     }
//   };

//   const handleDeleteCategory = async (categoryId: number, imagePath: string) => {
//     if (!confirm('Are you sure you want to delete this category? This will also delete all products in this category.')) {
//       return;
//     }

//     try {
//       // First delete the image
//       await handleDeleteImage(imagePath);

//       // Then delete the category
//       const response = await fetch(`/api/categories/${categoryId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete category");
//       }

//       // Update the UI
//       setCategories(categories.filter(category => category.id !== categoryId));
//       window.location.reload();
//     } catch (error) {
//       console.error("Error deleting category:", error);
//       setUploadError("Failed to delete category");
//     }
//   };

//  const handleDeleteProduct = async (productId: number, imagePaths: string[]) => {
//   if (!confirm("Are you sure you want to delete this product?")) {
//     return;
//   }

//   try {
//     // First delete all images
//     await handleDeleteImages(imagePaths);

//     // Then delete the product
//     const response = await fetch(`/api/products/${productId}`, {
//       method: "DELETE",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to delete product");
//     }

//     // Update the UI
//     setProducts(products.filter((product) => product.id !== productId));
//     window.location.reload();
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     setUploadError("Failed to delete product");
//   }
// };

// const handleAddIcon = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   const formData = new FormData(e.currentTarget);
//   const imageFile = formData.get("image") as File;

//   try {
//     // Upload the image file
//     const imagePath = await handleImageUpload(imageFile); // Make sure this function exists
//     if (!imagePath) return;

//     const res = await fetch("/api/icons", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: formData.get("name"),
//         url: imagePath, // this becomes the image URL in your DB
//       }),
//     });

//     if (res.ok) {
//       const newIcon = await res.json();
//       setIcons((prev) => [...prev, newIcon]);
//       e.currentTarget.reset(); // clear form inputs
//     }
//   } catch (err) {
//     console.error("Failed to add icon:", err);
//     // Optional: set error message in state here
//   }
// };

// const handleDeleteIcon = async (id: number) => {
//   setIsLoading(true);
//   try {
//     const res = await fetch(`/api/icons/${id}`, {
//       method: "DELETE",
//     });
//     if (res.ok) {
//       setIcons((prev) => prev.filter((icon) => icon.id !== id));
//       window.location.reload();
//     }
//   } catch (err) {
//     console.error("Failed to delete icon:", err);
//   } finally {
//     setIsLoading(false);
//   }
// };


//   const processedOrders = useMemo(() => {
//     return orders.map((order) => {
//       let shipping: ShippingAddress = {
//         firstName: '',
//         lastName: '',
//         street: '',
//         postalCode: '',
//         city: '',
//         phone: '',
//         country: 'Nederland'
//       };
//       try {
//         shipping = JSON.parse(order.shippingAddress.toString());
//       } catch (err) {
//         console.error("Invalid JSON in shippingAddress for order", order.id, err);
//       }
//       return {
//         ...order,
//         shippingParsed: shipping,
//       };
//     });
//   }, [orders]);
  

//   if (isLoading) {
//     return <div className="p-4">Loading...</div>;
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
//       {uploadError && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {uploadError}
//         </div>
//       )}

//       <div className="flex space-x-4 mb-4">
//         <button
//           onClick={() => setActiveTab("categories")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "categories"
//               ? "bg-[#d6ac0a] text-black"
//               : "bg-gray-200"
//           }`}
//         >
//           Categories
//         </button>
//         <button
//           onClick={() => setActiveTab("products")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "products"
//               ? "bg-[#d6ac0a] text-black"
//               : "bg-gray-200"
//           }`}
//         >
//           Products
//         </button>
//         <button
//           onClick={() => setActiveTab("orders")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "orders"
//               ? "bg-[#d6ac0a] text-black"
//               : "bg-gray-200"
//           }`}
//         >
//           Orders
//         </button>
//          <button
//           onClick={() => setActiveTab("icons")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "icon"
//               ? "bg-[#d6ac0a] text-black"
//               : "bg-gray-200"
//           }`}
//         >
//           Iconen
//         </button>
//       </div>

//       {activeTab === "categories" && (
//         <div>
//           <h2 className="text-xl font-semibold mb-4">voeg nieuwe categorie toe</h2>
//           <form onSubmit={handleAddCategory} className="space-y-4 mb-8">
//             <div>
//               <label className="block mb-1">Naam</label>
//               <input
//                 type="text"
//                 name="name"
//                 required
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Afbeelding</label>
//               <input
//                 type="file"
//                 name="image"
//                 accept="image/*"
//                 required
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Route</label>
//               <input
//                 type="text"
//                 name="path"
//                 required
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <button
//               type="submit"
//               className="bg-indigo-600 text-white px-4 py-2 rounded"
//             >
//               Add Category
//             </button>
//           </form>

//           <h2 className="text-xl font-semibold mb-4">Categorie lijst</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//             {categories.map((category) => (
//               <div
//                 key={category.id}
//                 className="border rounded p-4"
//               >
//                 <h3 className="font-semibold">{category.name}</h3>
//                 <img
//                   src={category.image}
//                   alt={category.name}
//                   className="w-full h-32 object-cover mt-2"
//                 />
//                 <p className="text-sm text-gray-600 mt-2">Path: {category.path}</p>
//                 <div className="flex space-x-2 mt-2">
//                   <button
//                     onClick={() => handleDeleteImage(category.image)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     Delete Image
//                   </button>
//                   <button
//                     onClick={() => handleDeleteCategory(category.id, category.image)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     Delete Category
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {activeTab === "products" && (
//         <div>
//           <h2 className="text-xl font-semibold mb-4">
//             {editingProduct ? "Edit Product" : "Add New Product"}
//           </h2>
//           <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="space-y-4 mb-8">
//             <div>
//               <label className="block mb-1">Naam</label>
//               <input
//                 type="text"
//                 name="name"
//                 required
//                 defaultValue={editingProduct?.name}
//                 className="w-1/5 p-2 border rounded"
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Prijs</label>
//               <input
//                 type="number"
//                 name="price"
//                 step="0.01"
//                 required
//                 defaultValue={editingProduct?.price}
//                 className="w-1/5 p-2 border rounded"
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Verzendkosten</label>
//               <input
//                 type="number"
//                 name="deliveryCost"
//                 step="0.01"
//                 required
//                 defaultValue={editingProduct?.deliveryCost || 6.95}
//                 className="w-1/5 p-2 border rounded"
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Beschrijving</label>
//               <textarea
//                 name="description"
//                 required
//                 defaultValue={editingProduct?.description}
//                 className="w-1/3 p-2 border rounded"
//               />
//             </div>
//              <div>
//               <label className="block mb-1">eigenschappen</label>
//               <textarea
//                 name="traits"
//                 required
//                 placeholder="Waterdicht, UV-bescherming, Ademend"
//                 defaultValue={editingProduct?.traits}
//                 className="w-1/3 p-2 border rounded"
//               />
//             </div>
//              <label className="block mb-1">iconen</label>
//             <div className="grid grid-cols-24 gap-2 mt-2">
//               {icons.map((icon) => (
//                 <label key={icon.id} className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   value={icon.id}
//                   checked={selectedIconIds.includes(icon.id)}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     const id = icon.id;

//                     setSelectedIconIds((prev) =>
//                       checked ? [...prev, id] : prev.filter((i) => i !== id)
//                     );
//                   }}
//                 />
//                   {icon.name}
//                 </label>
//               ))}
//             </div>
//             <div>
//               <label className="block mb-1">Artikelnummer</label>
//               <input
//                 name="articlenr"
//                 required
//                 defaultValue={editingProduct?.articlenr}
//                 className="w-1/5 p-2 border rounded"
//               />
//             </div>
//             <div>
//             <label className="block mb-1">Afbeeldingen</label>
//               <input
//                 type="file"
//                 name="image"
//                 accept="image/*"
//                 multiple
//                 required={!editingProduct}
//                 className="w-1/5 p-2 border rounded"
//               />
//              <ul className="flex gap-2 mt-2">
//               {(editingProduct?.images ?? []).map((img) => (
//                 <li key={img.id}>
//                   <img
//                     src={img.url}
//                     alt={`Product image ${img.id}`}
//                     className="w-24 h-24 object-cover rounded"
//                   />
//                 </li>
//               ))}
//             </ul>


//             </div>
//             <div>
//               <label className="block mb-1">Categorie</label>
//               <select
//                 name="categoryId"
//                 required
//                 defaultValue={editingProduct?.categoryId ?? ""}
//                 className="w-1/5 p-2 border rounded"
//               >
//                 {categories.map((category) => (
//                   <option key={category.id} value={category.id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex space-x-4">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="isNew"
//                   value="true"
//                   defaultChecked={editingProduct?.isNew}
//                   className="mr-2"
//                 />
//                 Nieuw product
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="inStock"
//                   value="true"
//                   defaultChecked={editingProduct?.inStock}
//                   className="mr-2"
//                 />
//                 In voorraad
//               </label>
//             </div>
//             {editingProduct && (
//               <div className="mt-6 border-t pt-4">
//                 <h3 className="text-lg font-semibold mb-2">Productn Variants</h3>
                
//                 <div className="mb-4">
//                   {editingProduct.variants && editingProduct.variants.length > 0 ? (
//                     <div className="space-y-2">
//                       {editingProduct.variants.map((variant) => (
//                         <div key={variant.id} className="flex items-center space-x-2 p-2 border rounded">
//                           <input
//                             type="text"
//                             value={variant.name}
//                             onChange={(e) => handleUpdateVariant(editingProduct.id, variant.id, { name: e.target.value })}
//                             className="p-1 border rounded"
//                           />
//                           <input
//                             type="number"
//                             step="0.01"
//                             value={variant.price || ''}
//                             placeholder="Price (optional)"
//                             onChange={(e) => handleUpdateVariant(editingProduct.id, variant.id, { price: e.target.value ? parseFloat(e.target.value) : undefined })}
//                             className="p-1 border rounded w-24"
//                           />
//                           <label className="flex items-center">
//                             <input
//                               type="checkbox"
//                               checked={variant.inStock}
//                               onChange={(e) => handleUpdateVariant(editingProduct.id, variant.id, { inStock: e.target.checked })}
//                               className="mr-1"
//                             />
//                             In Stock
//                           </label>
//                           <button
//                             type="button"
//                             onClick={() => handleDeleteVariant(editingProduct.id, variant.id)}
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500">No variants added yet.</p>
//                   )}
//                 </div>
                
//                 <div className="flex items-end space-x-2">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Variant Name</label>
//                     <input
//                       type="text"
//                       id="variantName"
//                       placeholder="e.g., Size 10, Large"
//                       className="mt-1 p-2 border rounded"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Price (optional)</label>
//                     <input
//                       type="number"
//                       id="variantPrice"
//                       step="0.01"
//                       placeholder="Use product price"
//                       className="mt-1 p-2 border rounded w-32"
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       const nameInput = document.getElementById('variantName') as HTMLInputElement;
//                       const priceInput = document.getElementById('variantPrice') as HTMLInputElement;
                      
//                       if (nameInput.value.trim()) {
//                         handleAddVariant(
//                           editingProduct.id, 
//                           nameInput.value.trim(), 
//                           priceInput.value ? parseFloat(priceInput.value) : undefined
//                         );
                        
//                         // Clear inputs
//                         nameInput.value = '';
//                         priceInput.value = '';
//                       }
//                     }}
//                     className="bg-indigo-600 text-white px-4 py-2 rounded"
//                   >
//                     Add Variant
//                   </button>
//                 </div>
//               </div>
//             )}
//             <div className="flex space-x-4">
//               <button
//                 type="submit"
//                 className="bg-indigo-600 text-white px-4 py-2 rounded"
//               >
//                 {editingProduct ? "Update Product" : "Add Product"}
//               </button>
//               {editingProduct && (
//                 <button
//                   type="button"
//                   onClick={() => setEditingProduct(null)}
//                   className="bg-gray-200 px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
            
//           </form>

//           <h2 className="text-xl font-semibold mb-4">Product Lijst</h2>
//           <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-4">
//             {products.map((product) => (
//               <div
//                 key={product.id}
//                 className="border rounded p-4"
//               >
//                 <h3 className="font-semibold">{product.name}</h3>

//                 <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                
//                 <p className="font-semibold mt-2">€{product.price}</p>
//                 <p className="font-semibold mt-2">Artikelnummer: {product.articlenr}</p>
//                 <div className="flex space-x-2 mt-2">
//                   {product.isNew && (
//                     <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
//                       Nieuw
//                     </span>
//                   )}
//                   {product.inStock ? (
//                     <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
//                       In voorraad
//                     </span>
//                   ) : (
//                     <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
//                       Niet in voorraad
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex space-x-2 mt-4">
//                   <button
//                     onClick={() => setEditingProduct(product)}
//                     className="text-blue-600 hover:text-blue-800"
//                   >
//                     Wijzig product
//                   </button>
                  
//                   <button
//                     onClick={() => handleDeleteImages((product.images)?.map(img => img.url)  || [])}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     Verwijder afbeelding
//                   </button>
//                   <button
//                     onClick={() => handleDeleteProduct(product.id, product.images?.map(img => img.url)  || [])}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     Verwijder Product
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {activeTab === "orders" && (
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Orders Lijst</h2>
//           <div className="space-y-4 w-4/5">
//             {processedOrders.map((order) => (
//               <div key={order.id} className="border rounded p-4">
//                 <div className="space-y-2">
//                   <p className="font-semibold text-lg">
//                     Order #{order.id} – Date: {new Date(order.createdAt).toLocaleDateString()}
//                   </p>

//                   {/* Ordered Products */}
//                   <div>
//                     <p className="font-semibold mb-1">Bestelde Producten:</p>
//                     <div className="border rounded p-4 bg-white">
//                       <table className="w-full">
//                         <thead>
//                           <tr className="border-b">
//                             <th className="text-left py-2">Product</th>
//                             <th className="text-right py-2">Aantal</th>
//                             <th className="text-right py-2">Prijs per stuk</th>
//                             <th className="text-right py-2">Totaal</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {order.orderItems?.map((item: OrderItem, idx: number) => (
//                             <tr key={idx} className="border-b">
//                               <td className="py-2">
//                                 <div className="flex items-center">
                                 
//                                   <div>
//                                     <p className="font-medium">{item.product.name}</p>
//                                     <p className="text-sm text-gray-500">Artikelnummer: {item.product.articlenr}</p>
//                                     <p className="text-sm text-gray-500">variant: {item.variant?.name}</p> 
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="text-right py-2">{item.quantity}</td>
//                               <td className="text-right py-2">€{item.price.toFixed(2)}</td>
//                               <td className="text-right py-2">€{(item.price * item.quantity).toFixed(2)}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                         <tfoot>
//                           <tr className="font-bold">
//                             <td colSpan={3} className="text-right py-2">Totaal:</td>
//                             <td className="text-right py-2">€{order.totalPrice.toFixed(2)}</td>
//                           </tr>
//                         </tfoot>
//                       </table>
//                     </div>
//                   </div>

//                   {/* User Info */}
//                   <div className="text-sm text-gray-600">
//                     <p className="font-semibold text-lg">Gebruiker:</p>
//                     <p>Voornaam:{order.shippingParsed.firstName} Achternaam:{order.shippingParsed.lastName}</p>
//                     {order.shippingParsed.company && (
//                       <p>Bedrijf: {order.shippingParsed.company}</p>
//                     )}
//                     <p>Straatnaam:{order.shippingParsed.street} Postcode:{order.shippingParsed.postalCode} Plaats:{order.shippingParsed.city}</p>
//                     <p>Telefoon: {order.shippingParsed.phone}</p>
//                   </div>

//                   {/* Status */}
//                   <div>
//                     <select
//                       value={order.status}
//                       onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
//                       className="p-2 border rounded w-full sm:w-auto"
//                     >
//                       <option value="PENDING">Pending</option>
//                       <option value="PROCESSING">Processing</option>
//                       <option value="SHIPPED">Shipped</option>
//                       <option value="DELIVERED">Delivered</option>
//                       <option value="CANCELLED">Cancelled</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//      {activeTab === "icons" && (
//       <form onSubmit={handleAddIcon} className="flex flex-col gap-3 mb-6 max-w-md">
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Iconen</h2>
//           <p className="mb-4">Hier kun je iconen beheren.</p>

//           {/* Add Icon Form */}
//           <div className="flex flex-col gap-3 mb-6 max-w-md">
//             <div>
//               <label className="block mb-1 font-medium">Naam</label>
//               <input
//                 type="text"
//                 name="name" 
//                 placeholder="Bijv. UV-bestendig, Waterwerend, Hitte bestendig"
//                 className="w-full p-2 border rounded"
//               />
//             </div>

//             <div>
//               <label className="block mb-1 font-medium">Afbeelding</label>
//              <input
//                 type="file"
//                 name="image"
//                 accept="image/*"
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//             >
//               {isLoading ? "Toevoegen..." : "Toevoegen"}
//             </button>
//           </div>

//           {/* Icon List */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//             {icons.map((icon) => (
//               <div key={icon.id} className="border p-2 rounded flex flex-col items-center text-center">
//                 <img src={icon.url} alt={icon.name} className="w-16 h-16 object-contain mb-2" />
//                 <p className="text-sm font-medium">{icon.name}</p>
//                 <button
//                   onClick={() => handleDeleteIcon(icon.id)}
//                   disabled={isLoading}
//                   className="text-sm text-red-600 hover:underline mt-2"
//                 >
//                   Verwijderen
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </form>
//       )}


//     </div>
//   );
// } 