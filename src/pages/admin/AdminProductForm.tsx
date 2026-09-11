import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: '', slug: '', short_description: '', description: '',
    category_id: '', collection_id: '', mrp: 0, selling_price: 0,
    fabric: '', fit: '', care_instructions: '',
    status: 'draft' as 'draft' | 'active' | 'archived',
    is_featured: false, is_trending: false, is_bestseller: false,
  });

  const [variants, setVariants] = useState<any[]>([
    { color: '', size: '', sku: '', stock_quantity: 0, low_stock_threshold: 5, price_override: null, status: 'active' }
  ]);

  useEffect(() => {
    Promise.all([adminService.getCategories(), adminService.getCollections()]).then(([cats, cols]) => {
      setCategories(cats);
      setCollections(cols);
    });

    if (id) {
      adminService.getAllProductsAdmin().then((products) => {
        const product = products.find((p: any) => p.id === id);
        if (product) {
          setForm({
            name: product.name || '', slug: product.slug || '',
            short_description: product.short_description || '', description: product.description || '',
            category_id: product.category_id || '', collection_id: product.collection_id || '',
            mrp: product.mrp || 0, selling_price: product.selling_price || 0,
            fabric: product.fabric || '', fit: product.fit || '',
            care_instructions: product.care_instructions || '',
            status: product.status || 'draft',
            is_featured: product.is_featured || false,
            is_trending: product.is_trending || false,
            is_bestseller: product.is_bestseller || false,
          });
        }
        adminService.getVariantsByProduct(id).then((v) => {
          if (v.length > 0) setVariants(v);
        });
        setLoading(false);
      });
    }
  }, [id]);

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSave = async () => {
    if (!form.name || !form.selling_price) {
      setError('Name and selling price are required');
      return;
    }
    setSaving(true);
    setError('');

    try {
      if (id) {
        const { error: err } = await adminService.updateProduct(id, form);
        if (err) throw new Error(err);
      } else {
        const { data, error: err } = await adminService.createProduct(form);
        if (err) throw new Error(err);
        if (data) navigate(`/admin/products/${data.id}`);
      }
      navigate('/admin/products');
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    }
    setSaving(false);
  };

  const addVariant = () => {
    setVariants([...variants, { color: '', size: '', sku: '', stock_quantity: 0, low_stock_threshold: 5, price_override: null, status: 'active' }]);
  };

  const removeVariant = (i: number) => {
    setVariants(variants.filter((_, idx) => idx !== i));
  };

  if (loading) return <div className="animate-pulse space-y-4">{Array.from({length: 8}).map((_,i) => <div key={i} className="h-10 bg-gray-100 rounded" />)}</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display text-charcoal">{id ? 'Edit Product' : 'New Product'}</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2.5">{saving ? 'Saving...' : 'Save Product'}</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-medium text-charcoal mb-4">Basic Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Product Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value, slug: generateSlug(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Category</label>
            <select value={form.category_id} onChange={(e) => setForm({...form, category_id: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold">
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Collection</label>
            <select value={form.collection_id} onChange={(e) => setForm({...form, collection_id: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold">
              <option value="">Select Collection</option>
              {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">MRP (₹)</label>
            <input type="number" value={form.mrp} onChange={(e) => setForm({...form, mrp: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Selling Price (₹) *</label>
            <input type="number" value={form.selling_price} onChange={(e) => setForm({...form, selling_price: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Fabric</label>
            <input type="text" value={form.fabric} onChange={(e) => setForm({...form, fabric: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Fit</label>
            <input type="text" value={form.fit} onChange={(e) => setForm({...form, fit: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-gray-600 block mb-1">Short Description</label>
            <textarea value={form.short_description} onChange={(e) => setForm({...form, short_description: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-gray-600 block mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value as any})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-4 pt-6">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({...form, is_featured: e.target.checked})} className="rounded" /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_trending} onChange={(e) => setForm({...form, is_trending: e.target.checked})} className="rounded" /> Trending</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_bestseller} onChange={(e) => setForm({...form, is_bestseller: e.target.checked})} className="rounded" /> Bestseller</label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-charcoal">Variants</h2>
          <button onClick={addVariant} className="text-xs text-gold hover:underline flex items-center gap-1"><Plus size={14} /> Add Variant</button>
        </div>
        <div className="space-y-3">
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-6 gap-2 p-3 bg-gray-50 rounded-sm">
              <input type="text" placeholder="Color" value={v.color} onChange={(e) => { const nv = [...variants]; nv[i] = {...nv[i], color: e.target.value}; setVariants(nv); }} className="px-2 py-1.5 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-gold" />
              <input type="text" placeholder="Size" value={v.size} onChange={(e) => { const nv = [...variants]; nv[i] = {...nv[i], size: e.target.value}; setVariants(nv); }} className="px-2 py-1.5 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-gold" />
              <input type="text" placeholder="SKU" value={v.sku} onChange={(e) => { const nv = [...variants]; nv[i] = {...nv[i], sku: e.target.value}; setVariants(nv); }} className="px-2 py-1.5 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-gold" />
              <input type="number" placeholder="Stock" value={v.stock_quantity} onChange={(e) => { const nv = [...variants]; nv[i] = {...nv[i], stock_quantity: Number(e.target.value)}; setVariants(nv); }} className="px-2 py-1.5 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-gold" />
              <input type="number" placeholder="Threshold" value={v.low_stock_threshold} onChange={(e) => { const nv = [...variants]; nv[i] = {...nv[i], low_stock_threshold: Number(e.target.value)}; setVariants(nv); }} className="px-2 py-1.5 border border-gray-200 rounded-sm text-xs focus:outline-none focus:border-gold" />
              <button onClick={() => removeVariant(i)} className="text-red-500 hover:text-red-700 flex items-center justify-center"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
