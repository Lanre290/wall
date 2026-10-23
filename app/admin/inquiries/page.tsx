"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Mail, 
  Calendar, 
  Users, 
  Clock, 
  Check, 
  Trash2, 
  Search, 
  ArrowLeft, 
  Loader2, 
  ExternalLink,
  Filter,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { BottomNav } from "../../components/BottomNav";

interface InquiryItem {
  id: number;
  name: string;
  email: string;
  orgName: string | null;
  eventType: string | null;
  attendees: string | null;
  notes: string | null;
  status: "PENDING" | "CONTACTED" | "CLOSED";
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      } else if (res.status === 401) {
        router.push("/login?redirect=/admin/inquiries");
      }
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setInquiries(prev =>
          prev.map(item => (item.id === id ? { ...item, status: newStatus as any } : item))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
    }
  };

  // Filter inquiries
  const filtered = inquiries.filter(item => {
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    const term = search.toLowerCase();
    const matchesSearch = 
      !term ||
      item.name?.toLowerCase().includes(term) ||
      item.email?.toLowerCase().includes(term) ||
      item.orgName?.toLowerCase().includes(term) ||
      item.eventType?.toLowerCase().includes(term) ||
      item.notes?.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  const pendingCount = inquiries.filter(i => i.status === "PENDING").length;
  const contactedCount = inquiries.filter(i => i.status === "CONTACTED").length;
  const closedCount = inquiries.filter(i => i.status === "CLOSED").length;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#FAF9F6] text-[#111]">
      
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-playfair font-bold text-xl text-gray-900 leading-none">
                  Event Inquiries
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
              <span className="text-xs text-gray-500">
                Manage organization, wedding, and university leads
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchInquiries}
              disabled={loading}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-full bg-[#0A1118] text-white text-xs font-semibold hover:bg-black transition-colors"
            >
              View Pricing Page
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Total Inquiries
            </span>
            <div className="text-3xl font-bold font-sans text-gray-900">{inquiries.length}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
              Pending Review
            </span>
            <div className="text-3xl font-bold font-sans text-amber-800">{pendingCount}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-2xs">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
              Contacted
            </span>
            <div className="text-3xl font-bold font-sans text-blue-800">{contactedCount}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              Closed / Booked
            </span>
            <div className="text-3xl font-bold font-sans text-emerald-800">{closedCount}</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            {[
              { id: "ALL", label: "All Leads" },
              { id: "PENDING", label: `Pending (${pendingCount})` },
              { id: "CONTACTED", label: `Contacted (${contactedCount})` },
              { id: "CLOSED", label: `Closed (${closedCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-[#0A1118] text-white shadow-2xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, org, email..."
              className="w-full text-xs pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-200 rounded-full outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>

        </div>

        {/* Inquiries List */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-gray-400 mb-3" size={32} />
            <p className="text-sm text-gray-500">Loading event inquiries...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-200 shadow-2xs flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Building2 size={28} />
            </div>
            <h3 className="font-playfair text-2xl font-bold mb-2">No Inquiries Found</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
              {search || statusFilter !== "ALL"
                ? "No event inquiries match your current search or filter criteria."
                : "When organizers and event planners submit the inquiry form on your pricing page, their requests will appear here."}
            </p>
            {(search || statusFilter !== "ALL") && (
              <button
                onClick={() => { setSearch(""); setStatusFilter("ALL"); }}
                className="text-xs font-semibold text-black underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-sm transition-shadow p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Organization & Event info */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-playfair font-bold text-lg text-gray-900">
                      {item.orgName || "Private Gathering"}
                    </span>
                    <span className="bg-blue-50 text-blue-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-100">
                      {item.eventType || "Event"}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Users size={12} />
                      {item.attendees || "Attendees not specified"}
                    </span>
                  </div>

                  {/* Notes / message from organizer */}
                  {item.notes && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed font-sans max-w-3xl">
                      "{item.notes}"
                    </p>
                  )}

                  {/* Submitter details */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                    <span className="font-medium text-gray-800">
                      Contact: <strong>{item.name}</strong>
                    </span>
                    <a
                      href={`mailto:${item.email}?subject=Thoughtboard%20Event%20Consultation%20for%20${encodeURIComponent(item.orgName || "your event")}`}
                      className="text-blue-600 hover:text-blue-800 underline font-medium flex items-center gap-1"
                    >
                      <Mail size={13} /> {item.email}
                    </a>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>

                {/* Right: Actions & Status Management */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                  {/* Status Dropdown */}
                  <select
                    value={item.status}
                    disabled={updatingId === item.id}
                    onChange={e => handleStatusChange(item.id, e.target.value)}
                    className={`text-xs font-bold px-3 py-2 rounded-xl border outline-none cursor-pointer transition-colors ${
                      item.status === "PENDING"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : item.status === "CONTACTED"
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    <option value="PENDING">Pending Review</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="CLOSED">Closed / Booked</option>
                  </select>

                  {/* Quick Email Button */}
                  <a
                    href={`mailto:${item.email}?subject=Thoughtboard%20Event%20Consultation%20for%20${encodeURIComponent(item.orgName || "your event")}`}
                    className="bg-[#0A1118] hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Send Email Reply"
                  >
                    <Mail size={13} />
                    <span>Reply</span>
                  </a>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete inquiry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      <BottomNav active="account" />
    </div>
  );
}
