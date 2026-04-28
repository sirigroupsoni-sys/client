import React, { useState } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Type, 
  Layout, 
  Settings, 
  Save, 
  Eye, 
  ArrowRight,
  Globe,
  Monitor,
  CheckCircle2
} from 'lucide-react';

const CMS = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Content Management</h1>
          <p className="text-slate-500 font-medium mt-1">Update website copy, images, and brand assets in real-time.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
             <Eye size={16} />
             Live Preview
           </button>
           <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-70"
           >
             {isSaving ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</span> : <><Save size={16} /> Save Changes</>}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
             <div className="space-y-1">
                {[
                  { id: 'hero', label: 'Hero Section', icon: Layout },
                  { id: 'seo', label: 'SEO & Metadata', icon: Globe },
                  { id: 'services', label: 'Service Highlights', icon: Monitor },
                  { id: 'announcement', label: 'Announcement Bar', icon: Type },
                  { id: 'assets', label: 'Brand Assets', icon: ImageIcon },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeSection === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
             </div>
          </div>
          
          <div className="bg-slate-900 p-6 rounded-2xl text-white">
             <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Pro Tip</h4>
             <p className="text-xs text-slate-300 leading-relaxed font-medium">
               Optimizing your images before upload can improve page load speed by up to 40%.
             </p>
          </div>
        </div>

        {/* Content Editor Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            {activeSection === 'hero' && (
              <div className="p-10 space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Layout size={20} /></div>
                  <h3 className="text-xl font-bold text-slate-900">Hero Section Settings</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Headline</label>
                    <input 
                      type="text" 
                      defaultValue="Exquisite Catering for Every Occasion"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-4 text-sm font-bold outline-none transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Sub-headline Copy</label>
                    <textarea 
                      rows={3}
                      defaultValue="From corporate events to intimate weddings, MS Caterers brings a blend of traditional flavors and modern presentation to your table."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-4 text-sm font-medium outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary CTA Text</label>
                      <input 
                        type="text" 
                        defaultValue="Explore Menu"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-4 text-sm font-bold outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Secondary CTA Text</label>
                      <input 
                        type="text" 
                        defaultValue="Check Pricing"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl p-4 text-sm font-bold outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4">Background Visual</p>
                   <div className="aspect-video w-full rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-50 transition-all group">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-slate-400">
                        <ImageIcon size={24} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-600">Click to upload or drag & drop</p>
                        <p className="text-xs text-slate-400 mt-1">Recommended size: 1920x1080px (Max 5MB)</p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeSection !== 'hero' && (
              <div className="p-20 text-center space-y-4">
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                   <Settings size={32} />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900">Module Under Construction</h3>
                 <p className="text-sm text-slate-500 max-w-sm mx-auto">This CMS module is currently being optimized for high-performance content delivery.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-bottom-10 duration-500">
           <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-800">
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-sm font-bold tracking-tight">Content published successfully!</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default CMS;
