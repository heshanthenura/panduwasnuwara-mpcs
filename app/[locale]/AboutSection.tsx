'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { 
  Building2, 
  Eye, 
  Target, 
  Award, 
  Calendar, 
  FileText,
  HeartHandshake,
  ShieldCheck,
  Users,
  Coins
} from 'lucide-react';

export default function AboutSection() {
  const t = useTranslations('About');

  return (
    <section 
      id="about-us" 
      className="w-full bg-slate-50 pt-10 pb-10 sm:pt-12 sm:pb-12 px-4 sm:px-6 lg:px-8 font-sans antialiased subpixel-antialiased scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12">

        {/* Section Header with Co-op Rainbow Accent */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('eyebrow')}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight pt-1">
            {t('heading')}
          </h2>

          {/* Sri Lanka Co-op 7-Color Rainbow Micro-Ribbon under Title */}
          <div className="h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-[#DC2626] via-[#EA580C] via-[#EAB308] via-[#16A34A] via-[#0284C7] via-[#1D4ED8] to-[#9333EA] my-3" />
        </div>

        {/* 1. Framed 3-Stat Trust Bar with Co-op Accent Colors */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-around divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 text-center gap-3 sm:gap-0">
          
          <div className="flex items-center justify-center gap-2.5 pt-2 sm:pt-0 sm:px-5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-slate-900">{t('yearsLabel')}</span>
              <span className="block text-[11px] text-slate-500 font-medium">Trusted Community Service</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-3 sm:pt-0 sm:px-5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#003399] shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-slate-900">{t('estLabel')}</span>
              <span className="block text-[11px] text-slate-500 font-medium">Decades of Legacy</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-3 sm:pt-0 sm:px-5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-slate-900">{t('regLabel')}</span>
              <span className="block text-[11px] text-slate-500 font-medium">Department of Co-operatives</span>
            </div>
          </div>

        </div>

        {/* 2. Editorial Community Vision Intro */}
        <div className="max-w-3xl mx-auto text-center space-y-3 px-2">
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
            {t('introPrimary')}
          </p>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {t('introSecondary')}
          </p>
        </div>

        {/* 3. Co-op Core Guiding Pillars */}
        <div className="max-w-4xl mx-auto bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Pillar 1: Autonomy */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#003399] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-snug">
                {t('principleAutonomy')}
              </span>
            </div>

            {/* Pillar 2: Democracy */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-amber-200 hover:bg-amber-50/20 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-snug">
                {t('principleDemocracy')}
              </span>
            </div>

            {/* Pillar 3: Economic Participation */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-snug">
                {t('principleEconomy')}
              </span>
            </div>

            {/* Pillar 4: Community Concern */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#003399] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 leading-snug">
                {t('principleCommunity')}
              </span>
            </div>

          </div>
        </div>

        {/* 4. Refined Side-by-Side Vision & Mission Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-2">
          
          {/* Card 1: Vision (Royal Navy Theme) */}
          <div className="p-7 bg-white rounded-2xl border border-slate-200/80 border-t-4 border-t-[#003399] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-4 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003399] to-blue-700 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#003399] uppercase tracking-wider block">Strategic Focus</span>
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                    {t('visionTitle')}
                  </h3>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                  {t('visionPrimary')}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {t('visionSecondary')}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Mission (Emerald Green & Gold Theme) */}
          <div className="p-7 bg-white rounded-2xl border border-slate-200/80 border-t-4 border-t-emerald-600 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-4 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Core Purpose</span>
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                    {t('missionTitle')}
                  </h3>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                  {t('missionPrimary')}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {t('missionSecondary')}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
