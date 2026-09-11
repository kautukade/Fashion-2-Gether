import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getEnquiries().then(e => {
      setEnquiries(e);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse space-y-3">{Array.from({length: 5}).map((_,i) => <div key={i} className="h-16 bg-gray-100 rounded" />)}</div>;

  return (
    <div>
      <h1 className="text-2xl font-display text-charcoal mb-6">Contact Enquiries ({enquiries.length})</h1>
      <div className="space-y-4">
        {enquiries.map(e => (
          <div key={e.id} className="bg-white rounded-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-charcoal">{e.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  {e.email && <span className="flex items-center gap-1"><Mail size={12} /> {e.email}</span>}
                  {e.phone && <span className="flex items-center gap-1"><Phone size={12} /> {e.phone}</span>}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                e.status === 'new' ? 'bg-blue-50 text-blue-700' :
                e.status === 'read' ? 'bg-yellow-50 text-yellow-700' :
                'bg-green-50 text-green-700'
              }`}>{e.status}</span>
            </div>
            <p className="text-sm text-charcoal/70">{e.message}</p>
            <p className="text-xs text-gray-400 mt-2">{new Date(e.created_at).toLocaleString()}</p>
          </div>
        ))}
        {enquiries.length === 0 && <div className="text-center py-12 text-gray-400 bg-white rounded-sm border border-gray-100">No enquiries yet</div>}
      </div>
    </div>
  );
}
