import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', status: 'active' });

  useEffect(() => { load(); }, []);
  const load = () => { adminService.getCategories().then(c => { setCategories(c); setLoading(false); }); };

  const openAdd = () => { setEditing(null); setForm({ name: '', slug: '', description: '', status: 'active' }); setShowModal(true); };
  const openEdit = (cat: any) => { setEditing(cat); setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', status: cat.status }); setShowModal(true); };

  const handleSave = async () => {
    if (editing) await adminService.updateCategory(editing.id, form);
    else await adminService.createCategory(form);
    setShowModal(false);
    load();
  };

  if (loading) return <div className="animate-pulse space-y-3">{Array.from({length: 5}).map((_,i) => <div key={i} className="h-12 bg-gray-100 rounded" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display text-charcoal">Categories</h1>
        <button onClick={openAdd} className="btn-primary text-xs py-2.5 flex items-center gap-2"><Plus size={14} /> Add Category</button>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-medium text-charcoal">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{cat.slug}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`px-2 py-1 rounded text-xs ${cat.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{cat.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(cat)} className="text-blue-600 hover:text-blue-800 mr-3"><Edit2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <div className="text-center py-12 text-gray-400">No categories yet</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-charcoal mb-4">{editing ? 'Edit' : 'Add'} Category</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold" />
              <input type="text" placeholder="Slug" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold resize-none" />
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold">
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline flex-1 text-xs py-2.5">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex-1 text-xs py-2.5">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
