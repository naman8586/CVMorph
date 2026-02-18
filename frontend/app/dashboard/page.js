"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { resumeAPI, aiAPI } from "@/lib/api";
import {
  Plus, Upload, Sparkles, History, LogOut, FileText,
  ShieldCheck, Target, X, Trash2, AlertTriangle,
} from "lucide-react";
import { Button } from "../components/ui/Button";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [versions, setVersions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // version to confirm-delete
  const [selectedRole, setSelectedRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, versionsRes] = await Promise.all([
        resumeAPI.getStats(),
        resumeAPI.getVersions(),
      ]);
      setStats(statsRes.data.stats);
      setVersions(versionsRes.data.versions);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await aiAPI.getRoles();
      setRoles(res.data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!validTypes.includes(file.type)) {
      setUploadError("Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    setUploadError("");
    setUploadFile(file);
  };

  const handleUploadResume = async () => {
    if (!uploadFile) return;
    setUploadLoading(true);
    setUploadError("");
    setUploadProgress("Extracting resume intelligence...");

    try {
      const parseRes = await aiAPI.parseResumeFile(uploadFile);
      const parsedResume = parseRes.data?.resume;

      if (!parsedResume) throw new Error("No resume data returned from AI.");

      setUploadProgress("Saving base profile...");
      await resumeAPI.createOrUpdateBase(parsedResume);
      setUploadProgress("✅ Base resume synchronized!");

      setTimeout(() => {
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadProgress("");
        fetchData();
      }, 1200);

    } catch (error) {
      console.error("Resume upload failed:", error);
      const serverMsg =
        error.response?.data?.message ||
        error.response?.data?.debug ||
        error.message ||
        "Failed to parse resume. Please try again.";
      setUploadError(serverMsg);
      setUploadProgress("");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleAdaptResume = async () => {
    if (!selectedRole) return;
    setAiLoading(true);
    try {
      await aiAPI.adaptResume({ role: selectedRole, jobDescription });
      setShowAIModal(false);
      setSelectedRole("");
      setJobDescription("");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to adapt resume. Try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleDeleteVersion = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await resumeAPI.deleteVersion(deleteTarget.id);
      setVersions((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      setDeleteTarget(null);
      fetchData(); 
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete version.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <motion.div
          animate={{ scale: [0.95, 1, 0.95], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
            <Sparkles className="text-orange-400 w-6 h-6 animate-pulse" />
          </div>
          <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            Syncing Neural Profile...
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-orange-100">
    
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-100/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">

        <header className="flex justify-between items-center mb-12">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-orange-600 via-orange-400 to-amber-300 rounded-xl blur-md opacity-20 group-hover:opacity-60 group-hover:blur-lg transition-all duration-500 animate-pulse" />
              <div className="relative w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-2xl group-hover:rotate-[-4deg] group-hover:scale-110 transition-all duration-300 border border-white/10">
                <span className="text-orange-400 font-black text-[12px] tracking-tighter">CV</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="relative">
                <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">Morph</span>
                <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-orange-500 group-hover:w-full transition-all duration-300 ease-out rounded-full" />
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 group-hover:text-slate-600 transition-colors">Neural Architect</span>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Base Integrity", val: stats?.hasBaseResume ? "STABLE" : "MISSING", icon: ShieldCheck, color: stats?.hasBaseResume ? "text-green-600" : "text-red-500" },
            { label: "Neural Versions", val: stats?.totalVersions || 0, icon: History, color: "text-slate-900" },
            { label: "Available Roles", val: roles.length, icon: Target, color: "text-slate-900" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm flex justify-between items-start">
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</h3>
                <p className={`text-3xl font-bold tracking-tighter ${stat.color}`}>{stat.val}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-400"><stat.icon size={24} /></div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <button onClick={() => { setUploadError(""); setShowUploadModal(true); }}
            className="group bg-white border border-slate-200 text-slate-900 font-bold uppercase tracking-widest text-[11px] py-5 rounded-2xl hover:border-slate-900 transition-all flex items-center justify-center gap-2 shadow-sm">
            <Upload size={16} className="text-slate-400 group-hover:text-slate-900" /> Upload Source
          </button>
          <button onClick={() => router.push("/resume/new")}
            className="group bg-white border border-slate-200 text-slate-900 font-bold uppercase tracking-widest text-[11px] py-5 rounded-2xl hover:border-slate-900 transition-all flex items-center justify-center gap-2 shadow-sm">
            <FileText size={16} className="text-slate-400 group-hover:text-slate-900" />
            {stats?.hasBaseResume ? "Edit Base" : "Create Base"}
          </button>
          <button onClick={() => setShowAIModal(true)} disabled={!stats?.hasBaseResume}
            className="bg-slate-900 text-white font-bold uppercase tracking-widest text-[11px] py-5 rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-20 flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
            <Sparkles size={16} className="text-orange-400" /> AI Morph
          </button>
        </div>
        <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden mb-20">
          <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-3">
              <History className="text-orange-500" size={20} /> Version History
            </h2>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-700 tracking-wider">SECURE SYNC</span>
            </div>
          </div>

          <div className="p-8">
            {versions.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/30">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No Neural Adaptations Found</p>
                <p className="text-slate-300 text-xs mt-2 italic">Upload a resume and morph it to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {versions.map((v, idx) => (
                  <motion.div key={v.id} whileHover={{ y: -4 }}
                    className="bg-white border border-slate-200 p-6 rounded-3xl hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all group relative">

                    <button
                      onClick={() => setDeleteTarget(v)}
                      className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-xl text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Delete version"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="flex justify-between items-start mb-6 pr-8">
                      <div className="bg-orange-50 text-orange-600 p-2.5 rounded-xl">
                        <Sparkles size={18} />
                      </div>
                      <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">
                        V.{idx + 1}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 group-hover:text-orange-600 transition-colors">
                      {v.role}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                      {new Date(v.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </p>

                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/resume/preview/${v.id}`)}
                        className="flex-1 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest py-3.5 rounded-xl transition-all hover:bg-slate-800">
                        Preview
                      </button>
                      <button onClick={() => resumeAPI.downloadPDF(v.id)}
                        className="flex-1 bg-slate-50 text-slate-400 hover:text-slate-900 text-[9px] font-bold uppercase tracking-widest py-3.5 rounded-xl border border-slate-100 transition-all">
                        PDF
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>

        {showUploadModal && (
          <Modal onClose={() => { setShowUploadModal(false); setUploadFile(null); setUploadProgress(""); setUploadError(""); }}
            title="Upload Source" sub="Convert your existing resume into a neural profile.">
            <div className="space-y-5">
              <div className="border-2 border-dashed border-slate-100 rounded-3xl p-10 text-center hover:border-orange-200 bg-slate-50/50 transition-colors relative group">
                <input type="file" onChange={handleFileChange} accept=".pdf,.docx,.txt" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                <Upload size={32} className="mx-auto text-slate-200 group-hover:text-orange-400 mb-4 transition-colors" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  {uploadFile ? uploadFile.name : "Select PDF, DOCX, or TXT"}
                </p>
                {uploadFile && (
                  <p className="text-[10px] text-slate-300 mt-1">
                    {(uploadFile.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>

              {uploadProgress && (
                <div className="text-orange-600 text-[10px] font-bold text-center bg-orange-50 py-3 rounded-xl border border-orange-100">
                  {uploadProgress}
                </div>
              )}

              {uploadError && (
                <div className="text-red-600 text-[10px] font-bold bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-start gap-2">
                  <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <Button
                text={uploadLoading ? "Processing..." : "Start Extraction"}
                disabled={!uploadFile || uploadLoading}
                onClick={handleUploadResume}
                className="w-full h-14 bg-slate-900 text-white"
              />
            </div>
          </Modal>
        )}

        {showAIModal && (
          <Modal onClose={() => { setShowAIModal(false); setSelectedRole(""); setJobDescription(""); }}
            title="AI Adaptation" sub="Morph your base resume for a specific role.">
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Target Role</label>
                <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 text-xs font-bold uppercase tracking-widest focus:border-orange-500 outline-none transition-colors appearance-none cursor-pointer">
                  <option value="">Choose Role...</option>
                  {roles.map((r) => (
                    <option key={r.name} value={r.name}>{r.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Job Description (Recommended)</label>
                <textarea placeholder="Paste the job requirements here for better accuracy..."
                  value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 text-sm h-32 outline-none focus:border-orange-500 transition-colors placeholder:text-slate-300 resize-none" />
              </div>
              <Button
                text={aiLoading ? "Morphing..." : "Initialize Adaptation"}
                disabled={aiLoading || !selectedRole}
                onClick={handleAdaptResume}
                className="w-full h-14 bg-slate-900 text-white"
              />
            </div>
          </Modal>
        )}

        {deleteTarget && (
          <Modal onClose={() => setDeleteTarget(null)} title="Delete Version" sub={`This will permanently remove the "${deleteTarget.role}" version.`}>
            <div className="space-y-5">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs text-red-600 font-medium leading-relaxed">
                  This action cannot be undone. The adapted resume version will be permanently deleted.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)}
                  className="flex-1 bg-slate-50 border border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-widest py-4 rounded-2xl hover:bg-slate-100 transition-all">
                  Cancel
                </button>
                <button onClick={handleDeleteVersion} disabled={deleting}
                  className="flex-1 bg-red-500 text-white font-bold uppercase text-[10px] tracking-widest py-4 rounded-2xl hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {deleting ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting...</> : <><Trash2 size={13} /> Delete</>}
                </button>
              </div>
            </div>
          </Modal>
        )}

      </AnimatePresence>
    </div>
  );
}

function Modal({ onClose, title, sub, children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-slate-200 rounded-[40px] p-10 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">{title}</h2>
        <p className="text-xs text-slate-500 mb-8">{sub}</p>
        {children}
      </motion.div>
    </motion.div>
  );
}