import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) { setLoading(false); return; }
    supabase.from('site_settings').select('*').then(({ data }) => {
      const map: Record<string, string> = {};
      (data || []).forEach((s: any) => { map[s.key] = s.value; });
      setSettings(map);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from('site_settings').upsert({ key, value });
    }
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (loading) return <div className="animate-pulse space-y-3">{Array.from({length: 8}).map((_,i) => <div key={i} className="h-12 bg-gray-100 rounded" />)}</div>;

  const fields = [
    { key: 'brand_name', label: 'Brand Name' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'whatsapp_number', label: 'WhatsApp Number (international format)' },
    { key: 'currency', label: 'Currency' },
    { key: 'currency_symbol', label: 'Currency Symbol' },
    { key: 'free_shipping_threshold', label: 'Free Shipping Threshold (₹)' },
    { key: 'default_shipping_cost', label: 'Default Shipping Cost (₹)' },
    { key: 'cod_enabled', label: 'COD Enabled (true/false)' },
    { key: 'cod_fee', label: 'COD Fee (₹)' },
    { key: 'return_period_days', label: 'Return Period (days)' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display text-charcoal">Site Settings</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2.5">{saving ? 'Saving...' : 'Save Settings'}</button>
      </div>

      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-sm text-sm text-green-700">Settings saved successfully!</div>}

      <div className="bg-white rounded-sm border border-gray-100 p-6">
        <div className="space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-xs font-medium text-gray-600 block mb-1">{f.label}</label>
              <input
                type="text"
                value={settings[f.key] || ''}
                onChange={e => setSettings({...settings, [f.key]: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-gold"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
