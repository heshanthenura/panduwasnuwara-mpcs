'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import {
  Users,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Search,
  LogOut,
  ShieldCheck,
  Edit2,
  Trash2,
  X,
  Check,
  Phone,
  MessageCircle,
  User as UserIcon,
  Globe,
  Menu,
  ArrowRight,
  BarChart3,
  Upload,
  FileSpreadsheet,
  UserCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { User, GalleryPost } from '@/lib/types';

export default function AdminDashboardPage() {
  const t = useTranslations('Admin');
  const locale = useLocale();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'users' | 'metrics' | 'gallery' | 'settings'>('users');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [galleryPosts, setGalleryPosts] = useState<GalleryPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [yearsOfService, setYearsOfService] = useState('50');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Live Statistics State
  const [liveStats, setLiveStats] = useState({
    membersCount: 0,
    votersCount: 0,
    businessesCount: 10,
    yearsOfService: 50
  });

  // Member CSV Upload State
  const [memberFile, setMemberFile] = useState<File | null>(null);
  const [memberMode, setMemberMode] = useState<'append' | 'replace'>('append');
  const [isImportingMembers, setIsImportingMembers] = useState(false);
  const [memberImportMsg, setMemberImportMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Voter Register Upload State
  const [voterFile, setVoterFile] = useState<File | null>(null);
  const [voterMode, setVoterMode] = useState<'append' | 'replace'>('append');
  const [isUploadingVoters, setIsUploadingVoters] = useState(false);
  const [voterUploadMsg, setVoterUploadMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit user modal state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editNic, setEditNic] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');
  const [editPassword, setEditPassword] = useState('');
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [userError, setUserError] = useState('');

  const loadAdminData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersRes, galleryRes, settingsRes, statsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/gallery'),
        fetch('/api/admin/settings'),
        fetch('/api/stats')
      ]);

      const usersData = await usersRes.json();
      const galleryData = await galleryRes.json();
      const settingsData = await settingsRes.json();
      const statsData = await statsRes.json();

      if (usersData.success) setUsers(usersData.users);
      if (galleryData.success) setGalleryPosts(galleryData.posts);
      if (settingsData.success) {
        if (settingsData.settings?.recoveryWhatsAppNumber) {
          setWhatsappNumber(settingsData.settings.recoveryWhatsAppNumber);
        }
        if (settingsData.settings?.yearsOfService) {
          setYearsOfService(String(settingsData.settings.yearsOfService));
        }
      }
      if (statsData.success && statsData.stats) {
        setLiveStats(statsData.stats);
        if (statsData.stats.yearsOfService) {
          setYearsOfService(String(statsData.stats.yearsOfService));
        }
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check admin session
  const verifyAdmin = useCallback(async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (!data.isAuthenticated || !data.isAdmin) {
        router.push(`/${locale}/login`);
        return;
      }
      loadAdminData();
    } catch {
      router.push(`/${locale}/login`);
    }
  }, [locale, router, loadAdminData]);

  useEffect(() => {
    verifyAdmin();
  }, [verifyAdmin]);

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    });
    router.push(`/${locale}/login`);
    router.refresh();
  };

  // Open Edit User Modal
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditFullName(user.full_name || '');
    setEditNic(user.nic || '');
    setEditPhone(user.phone || '');
    setEditRole(user.role || 'user');
    setEditPassword('');
    setUserError('');
  };

  // Save User Edit
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSavingUser(true);
    setUserError('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          fullName: editFullName,
          nic: editNic,
          phone: editPhone,
          role: editRole,
          password: editPassword || undefined
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUsers(prev => prev.map(u => (u.id === editingUser.id ? { ...u, ...data.user } : u)));
        setEditingUser(null);
      } else {
        setUserError(data.error || 'Failed to update user');
      }
    } catch {
      setUserError('Error updating user');
    } finally {
      setIsSavingUser(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: number) => {
    if (!confirm(t('deleteConfirm'))) return;

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch {
      alert('Error deleting user');
    }
  };

  // Delete Comment from Gallery
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId })
      });
      const data = await res.json();
      if (data.success) {
        setGalleryPosts(prev =>
          prev.map(p => ({
            ...p,
            comments: p.comments.filter(c => c.id !== commentId)
          }))
        );
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  // Save Settings (WhatsApp & Years of Service)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const parsedYears = parseInt(yearsOfService, 10) || 50;
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recoveryWhatsAppNumber: whatsappNumber,
          yearsOfService: parsedYears
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSuccess(true);
        setLiveStats(prev => ({ ...prev, yearsOfService: parsedYears }));
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Import Members from CSV
  const handleImportMembers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberFile) return;

    setIsImportingMembers(true);
    setMemberImportMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', memberFile);
      formData.append('mode', memberMode);

      const res = await fetch('/api/admin/members/import', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setMemberImportMsg({ type: 'success', text: data.message || `Successfully imported ${data.importedCount} members!` });
        setLiveStats(prev => ({ ...prev, membersCount: data.totalCount }));
        setMemberFile(null);
      } else {
        setMemberImportMsg({ type: 'error', text: data.error || 'Failed to import member records.' });
      }
    } catch {
      setMemberImportMsg({ type: 'error', text: 'Error uploading file.' });
    } finally {
      setIsImportingMembers(false);
    }
  };

  // Upload Electoral Register (Eligible Voters)
  const handleUploadVoters = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterFile) return;

    setIsUploadingVoters(true);
    setVoterUploadMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', voterFile);
      formData.append('mode', voterMode);

      const res = await fetch('/api/admin/voters/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setVoterUploadMsg({ type: 'success', text: data.message || `Successfully processed ${data.uploadedCount} eligible voters!` });
        setLiveStats(prev => ({ ...prev, votersCount: data.totalCount }));
        setVoterFile(null);
      } else {
        setVoterUploadMsg({ type: 'error', text: data.error || 'Failed to upload electoral register.' });
      }
    } catch {
      setVoterUploadMsg({ type: 'error', text: 'Error uploading electoral register file.' });
    } finally {
      setIsUploadingVoters(false);
    }
  };

  // Filtered users for search
  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      (u.full_name && u.full_name.toLowerCase().includes(q)) ||
      (u.nic && u.nic.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q))
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#003399] border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-neutral-900">
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200 bg-white flex items-center justify-center shrink-0">
            <Image
              src="/logo-photo.jpg"
              alt="Logo"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-xs font-bold font-condensed tracking-wide uppercase text-neutral-900">
              Panduwasnuwara MPCS
            </h1>
            <p className="text-[10px] text-neutral-500 font-normal">{t('adminConsole')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}`}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-[11px]">{t('viewWebsite')}</span>
          </Link>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1.5 rounded-lg text-neutral-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE BACKDROP */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 lg:w-72 bg-white border-r border-neutral-200/90 flex flex-col justify-between p-5 transition-transform duration-200 ease-in-out md:static md:translate-x-0 md:h-screen md:sticky md:top-0 shrink-0 shadow-xs ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200 bg-white flex items-center justify-center shrink-0">
                <Image
                  src="/logo-photo.jpg"
                  alt="MPCS Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-condensed text-sm font-bold text-neutral-900 tracking-wide uppercase leading-tight">
                  Panduwasnuwara
                </h2>
                <p className="text-[11px] text-neutral-500 font-normal mt-0.5">
                  {t('adminConsole')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-2">
              {t('navigation')}
            </p>

            <button
              onClick={() => {
                setActiveTab('users');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>{t('usersTab')}</span>
              </div>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                  activeTab === 'users' ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {users.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('metrics');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'metrics'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>{t('metricsTab')}</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('gallery');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4" />
                <span>{t('galleryTab')}</span>
              </div>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                  activeTab === 'gallery' ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {galleryPosts.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>{t('settingsTab')}</span>
            </button>
          </div>

          {/* Quick Website Toggle Section */}
          <div className="pt-4 border-t border-neutral-100 space-y-2">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3">
              {locale === 'si' ? 'වෙබ් අඩවිය' : 'Live Website'}
            </p>
            <Link
              href={`/${locale}`}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-neutral-500" />
                <span>{t('switchToWebsite')}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </Link>
          </div>
        </div>

        {/* Sidebar Bottom (User identity & Log out) */}
        <div className="pt-4 border-t border-neutral-100 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 font-bold text-xs">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-neutral-900 truncate">Administrator</p>
              <p className="text-[10px] text-neutral-400 font-mono">admin</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-lg border border-neutral-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-neutral-600 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Main Content Sticky Header */}
        <header className="bg-white border-b border-neutral-200/90 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div>
            <h1 className="font-condensed text-xl font-bold text-neutral-900 leading-tight">
              {activeTab === 'users' && t('usersTab')}
              {activeTab === 'metrics' && t('metricsTab')}
              {activeTab === 'gallery' && t('galleryTab')}
              {activeTab === 'settings' && t('settingsTab')}
            </h1>
            <p className="text-xs text-neutral-500">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-neutral-200 text-neutral-700 hover:text-[#003399] text-xs font-bold transition-all shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-[#003399]" />
              <span className="hidden sm:inline">{t('viewWebsite')}</span>
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full">
        {/* TAB 1: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="font-condensed text-lg font-bold text-neutral-900">
                {t('usersTab')}
              </h2>

              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('searchMembers')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-hidden focus:border-[#003399] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full text-left text-xs text-neutral-700">
                <thead className="bg-slate-50 border-b border-neutral-200 text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">
                  <tr>
                    <th className="px-4 py-3">{t('thName')}</th>
                    <th className="px-4 py-3">{t('thNic')}</th>
                    <th className="px-4 py-3">{t('thPhone')}</th>
                    <th className="px-4 py-3">{t('thRole')}</th>
                    <th className="px-4 py-3">{t('thDate')}</th>
                    <th className="px-4 py-3 text-right">{t('thActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                        {t('noMembersFound')}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3 font-semibold text-neutral-900">
                          {user.full_name || user.username}
                        </td>
                        <td className="px-4 py-3 font-mono font-medium text-neutral-700">
                          {user.nic || '—'}
                        </td>
                        <td className="px-4 py-3 font-mono text-neutral-600">
                          {user.phone || '—'}
                        </td>
                        <td className="px-4 py-3">
                          {user.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-neutral-900 text-white shadow-2xs">
                              <ShieldCheck className="w-3 h-3 text-neutral-300" />
                              <span>Admin</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200/80">
                              <UserIcon className="w-3 h-3 text-neutral-400" />
                              <span>Member</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-neutral-400 text-[11px]">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-1.5 rounded-lg text-neutral-600 hover:text-[#003399] hover:bg-slate-100 transition-colors cursor-pointer"
                              title={t('edit')}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1.5 rounded-lg text-neutral-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title={t('delete')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DATA & LIVE METRICS (CSV / EXCEL & ELECTORAL REGISTER IMPORTS) */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            {/* Top Info Banner */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs p-5 sm:p-6 space-y-2">
              <div className="flex items-center gap-2 text-[#003399]">
                <BarChart3 className="w-5 h-5" />
                <h2 className="font-condensed text-lg font-bold text-neutral-900">
                  {t('metricsTab')}
                </h2>
              </div>
              <p className="text-xs text-neutral-500 max-w-3xl leading-relaxed">
                {locale === 'si'
                  ? 'මෙහිදී සාමාජික ලැයිස්තු (CSV/Excel) සහ මැතිවරණ නාමලේඛන (Electoral Register) උඩුගත කිරීම මගින් මුල් පිටුවේ සජීවී කවුන්ටරය ස්වයංක්‍රීයව යාවත්කාලීන කළ හැකිය.'
                  : 'Manage operational data registries. Uploading member spreadsheets (CSV/Excel) and official electoral register files automatically reflects on the real-time homepage live counter every 5 seconds.'}
              </p>
            </div>

            {/* Overview Stats Cards - 4 Live Counter Cards (Analytics Only) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">{t('totalMembers')}</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#003399]">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-semibold tracking-tight text-neutral-900 font-mono">
                  {(liveStats.membersCount || users.length).toLocaleString()}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">{t('votersCountLabel')}</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-semibold tracking-tight text-neutral-900 font-mono">
                  {liveStats.votersCount.toLocaleString()}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">{t('businessesCountLabel')}</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-semibold tracking-tight text-neutral-900 font-mono">
                  {liveStats.businessesCount}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">{t('yearsSettingTitle')}</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-700">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-semibold tracking-tight text-neutral-900 font-mono">
                  {liveStats.yearsOfService}+ Yrs
                </p>
              </div>
            </div>

            {/* Grid of 2 Upload Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* SECTION A: MEMBERS CSV/EXCEL IMPORT */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs p-5 sm:p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2 text-[#003399]">
                      <FileSpreadsheet className="w-5 h-5" />
                      <h3 className="font-condensed text-base font-bold text-neutral-900">
                        {t('membersImportTitle')}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#003399] font-bold border border-blue-200/60">
                      {liveStats.membersCount.toLocaleString()} {locale === 'si' ? 'සාමාජිකයින්' : 'Members'}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {t('membersImportDesc')}
                  </p>

                  {memberImportMsg && (
                    <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      memberImportMsg.type === 'success' 
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                        : 'bg-rose-50 border border-rose-200 text-rose-800'
                    }`}>
                      {memberImportMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : null}
                      <span>{memberImportMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleImportMembers} className="space-y-4 pt-1">
                    {/* File Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-700">
                        {locale === 'si' ? 'සාමාජික ගොනුව තෝරන්න (CSV / TSV / Excel)' : 'Select Member File (CSV / TSV)'}
                      </label>
                      <input
                        type="file"
                        accept=".csv,.txt,.tsv"
                        required
                        onChange={e => setMemberFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-neutral-700 hover:file:bg-slate-200 cursor-pointer border border-neutral-200 rounded-xl p-2 bg-slate-50"
                      />
                    </div>

                    {/* Mode Radio */}
                    <div className="flex items-center gap-4 text-xs text-neutral-700">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="memberMode"
                          value="append"
                          checked={memberMode === 'append'}
                          onChange={() => setMemberMode('append')}
                          className="text-[#003399]"
                        />
                        <span>{t('modeAppend')}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="memberMode"
                          value="replace"
                          checked={memberMode === 'replace'}
                          onChange={() => setMemberMode('replace')}
                          className="text-[#003399]"
                        />
                        <span>{t('modeReplace')}</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isImportingMembers || !memberFile}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#003399] hover:bg-[#002266] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Upload className={`w-3.5 h-3.5 ${isImportingMembers ? 'animate-bounce' : ''}`} />
                      <span>{isImportingMembers ? 'Processing...' : t('uploadBtn')}</span>
                    </button>
                  </form>
                </div>

                {/* Helper Schema Snippet */}
                <div className="pt-3 border-t border-neutral-100 mt-4 text-[11px] text-neutral-400 font-mono space-y-1 bg-slate-50/70 p-3 rounded-xl border border-neutral-100">
                  <p className="font-bold text-neutral-600 font-sans">{locale === 'si' ? 'අනුමත තීරු පිළිවෙළ:' : 'Expected Columns Format:'}</p>
                  <p className="text-neutral-600">Member_Number, Full_Name, NIC, Phone</p>
                  <p className="text-neutral-400 text-[10px] font-sans">{locale === 'si' ? 'හෝ නම සහ හැඳුනුම්පත් අංකය සහිත ඕනෑම CSV ගොනුවක්.' : 'Header row is automatically detected.'}</p>
                </div>
              </div>

              {/* SECTION B: ELECTORAL REGISTER UPLOAD (ELIGIBLE VOTERS) */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs p-5 sm:p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <UserCheck className="w-5 h-5" />
                      <h3 className="font-condensed text-base font-bold text-neutral-900">
                        {t('votersUploadTitle')}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60">
                      {liveStats.votersCount.toLocaleString()} {locale === 'si' ? 'ඡන්දදායකයින්' : 'Voters'}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {t('votersUploadDesc')}
                  </p>

                  {voterUploadMsg && (
                    <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      voterUploadMsg.type === 'success' 
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                        : 'bg-rose-50 border border-rose-200 text-rose-800'
                    }`}>
                      {voterUploadMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : null}
                      <span>{voterUploadMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleUploadVoters} className="space-y-4 pt-1">
                    {/* File Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-700">
                        {locale === 'si' ? 'ඡන්ද හිමි නාමලේඛන ගොනුව (CSV / Text)' : 'Select Electoral Register File (CSV / Text)'}
                      </label>
                      <input
                        type="file"
                        accept=".csv,.txt,.tsv"
                        required
                        onChange={e => setVoterFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-neutral-700 hover:file:bg-slate-200 cursor-pointer border border-neutral-200 rounded-xl p-2 bg-slate-50"
                      />
                    </div>

                    {/* Mode Radio */}
                    <div className="flex items-center gap-4 text-xs text-neutral-700">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="voterMode"
                          value="append"
                          checked={voterMode === 'append'}
                          onChange={() => setVoterMode('append')}
                          className="text-emerald-700"
                        />
                        <span>{t('modeAppend')}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="voterMode"
                          value="replace"
                          checked={voterMode === 'replace'}
                          onChange={() => setVoterMode('replace')}
                          className="text-emerald-700"
                        />
                        <span>{t('modeReplace')}</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isUploadingVoters || !voterFile}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Upload className={`w-3.5 h-3.5 ${isUploadingVoters ? 'animate-bounce' : ''}`} />
                      <span>{isUploadingVoters ? 'Processing...' : t('uploadBtn')}</span>
                    </button>
                  </form>
                </div>

                {/* Helper Schema Snippet */}
                <div className="pt-3 border-t border-neutral-100 mt-4 text-[11px] text-neutral-400 font-mono space-y-1 bg-slate-50/70 p-3 rounded-xl border border-neutral-100">
                  <p className="font-bold text-neutral-600 font-sans">{locale === 'si' ? 'අනුමත තීරු පිළිවෙළ:' : 'Expected Columns Format:'}</p>
                  <p className="text-neutral-600">Voter_Number, Full_Name, NIC, Polling_Division</p>
                  <p className="text-neutral-400 text-[10px] font-sans">{locale === 'si' ? 'හෝ නම සහ හැඳුනුම්පත් අංකය සහිත ලැයිස්තුව.' : 'Verified voters count automatically syncs.'}</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: GALLERY MODERATION */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            {galleryPosts.map(post => (
              <div
                key={post.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs p-5 sm:p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={post.imageSrc}
                      alt="Post"
                      width={64}
                      height={48}
                      className="w-16 h-12 rounded-xl object-cover border border-neutral-200"
                    />
                    <div>
                      <h3 className="font-condensed text-sm font-bold text-neutral-900">
                        {post.id}
                      </h3>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        {post.likesCount} Likes • {post.comments.length} Comments
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-2 border-t border-neutral-100 pt-3">
                  <h4 className="text-xs font-bold text-neutral-700">Comments:</h4>
                  {post.comments.length === 0 ? (
                    <p className="text-xs text-neutral-400 italic">No comments on this post.</p>
                  ) : (
                    post.comments.map(comment => (
                      <div
                        key={comment.id}
                        className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-neutral-200/80 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <strong className="text-neutral-900 font-bold">{comment.author}</strong>
                            <span className="text-[10px] text-neutral-400">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-neutral-700 leading-relaxed">{comment.text}</p>
                        </div>

                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
                          title="Delete Comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SETTINGS (WHATSAPP CONFIGURATION) */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xs p-5 sm:p-6 max-w-2xl space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-700">
                <MessageCircle className="w-5 h-5" />
                <h2 className="font-condensed text-lg font-bold text-neutral-900">
                  {t('whatsappSettingTitle')}
                </h2>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {t('whatsappSettingDesc')}
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              {settingsSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('settingsUpdated')}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">
                  Support WhatsApp Number (International format with country code)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={whatsappNumber}
                    onChange={e => setWhatsappNumber(e.target.value)}
                    placeholder={t('whatsappPlaceholder')}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#003399] font-mono"
                  />
                </div>
                <p className="text-[11px] text-neutral-400">
                  Example for Sri Lanka: <strong>94771234567</strong> (without leading 0 or spaces).
                </p>
              </div>

              {/* Years of Service Field */}
              <div className="space-y-1.5 pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Calendar className="w-4 h-4" />
                  <label className="block text-xs font-bold text-neutral-700">
                    {t('yearsSettingTitle')}
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="150"
                    required
                    value={yearsOfService}
                    onChange={e => setYearsOfService(e.target.value)}
                    placeholder={t('yearsPlaceholder')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#003399] font-mono"
                  />
                </div>
                <p className="text-[11px] text-neutral-400">
                  {t('yearsSettingDesc')}
                </p>
              </div>

              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-5 py-2.5 rounded-xl bg-[#003399] hover:bg-[#002266] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSavingSettings ? 'Saving...' : t('saveSettings')}</span>
              </button>
            </form>
          </div>
        )}

        </div>
      </main>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xl max-w-md w-full p-6 space-y-5 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label={t('cancel')}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="font-condensed text-lg font-bold text-neutral-900">
                {t('editModalTitle')}
              </h3>
              <p className="text-xs text-neutral-400 font-mono">ID #{editingUser.id}</p>
            </div>

            {userError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {userError}
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">{t('thName')}</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={e => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#003399]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">{t('thNic')}</label>
                <input
                  type="text"
                  required
                  value={editNic}
                  onChange={e => setEditNic(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#003399] uppercase font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">{t('thPhone')}</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#003399] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">{t('thRole')}</label>
                <select
                  value={editRole}
                  onChange={e => setEditRole(e.target.value as 'user' | 'admin')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#003399]"
                >
                  <option value="user">{t('roleUser')}</option>
                  <option value="admin">{t('roleAdmin')}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">
                  {t('newPasswordPlaceholder')}
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={e => setEditPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#003399]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="px-4 py-2 rounded-xl bg-[#003399] hover:bg-[#002266] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSavingUser ? 'Saving...' : t('saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
