import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL, ADMIN_API_BASE_URL } from "../config/api.config.js";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productimage, setProductimage] = useState("");
    const [title, settile] = useState("");
    const [price, setprice] = useState("");
    const [category, setcategory] = useState("");
    const [description, setdescription] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${ADMIN_API_BASE_URL}/api/v1/edit/editallproduct`);
                const product = res.data.data.find(p => p._id === id);
                if (product) {
                    setProductimage(product.productimage?.[0] || "");
                    settile(product.title);
                    setprice(product.price);
                    setcategory(product.category);
                    setdescription(product.description);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchProduct();
    }, [id]);

    const updateProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `${ADMIN_API_BASE_URL}/api/v1/edit/updateproduct/${id}`,
                { productimage: [productimage], title, price, category, description },
                { withCredentials: true }
            );
            toast.success("Product updated successfully!");
            navigate("/settings");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update product.");
        }
    };

    const deleteProduct = async () => {
        try {
            try {
                await axios.delete(`${ADMIN_API_BASE_URL}/api/v1/edit/deleteproduct/${id}`);
            } catch {
                await axios.delete(`${API_BASE_URL}/api/v1/product/deleteproduct/${id}`);
            }
            toast.success("Product deleted successfully!");
            navigate("/settings");
        } catch (err) {
            console.error("Failed to delete product:", err);
            toast.error(err.response?.data?.message || "Failed to delete product.");
        }
    };

    return (
        <>
        <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Edit Product</h2>
                    <p className="text-sm text-slate-400 mt-1">Modify product details below</p>
                </div>

                {productimage && (
                    <div className="flex justify-center">
                        <img 
                            src={productimage} 
                            alt="Product Preview" 
                            className="w-28 h-28 object-cover rounded-xl border border-slate-800 shadow-md"
                        />
                    </div>
                )}

                <form onSubmit={updateProduct} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Image URL</label>
                        <input 
                            type="text" 
                            placeholder="Enter image URL" 
                            value={productimage} 
                            onChange={(e) => setProductimage(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
                        <input 
                            type="text" 
                            placeholder="Enter title" 
                            value={title} 
                            onChange={(e) => settile(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Price (₹)</label>
                        <input 
                            type="text" 
                            placeholder="Enter price" 
                            value={price} 
                            onChange={(e) => setprice(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                        <input 
                            type="text" 
                            placeholder="Enter category" 
                            value={category} 
                            onChange={(e) => setcategory(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea 
                            placeholder="Enter description" 
                            value={description} 
                            onChange={(e) => setdescription(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition duration-200"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="flex gap-2.5 pt-2">
                        <button 
                            type="button" 
                            onClick={() => navigate("/settings")}
                            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition cursor-pointer text-center"
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            onClick={deleteProduct}
                            className="px-4 py-3 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 rounded-xl text-sm font-semibold transition cursor-pointer"
                            title="Delete this product"
                        >
                            Delete
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-lg shadow-indigo-600/20 text-center"
                        >
                            Update
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
        </>
    );
}

export default EditProduct;
