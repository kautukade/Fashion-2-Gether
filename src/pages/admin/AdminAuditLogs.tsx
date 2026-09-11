import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAuditLogs().then(l => {
      setLogs(l);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse space-y-3">{Array.from({length: 5}).map((_,i) => <div key={i} className="h-16 bg-gray-100 rounded" />)}</div>;

  return (
    <div>
      <h1 className="text-2xl font-display text-charcoal mb-6">Audit Logs</h1>
      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Action</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Entity</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Entity ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-charcoal">{log.action}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{log.entity_type}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell font-mono text-xs">{log.entity_id?.slice(0, 8)}...</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {logs.length === 0 && <div className="text-center py-12 text-gray-400">No audit logs yet</div>}
      </div>
    </div>
  );
}
