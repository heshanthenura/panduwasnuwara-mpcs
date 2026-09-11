'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Lock, ArrowLeft, ShieldCheck, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (data.isAdmin) {
        setIsAdmin(true);
      }
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username, password })
      });

      const data = await res.json();
      if (data.success) {
        setIsAdmin(true);
        router.push(`/${locale}#gallery`);
      } else {
        setErrorMsg(t('errorInvalid'));
      }
    } catch {
      setErrorMsg(t('errorInvalid'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    });
    setIsAdmin(false);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#FAFAFA] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-xs p-6 sm:p-8 space-y-6">

        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('backToGallery')}</span>
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-neutral-200 flex items-center justify-center mx-auto text-[#003399]">
            {isAdmin ? <ShieldCheck className="w-6 h-6 text-emerald-600" /> : <Lock className="w-6 h-6" />}
          </div>
          <h1 className="font-condensed text-2xl font-bold text-neutral-900">
            {isAdmin ? t('loggedInAs') : t('loginTitle')}
          </h1>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
            {t('loginSubtitle')}
          </p>
        </div>

        {isAdmin ? (
          <div className="space-y-4 pt-2">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('loggedInAs')} (admin)</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                href={`/${locale}#gallery`}
                className="w-full py-2.5 px-4 rounded-xl bg-[#003399] hover:bg-[#002266] text-white text-xs font-semibold text-center transition-colors shadow-xs"
              >
                {t('backToGallery')}
              </Link>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 hover:bg-slate-50 text-neutral-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700">
                {t('username')}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#003399]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700">
                {t('password')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#003399]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#003399] hover:bg-[#002266] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-xs mt-2"
            >
              {isLoading ? '...' : t('signIn')}
            </button>

            <div className="text-center pt-2 border-t border-neutral-100 text-xs text-neutral-500">
              <span>{t('noAccount')} </span>
              <Link
                href={`/${locale}/register`}
                className="text-[#003399] font-bold hover:underline"
              >
                {t('registerHere')}
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
