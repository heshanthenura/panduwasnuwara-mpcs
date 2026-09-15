'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { UserPlus, ArrowLeft, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [nic, setNic] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg(t('passwordsDoNotMatch'));
      return;
    }

    if (nic.trim().length < 5) {
      setErrorMsg('Please provide a valid NIC number.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          fullName,
          nic,
          phone,
          password
        })
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/${locale}/login?registered=true`);
      } else {
        setErrorMsg(data.error || t('userExists'));
      }
    } catch {
      setErrorMsg(t('errorInvalid'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#FAFAFA] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-20 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-xs p-6 sm:p-8 space-y-6">

        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('backToHome')}</span>
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-neutral-200 flex items-center justify-center mx-auto text-[#003399]">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="font-condensed text-2xl font-bold text-neutral-900">
            {t('registerTitle')}
          </h1>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
            {t('registerSubtitle')}
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 pt-2">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700">
              {t('fullName')} *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('fullNamePlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#003399] focus:bg-white transition-colors"
            />
          </div>

          {/* NIC Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700">
              {t('nic')} *
            </label>
            <input
              type="text"
              required
              value={nic}
              onChange={(e) => setNic(e.target.value.toUpperCase())}
              placeholder={t('nicPlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#003399] focus:bg-white transition-colors font-mono uppercase"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700">
              {t('phone')} *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('phonePlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#003399] focus:bg-white transition-colors font-mono"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700">
              {t('password')} *
            </label>
            <input
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#003399] focus:bg-white transition-colors"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700">
              {t('confirmPassword')} *
            </label>
            <input
              type="password"
              required
              minLength={4}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-[#003399] focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#003399] hover:bg-[#002266] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-xs mt-2"
          >
            {isLoading ? '...' : t('signUp')}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-100 text-xs text-neutral-500">
          <span>{t('hasAccount')} </span>
          <Link
            href={`/${locale}/login`}
            className="text-[#003399] font-bold hover:underline"
          >
            {t('signInHere')}
          </Link>
        </div>

      </div>
    </div>
  );
}
