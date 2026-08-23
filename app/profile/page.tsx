"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { 
  Settings, User, Pencil, Heart, FileText, Compass, 
  UserCog, Shield, HelpCircle, ChevronRight, LogOut, 
  Link2, Mail, Share2, Loader2 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', tagsInput: '' });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setEditForm({
            name: data.user.name || '',
            bio: data.user.bio || '',
            tagsInput: (data.user.tags || []).join(', '),
          });
        } else if (res.status === 401) {
          router.push("/login");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const tags = editForm.tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editForm.name, bio: editForm.bio, tags }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile((prev: any) => ({ ...prev, user: data.user }));
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;
  }

  if (!profile) return null;

  const { user, stats } = profile;
  const profileImage = user.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      
      {/* --- MOBILE LAYOUT --- */}
      <div className="md:hidden flex flex-col w-full px-6 py-6 pb-24">
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-playfair text-2xl font-bold text-[#111]">Profile</h1>
          <div className="flex gap-4 items-center text-[#111]">
            <button onClick={() => setIsEditing(true)}><Settings size={22} /></button>
            <div className="w-8 h-8 rounded-full bg-[#0A1118] text-white flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </div>

        {/* Mobile Profile Info */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-sm relative">
              <img 
                src={profileImage} 
                alt={user.name}
                className="object-cover w-full h-full" 
              />
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#0A1118] text-white rounded-full flex items-center justify-center border-2 border-[#FAF9F6] shadow-sm"
            >
              <Pencil size={14} />
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-[#111] mb-2">{user.name}</h2>
          <p className="text-gray-600 italic text-sm max-w-[260px] leading-relaxed">
            {user.bio || `"Collector of moments, leaves notes where I go. Seeking the things we never said."`}
          </p>
        </div>

        {/* Mobile Metrics */}
        <div className="flex flex-col gap-3 mb-10">
          <div className="bg-[#F3F2EE] rounded-2xl p-5 flex flex-col items-center justify-center">
            <Heart size={20} className="text-[#656752] mb-2 fill-[#656752]" />
            <span className="text-2xl font-bold text-[#111]">{stats.heartsReceived}</span>
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Hearts Received</span>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-[#E2E8F4] rounded-2xl p-5 flex flex-col items-center justify-center">
              <FileText size={20} className="text-[#3b4776] mb-2" />
              <span className="text-2xl font-bold text-[#111]">{stats.notesLeft}</span>
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Notes Left</span>
            </div>
            <div className="flex-1 bg-[#EAEAC2] rounded-2xl p-5 flex flex-col items-center justify-center">
              <Compass size={20} className="text-[#656752] mb-2" />
              <span className="text-2xl font-bold text-[#111]">{stats.wallsCreated}</span>
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Walls Created</span>
            </div>
          </div>
        </div>

        {/* Mobile Settings List */}
        <div className="bg-[#F3F2EE] rounded-2xl p-2 mb-8">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-4 p-4 border-b border-gray-200/50 w-full text-left"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-sm"><UserCog size={16} /></div>
            <span className="font-medium text-[#111] flex-1 text-sm">Edit Profile</span>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
          <Link href="#" className="flex items-center gap-4 p-4 border-b border-gray-200/50">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-sm"><Shield size={16} /></div>
            <span className="font-medium text-[#111] flex-1 text-sm">Privacy Preferences</span>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
          <Link href="#" className="flex items-center gap-4 p-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-sm"><HelpCircle size={16} /></div>
            <span className="font-medium text-[#111] flex-1 text-sm">Help & Support</span>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 text-[#D32F2F] font-medium text-sm p-4 w-full"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>


      {/* --- DESKTOP LAYOUT --- */}
      <div className="hidden md:flex max-w-6xl mx-auto w-full px-12 py-12 gap-16">
        
        {/* Left Column - Profile Card */}
        <div className="w-[340px] flex flex-col shrink-0">
          {/* Portrait Image */}
          <div className="w-full h-[460px] rounded-2xl overflow-hidden relative mb-6 shadow-sm">
            <img 
              src={profileImage} 
              alt="Sarah Jenkins" 
              className="object-cover w-full h-full" 
            />
            {/* Gradient Overlay for Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <h1 className="absolute bottom-6 left-6 text-4xl font-bold text-white font-sans tracking-tight">
              {user.name.split(' ')[0]}.
            </h1>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            {user.bio || "Digital archivist and aspiring atelier curator. Exploring the intersection of analog memories and spatial computing. Based in Berlin, creating walls of inspiration since 2023."}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {user.tags && user.tags.length > 0 ? (
              user.tags.map((tag: string) => (
                <span key={tag} className="bg-[#EBE9E2] text-gray-600 text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wider">{tag}</span>
              ))
            ) : (
              <>
                <span className="bg-[#EBE9E2] text-gray-600 text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wider">Design</span>
                <span className="bg-[#EBE9E2] text-gray-600 text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wider">Curation</span>
              </>
            )}
          </div>

          <button 
            onClick={() => setIsEditing(true)}
            className="w-full bg-[#0A1118] text-white py-3.5 rounded-full text-sm font-semibold hover:bg-black transition-colors mb-8 shadow-sm"
          >
            Edit Profile
          </button>

          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Connect</span>
            <div className="flex gap-3">
              <button className="w-10 h-10 bg-[#EBE9E2] rounded-full flex items-center justify-center text-gray-700 hover:bg-[#E2E0D8] transition-colors"><Link2 size={16} /></button>
              <button className="w-10 h-10 bg-[#EBE9E2] rounded-full flex items-center justify-center text-gray-700 hover:bg-[#E2E0D8] transition-colors"><Mail size={16} /></button>
              <button className="w-10 h-10 bg-[#EBE9E2] rounded-full flex items-center justify-center text-gray-700 hover:bg-[#E2E0D8] transition-colors"><Share2 size={16} /></button>
            </div>
          </div>
        </div>

        {/* Right Column - Metrics */}
        <div className="flex-1 flex flex-col pt-2">
          <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-8">
            <h2 className="text-2xl font-bold text-[#111]">Contributions</h2>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Lifetime</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#F8F7F4] rounded-xl p-8 flex flex-col">
              <FileText size={20} className="text-gray-700 mb-6" />
              <span className="text-4xl font-bold text-[#111] mb-2 font-sans tracking-tight">{stats.notesLeft}</span>
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Notes Left</span>
            </div>
            
            <div className="bg-[#F8F7F4] rounded-xl p-8 flex flex-col">
              <Compass size={20} className="text-gray-700 mb-6" />
              <span className="text-4xl font-bold text-[#111] mb-2 font-sans tracking-tight">{stats.wallsCreated}</span>
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Walls Curated</span>
            </div>
            
            <div className="bg-[#F8F7F4] rounded-xl p-8 flex flex-col">
              <Heart size={20} className="text-gray-700 mb-6" />
              <span className="text-4xl font-bold text-[#111] mb-2 font-sans tracking-tight">{stats.heartsReceived}</span>
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Appreciations</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="account" />

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <div className="relative bg-white rounded-t-3xl md:rounded-3xl p-6 md:p-10 w-full md:max-w-lg mx-auto shadow-2xl z-10">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden" />
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-2xl font-bold text-[#111]">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <span className="text-xl leading-none">✕</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-[#F6F5F2] rounded-xl px-4 py-3 text-sm font-medium text-[#111] outline-none focus:ring-2 focus:ring-[#0A1118]/20"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  className="w-full bg-[#F6F5F2] rounded-xl px-4 py-3 text-sm font-medium text-[#111] outline-none focus:ring-2 focus:ring-[#0A1118]/20 resize-none"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Tags <span className="normal-case font-normal">(comma separated)</span></label>
                <input
                  type="text"
                  value={editForm.tagsInput}
                  onChange={e => setEditForm(f => ({ ...f, tagsInput: e.target.value }))}
                  placeholder="Design, Curation, Art..."
                  className="w-full bg-[#F6F5F2] rounded-xl px-4 py-3 text-sm font-medium text-[#111] outline-none focus:ring-2 focus:ring-[#0A1118]/20"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving || !editForm.name.trim()}
              className="mt-6 w-full bg-[#0A1118] text-white py-3.5 rounded-full text-sm font-semibold hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
