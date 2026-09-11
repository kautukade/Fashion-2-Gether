import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Plus } from 'lucide-react';

export default function AdminCollections() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', is_active: true, is_featured: false });

  useEffect(() => { load(); }, []);
  const load = () => { adminService.getCollections().then(c => { setCollections(c); setLoading(false); }); };

  const handleSave = async () => {
    await adminService.createCollection(form);
    setShowModal(false);
    setForm({ name: '', slug: '', description: '', is_active: true, is_featured: false });
    load();
  };

  if (loading) return <div className="animate-pulse space-y-3">{Array.from({length: 5}).map((_,i) => <div key={i} className="h-12 bg-gray-100 rounded" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display text-charcoal">Collections</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary text-xs py-2.5 flex items-center gap-2"><Plus size={14} /> Add Collection</button>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {collections.map(col => (
              <tr key={col.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-medium text-charcoal">{col.name}</td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{col.slug}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`px-2 py-1 rounded text-xs ${col.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {col.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {collections.length === 0 && <div className="text-center py-12 text-gray-400">No collections yet</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-charcoal mb-4">Add Collection</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold" />
              <input type="text" placeholder="Slug" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold resize-none" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} /> Active</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} /> Featured</label>
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
