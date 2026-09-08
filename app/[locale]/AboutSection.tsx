'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { 
  Building2, 
  Eye, 
  Target, 
  Award, 
  Calendar, 
  FileText 
} from 'lucide-react';

export default function AboutSection() {
  const t = useTranslations('About');

  return (
    <section 
      id="about-us" 
      className="w-full bg-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 font-sans antialiased subpixel-antialiased scroll-mt-20"
    >
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Compact Editorial Header */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 flex items-center justify-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('eyebrow')}</span>
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t('heading')} <span className="text-slate-400 font-normal">|</span> <span className="text-slate-500 font-normal">{t('headingSub')}</span>
          </h2>
        </div>

        {/* 1. Framed 3-Stat Trust Bar */}
        <div className="max-w-3xl mx-auto bg-slate-50/80 border border-slate-200/80 rounded-2xl py-3 px-6 shadow-xs flex flex-col sm:flex-row items-center justify-around divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 text-center gap-2 sm:gap-0">
          
          <div className="flex items-center justify-center gap-2 pt-2 sm:pt-0 sm:px-4 text-xs font-semibold text-slate-800">
            <Award className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong className="text-emerald-700">{t('yearsLabel')}</strong>
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 sm:pt-0 sm:px-4 text-xs font-semibold text-slate-800">
            <Calendar className="w-4 h-4 text-[#003399] shrink-0" />
            <span>{t('estLabel')}</span>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 sm:pt-0 sm:px-4 text-xs font-semibold text-slate-800">
            <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{t('regLabel')}</span>
          </div>

        </div>

        {/* 2. Constrained Centered Service Vision Intro */}
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            {t('introPrimary')}
          </p>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2">
            {t('introSecondary')}
          </p>
        </div>

        {/* 3. Refined Side-by-Side Vision & Mission Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          
          {/* Card 1: Vision */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-start">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#003399] flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {t('visionTitle')}
              </h3>
            </div>

            <div className="pt-1">
              <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
                {t('visionPrimary')}
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {t('visionSecondary')}
              </p>
            </div>
          </div>

          {/* Card 2: Mission */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-start">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {t('missionTitle')}
              </h3>
            </div>

            <div className="pt-1">
              <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
                {t('missionPrimary')}
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {t('missionSecondary')}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
