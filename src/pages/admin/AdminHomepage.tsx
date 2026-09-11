import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminHomepage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) { setLoading(false); return; }
    supabase.from('homepage_sections').select('*').order('sort_order').then(({ data }) => {
      setSections(data || []);
      setLoading(false);
    });
  }, []);

  const toggleVisibility = async (id: string, current: boolean) => {
    if (!supabase) return;
    await supabase.from('homepage_sections').update({ is_visible: !current }).eq('id', id);
    setSections(sections.map(s => s.id === id ? { ...s, is_visible: !current } : s));
  };

  const updateTitle = async (id: string, title: string) => {
    if (!supabase) return;
    await supabase.from('homepage_sections').update({ title }).eq('id', id);
    setSections(sections.map(s => s.id === id ? { ...s, title } : s));
  };

  if (loading) return <div className="animate-pulse space-y-3">{Array.from({length: 5}).map((_,i) => <div key={i} className="h-16 bg-gray-100 rounded" />)}</div>;

  return (
    <div>
      <h1 className="text-2xl font-display text-charcoal mb-6">Homepage CMS</h1>
      <p className="text-sm text-gray-500 mb-6">Control which sections appear on the homepage and their order.</p>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {sections.map((section, i) => (
            <div key={section.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50/50">
              <span className="text-xs text-gray-400 w-6">{i + 1}</span>
              <div className="flex-1">
                <input
                  type="text"
                  value={section.title || section.section_key}
                  onChange={(e) => updateTitle(section.id, e.target.value)}
                  className="text-sm font-medium text-charcoal bg-transparent border-none focus:outline-none focus:border-b focus:border-gold w-full"
                />
                <p className="text-xs text-gray-400">{section.section_key}</p>
              </div>
              <button
                onClick={() => toggleVisibility(section.id, section.is_visible)}
                className={`p-2 rounded ${section.is_visible ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}
              >
                {section.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          ))}
        </div>
        {sections.length === 0 && <div className="text-center py-12 text-gray-400">No sections configured</div>}
      </div>
    </div>
  );
}
