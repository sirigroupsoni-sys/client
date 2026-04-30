import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Plus, 
  Search, 
  Package, 
  Trash2, 
  Edit,
  IndianRupee,
  ChevronRight,
  X,
  Image as ImageIcon,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form States
  const [form, setForm] = useState({ 
    name: '', 
    price: '', 
    category: 'Delivery Only', 
    description: '', 
    image: '',
    isVeg: true,
    isAvailable: true
  });

  const categories = ['All', 'Delivery Only', 'Delivery + Services', 'Live Service', 'Snack Box', 'Meal Box'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/admin/products');
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.patch(`/admin/products/${editingProduct._id}`, form);
      } else {
        await api.post('/admin/products', form);
      }
      setShowModal(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="p-12 text-slate-300 font-medium text-sm animate-pulse">Loading product inventory...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-slate-500 font-medium mt-1">Manage individual meal boxes, snack boxes, and bulk food items.</p>
        </div>
        <button 
          onClick={() => { 
            setEditingProduct(null); 
            setForm({ name: '', price: '', category: 'Delivery Only', description: '', image: '', isVeg: true, isAvailable: true }); 
            setShowModal(true); 
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center gap-3"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Col: Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-between group ${
                    selectedCategory === cat 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat}
                  <ChevronRight size={14} className={`transition-transform ${selectedCategory === cat ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Products List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-xs font-medium outline-none focus:border-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                   <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><Filter size={18} /></button>
                </div>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="text-left bg-slate-50/50">
                     <th className="py-4 px-6 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100">Product Details</th>
                     <th className="py-4 px-6 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100">Category</th>
                     <th className="py-4 px-6 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100">Price</th>
                     <th className="py-4 px-6 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100">Status</th>
                     <th className="py-4 px-6 font-bold text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {filteredProducts.map((product) => (
                     <tr key={product._id} className="group hover:bg-slate-50/50 transition-all">
                       <td className="py-5 px-6">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/50 flex-shrink-0">
                             {product.image ? (
                               <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>
                             )}
                           </div>
                           <div>
                             <div className="font-bold text-slate-900 text-sm tracking-tight">{product.name}</div>
                             <div className="flex items-center gap-2 mt-1">
                               <div className={`w-2.5 h-2.5 rounded-full ${product.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                               <span className="text-[10px] text-slate-400 font-bold uppercase">{product.isVeg ? 'Veg' : 'Non-Veg'}</span>
                             </div>
                           </div>
                         </div>
                       </td>
                       <td className="py-5 px-6">
                         <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                           {product.category}
                         </span>
                       </td>
                       <td className="py-5 px-6">
                         <span className="font-bold text-slate-900 text-sm italic">₹{product.price.toLocaleString()}</span>
                       </td>
                       <td className="py-5 px-6">
                         {product.isAvailable ? (
                           <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                             <CheckCircle2 size={14} /> Active
                           </div>
                         ) : (
                           <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                             <AlertCircle size={14} /> Hidden
                           </div>
                         )}
                       </td>
                       <td className="py-5 px-6 text-right">
                         <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                           <button 
                             onClick={() => { setEditingProduct(product); setForm(product); setShowModal(true); }}
                             className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100"
                           >
                             <Edit size={16} />
                           </button>
                           <button 
                             onClick={() => handleDelete(product._id)}
                             className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100"
                           >
                             <Trash2 size={16} />
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {filteredProducts.length === 0 && (
                 <div className="py-20 text-center space-y-3">
                   <Package size={48} className="mx-auto text-slate-100" />
                   <p className="text-slate-400 font-semibold text-sm">No products found.</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-2xl p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Product Name</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3.5 text-sm font-medium outline-none transition-all" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                  <select className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3.5 text-sm font-bold outline-none transition-all" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Price (₹)</label>
                  <input required type="number" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3.5 text-sm font-bold outline-none transition-all" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Dietary Type</label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={form.isVeg} onChange={() => setForm({...form, isVeg: true})} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-bold text-slate-700">Veg</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={!form.isVeg} onChange={() => setForm({...form, isVeg: false})} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-bold text-slate-700">Non-Veg</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Image URL</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3.5 text-sm font-medium outline-none transition-all" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                <textarea rows="3" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-3.5 text-sm font-medium outline-none transition-all resize-none" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}></textarea>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({...form, isAvailable: e.target.checked})} className="w-5 h-5 rounded-md" />
                <label className="text-sm font-bold text-slate-700">Available for orders</label>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all mt-4">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
