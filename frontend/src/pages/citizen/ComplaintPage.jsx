import React, { useState, useRef, useEffect } from "react";
import { 
  FileText, MapPin, Calendar, Scale, UploadCloud, 
  DollarSign, AlertCircle, CheckCircle2, Gavel, X, Loader2, Save, ArrowLeft
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/Authcontext";
import { useNavigate, useLocation } from "react-router-dom";

// --- CONFIGURATION ---
const CASE_CATEGORIES = [
  { id: 'criminal', label: 'Criminal Defense', icon: AlertCircle, types: ['Theft', 'Assault', 'Cyber Crime', 'Bail'] },
  { id: 'civil', label: 'Civil Rights', icon: Scale, types: ['Property Dispute', 'Breach of Contract', 'Defamation'] },
  { id: 'family', label: 'Family Law', icon: FileText, types: ['Divorce', 'Child Custody', 'Alimony', 'Will/Probate'] },
  { id: 'corporate', label: 'Corporate', icon: Gavel, types: ['Startup IP', 'Employment', 'Merger', 'Taxation'] },
];

const BUDGET_RANGES = [
  "Pro Bono (Free Legal Aid)", "₹5,000 - ₹20,000", "₹20,000 - ₹50,000", "₹50,000 - ₹1 Lakh", "₹1 Lakh+"
];

const ComplaintPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  const fileInputRef = useRef(null);

  // --- STATE ---
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draftId, setDraftId] = useState(null);
  
  const [category, setCategory] = useState(CASE_CATEGORIES[0]);
  const [formData, setFormData] = useState({
    caseType: "",
    title: "",
    incidentDate: "",
    location: "",
    description: "",
    budget: "",
    selectionMode: "browse" 
  });

  const [files, setFiles] = useState([]);

  // --- INITIALIZE FROM DRAFT ---
  useEffect(() => {
    if (location.state?.draftData) {
        const d = location.state.draftData;
        setDraftId(d.id);
        setFormData({
            caseType: d.case_type || "",
            title: d.title || "",
            incidentDate: d.incident_date || "",
            location: d.location || "",
            description: d.description || "",
            budget: d.budget_range || "",
            selectionMode: "browse"
        });
        const catObj = CASE_CATEGORIES.find(c => c.label === d.category);
        if (catObj) setCategory(catObj);
        if (d.documents && d.documents.length > 0) {
            const reconstructedFiles = d.documents.map(url => ({
                name: url.split('/').pop(),
                url: url
            }));
            setFiles(reconstructedFiles);
        }
    }
  }, [location.state]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (catId) => {
    const selected = CASE_CATEGORIES.find(c => c.id === catId);
    setCategory(selected);
    setFormData(prev => ({ ...prev, caseType: "" })); 
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('case-files').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('case-files').getPublicUrl(filePath);
      setFiles(prev => [...prev, { name: file.name, url: data.publicUrl }]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // --- SAVE / SUBMIT LOGIC ---
  const handleSaveDraft = async () => {
    if (!formData.title) return alert("Enter a Title to save draft.");
    setLoading(true);
    const payload = {
        user_id: user?.id,
        category: category.label,
        case_type: formData.caseType,
        title: formData.title,
        description: formData.description,
        incident_date: formData.incidentDate || null,
        location: formData.location,
        budget_range: formData.budget,
        documents: files.map(f => f.url),
        status: 'Draft'
    };
    try {
        if (draftId) {
            await supabase.from('cases').update(payload).eq('id', draftId);
        } else {
            const { data } = await supabase.from('cases').insert([payload]).select();
            setDraftId(data[0].id);
        }
        alert("Draft Saved Successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to save draft.");
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.caseType) return alert("Please fill in required fields.");
    setLoading(true);
    try {
      const payload = {
        user_id: user?.id,
        category: category.label,
        case_type: formData.caseType,
        title: formData.title,
        description: formData.description,
        incident_date: formData.incidentDate || null,
        location: formData.location,
        budget_range: formData.budget,
        documents: files.map(f => f.url),
        status: 'Open'
      };
      let finalCaseId = draftId;
      if (draftId) {
         await supabase.from('cases').update(payload).eq('id', draftId);
      } else {
         const { data } = await supabase.from('cases').insert([payload]).select();
         finalCaseId = data[0].id;
      }
      if (formData.selectionMode === 'browse') {
        navigate('/find-lawyer', { state: { caseId: finalCaseId, category: category.label } });
      } else {
        alert("Case Filed Successfully!");
        navigate('/my-cases');
      }
    } catch (error) {
      console.error(error);
      alert("Failed to file case.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] p-6 font-sans transition-colors duration-300">
      {/* Increased max-width to 7xl for "Zoom Out" effect */}
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Slim */}
        <div className="flex justify-between items-center mb-5">
           <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full transition-colors shadow-sm">
                <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300"/>
             </button>
             <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{draftId ? "Resume Filing" : "New Case Filing"}</h1>
             </div>
           </div>
           <button onClick={() => navigate('/case-drafts')} className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-lg transition-colors border border-orange-100 dark:border-orange-900/30">
              View My Drafts
           </button>
        </div>

        {/* MAIN LAYOUT GRID - Reduced gap to 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
            
            {/* LEFT COLUMN: MAIN FORM (Span 8) */}
            <div className="lg:col-span-8 space-y-5">
                
                {/* 1. Category Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 transition-colors">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Step 1: Case Category</label>
                    <div className="grid grid-cols-4 gap-3">
                        {CASE_CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = category.id === cat.id;
                            return (
                                <button 
                                    key={cat.id} 
                                    onClick={() => handleCategorySelect(cat.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${isSelected ? 'bg-orange-600 dark:bg-orange-600 text-white border-orange-600 dark:border-orange-600 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                >
                                    <Icon className="w-5 h-5 mb-2" />
                                    <span className="text-xs font-bold text-center leading-tight">{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Details Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 block">Step 2: Case Details</label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Case Title <span className="text-red-500">*</span></label>
                            {/* Inputs made smaller with py-2.5 and text-sm */}
                            <input name="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-colors" placeholder="e.g. Property Dispute in Rohini Sector 12" />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Specific Charge <span className="text-red-500">*</span></label>
                            <select name="caseType" value={formData.caseType} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none cursor-pointer transition-colors">
                                <option value="">Select Type...</option>
                                {category.types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Budget Range</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                <select name="budget" value={formData.budget} onChange={handleInputChange} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none cursor-pointer transition-colors">
                                    <option value="">Select Budget...</option>
                                    {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Incident Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                <input type="date" name="incidentDate" value={formData.incidentDate} onChange={handleInputChange} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none cursor-pointer transition-colors" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none transition-colors" placeholder="City, State" />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Description <span className="text-red-500">*</span></label>
                            <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none resize-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-colors" placeholder="Briefly describe the incident, timeline, and key parties involved..."></textarea>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR (Span 4) */}
            <div className="lg:col-span-4 flex flex-col gap-5">
                
                {/* Upload Section */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Step 3: Evidence</label>
                    <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-orange-300 dark:hover:border-orange-600 transition-all group">
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.jpg,.png,.docx" />
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-2 group-hover:scale-110 transition-transform">
                            {uploading ? <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" /> : <UploadCloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to Upload</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">PDF, JPG, PNG (Max 5MB)</span>
                    </div>
                    
                    {/* File List */}
                    {files.length > 0 && (
                        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                            {files.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg group hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-sm transition-all">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-1.5 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-600">
                                            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-140px">{file.name}</span>
                                    </div>
                                    <button onClick={() => removeFile(idx)} className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Preference */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Step 4: Matching</label>
                    <div className="space-y-3">
                        <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.selectionMode === 'browse' ? 'bg-orange-600 dark:bg-orange-600 border-orange-600 dark:border-orange-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                            <input type="radio" name="selectionMode" value="browse" checked={formData.selectionMode === 'browse'} onChange={handleInputChange} className="hidden" />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.selectionMode === 'browse' ? 'border-white' : 'border-slate-400 dark:border-slate-600'}`}>
                                {formData.selectionMode === 'browse' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                            </div>
                            <div>
                                <div className={`text-sm font-bold ${formData.selectionMode === 'browse' ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>I'll Choose Lawyer</div>
                                <div className={`text-xs ${formData.selectionMode === 'browse' ? 'text-orange-100' : 'text-slate-500 dark:text-slate-400'}`}>Manual selection from directory</div>
                            </div>
                        </label>

                        <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.selectionMode === 'auto' ? 'bg-orange-600 dark:bg-orange-600 border-orange-600 dark:border-orange-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                            <input type="radio" name="selectionMode" value="auto" checked={formData.selectionMode === 'auto'} onChange={handleInputChange} className="hidden" />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.selectionMode === 'auto' ? 'border-white' : 'border-slate-400 dark:border-slate-600'}`}>
                                {formData.selectionMode === 'auto' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                            </div>
                            <div>
                                <div className={`text-sm font-bold ${formData.selectionMode === 'auto' ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>AI Auto-Match</div>
                                <div className={`text-xs ${formData.selectionMode === 'auto' ? 'text-orange-100' : 'text-slate-500 dark:text-slate-400'}`}>Best match for your case</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 mt-auto">
                    <button onClick={handleSaveDraft} disabled={loading} className="py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex items-center justify-center gap-2">
                        <Save size={16} /> Save Draft
                    </button>
                    <button onClick={handleSubmit} disabled={loading} className="py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200 dark:shadow-orange-900/30">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        Submit Case
                    </button>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintPage;