'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { User, Phone, Mail, GraduationCap, Building2 } from 'lucide-react';

export interface BoardMember {
  id: string;
  nameSi: string;
  nameEn: string;
  positionSi: string;
  positionEn: string;
  qualification: string;
  phone: string;
  email: string;
  address?: string;
  roleType: 'chairman' | 'vice_chairman' | 'director' | 'officer';
}

export const boardMembersData: BoardMember[] = [
  {
    id: '1',
    nameSi: 'H.H.D එමල් ප්‍රියන්ත හේරත්',
    nameEn: 'Emal Priyantha Herath',
    positionSi: 'සභාපති',
    positionEn: 'Chairman',
    qualification: 'B.Com. (Hons) — University of Kelaniya',
    phone: '071 229 1011',
    email: 'member1@mpcs.lk',
    address: 'කුරුණෑගල පාර, හැට්ටිපොල, ශ්‍රී ලංකා',
    roleType: 'chairman',
  },
  {
    id: '2',
    nameSi: 'මලිත් ප්‍රියංකර එදිරිසිංහ',
    nameEn: 'Malith Priyankara Edirisinghe',
    positionSi: 'උප සභාපති',
    positionEn: 'Vice Chairman',
    qualification: 'B.Sc. Business Administration — USJP',
    phone: '072 229 1012',
    email: 'member2@mpcs.lk',
    address: 'කුරුණෑගල පාර, හැට්ටිපොල, ශ්‍රී ලංකා',
    roleType: 'vice_chairman',
  },
  {
    id: '3',
    nameSi: 'U.P පාලිත ප්‍රියදර්ශන පෙරේරා',
    nameEn: 'Palitha Priyadarshana Perera',
    positionSi: 'අධ්‍යක්ෂක',
    positionEn: 'Director',
    qualification: 'Dip. in Co-operative Management',
    phone: '073 229 1013',
    email: 'member3@mpcs.lk',
    roleType: 'director',
  },
  {
    id: '4',
    nameSi: 'U.H ලක්මාල් සංජීව ප්‍රේමතිලක්',
    nameEn: 'Lakmal Sanjeewa Premathilake',
    positionSi: 'අධ්‍යක්ෂක',
    positionEn: 'Director',
    qualification: 'B.A. (Hons) Economics — University of Peradeniya',
    phone: '074 229 1014',
    email: 'member4@mpcs.lk',
    roleType: 'director',
  },
  {
    id: '5',
    nameSi: 'S.H.M බණ්ඩාරසේකර',
    nameEn: 'S.H.M. Bandarasekera',
    positionSi: 'අධ්‍යක්ෂක',
    positionEn: 'Director',
    qualification: 'MBA — PIM, USJP',
    phone: '075 229 1015',
    email: 'member5@mpcs.lk',
    roleType: 'director',
  },
  {
    id: '6',
    nameSi: 'S. රංජිත් ධර්මසිරි',
    nameEn: 'S. Ranjith Dharmasiri',
    positionSi: 'අධ්‍යක්ෂක',
    positionEn: 'Director',
    qualification: 'Higher Dip. in Accountancy (AAT)',
    phone: '076 229 1016',
    email: 'member6@mpcs.lk',
    roleType: 'director',
  },
  {
    id: '7',
    nameSi: 'R.M චමින්ද සඳරුවන් රත්නායක',
    nameEn: 'R.M. Chaminda Sandaruwan Rathnayake',
    positionSi: 'අධ්‍යක්ෂක',
    positionEn: 'Director',
    qualification: 'B.Sc. Agriculture — Wayamba University',
    phone: '077 229 1017',
    email: 'member7@mpcs.lk',
    roleType: 'director',
  },
  {
    id: '8',
    nameSi: 'M.P.N.I ගුණතිලක්',
    nameEn: 'M.P.N.I. Gunathilake',
    positionSi: 'සමූපකාර සංවර්ධන ප්‍රාදේශීය නිලධාරී',
    positionEn: 'Regional Co-op Officer',
    qualification: 'Dip. in Public Administration',
    phone: '078 229 1018',
    email: 'member8@mpcs.lk',
    roleType: 'officer',
  },
  {
    id: '9',
    nameSi: 'D.K.P.P.D දික්වැල්ල',
    nameEn: 'D.K.P.P.D. Dikwella',
    positionSi: 'සාමාන්‍යාධිකාරී',
    positionEn: 'General Manager',
    qualification: 'M.Sc. Management — University of Colombo',
    phone: '079 229 1019',
    email: 'member9@mpcs.lk',
    roleType: 'officer',
  },
];

interface BoardSectionProps {
  members?: BoardMember[];
}

export default function BoardSection({ members = boardMembersData }: BoardSectionProps) {
  const t = useTranslations('Board');
  const locale = useLocale();
  const isSi = locale === 'si';

  const chairman = members.find(m => m.roleType === 'chairman');
  const viceChairman = members.find(m => m.roleType === 'vice_chairman');
  const directors = members.filter(m => m.roleType === 'director');
  const officers = members.filter(m => m.roleType === 'officer');

  const renderCard = (member: BoardMember) => {
    const isExec = member.roleType === 'chairman' || member.roleType === 'vice_chairman';
    const isDirector = member.roleType === 'director';
    const isOfficer = member.roleType === 'officer';

    // Theme tokens based on Co-op logo hierarchy
    const theme = isExec
      ? {
          topBorder: 'border-t-4 border-t-[#003399]',
          badge: 'bg-blue-50 text-[#003399] border-blue-200/80',
          avatarRing: 'ring-2 ring-amber-400/50 bg-gradient-to-br from-amber-50 via-white to-blue-50',
          avatarIcon: 'text-[#003399]',
          glow: 'group-hover:border-amber-400/40',
        }
      : isDirector
      ? {
          topBorder: 'border-t-4 border-t-emerald-600',
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          avatarRing: 'ring-2 ring-emerald-300/50 bg-gradient-to-br from-emerald-50 via-white to-slate-50',
          avatarIcon: 'text-emerald-700',
          glow: 'group-hover:border-emerald-300',
        }
      : {
          topBorder: 'border-t-4 border-t-sky-600',
          badge: 'bg-sky-50 text-sky-800 border-sky-200/80',
          avatarRing: 'ring-2 ring-sky-300/50 bg-gradient-to-br from-sky-50 via-white to-slate-50',
          avatarIcon: 'text-sky-700',
          glow: 'group-hover:border-sky-300',
        };

    return (
      <div 
        key={member.id}
        className={`group bg-white rounded-2xl border border-slate-200/80 ${theme.topBorder} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 pt-6 pb-4 px-5 flex flex-col justify-between overflow-hidden text-center relative`}
      >
        <div className="flex flex-col items-center text-center w-full">
          {/* Avatar Icon with Tier Ring & Warm Gradient */}
          <div className={`w-16 h-16 rounded-2xl ${theme.avatarRing} flex items-center justify-center mx-auto shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105`}>
            <User className={`w-8 h-8 ${theme.avatarIcon}`} />
          </div>

          {/* Role Badge — locale-aware */}
          <div className={`mt-3 text-[11px] font-bold px-3 py-0.5 rounded-full border max-w-[95%] mx-auto tracking-wide ${theme.badge}`}>
            {isSi ? member.positionSi : member.positionEn}
          </div>

          {/* Name — locale-aware */}
          <h4 className="mt-2 text-base font-bold text-slate-900 leading-snug group-hover:text-[#003399] transition-colors">
            {isSi ? member.nameSi : member.nameEn}
          </h4>

          {/* Qualification Tag */}
          <div className="mt-2 text-[11px] text-slate-600 bg-slate-50/80 px-2.5 py-1 rounded-lg border border-slate-100 flex items-center justify-center gap-1.5 w-full">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium">{member.qualification}</span>
          </div>
        </div>

        {/* Contact Action Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-500">
          <a
            href={`tel:${member.phone.replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all font-medium"
            title={t('callTitle', { name: member.nameEn })}
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{member.phone}</span>
          </a>

          <span className="w-px h-3 bg-slate-200" />

          <a
            href={`mailto:${member.email}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all font-medium"
            title={t('emailTitle', { name: member.nameEn })}
          >
            <Mail className="w-3.5 h-3.5 text-[#003399]" />
            <span>{member.email}</span>
          </a>
        </div>
      </div>
    );
  };

  return (
    <section 
      id="director-board" 
      className="w-full bg-slate-50 pt-12 pb-10 sm:pt-16 sm:pb-12 px-4 sm:px-6 lg:px-8 font-sans scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">

        {/* Section Header with Co-op Rainbow Accent */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-xs font-bold uppercase tracking-wider text-[#003399]">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('eyebrow')}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight pt-1">
            {t('heading')}
          </h2>

          {/* Sri Lanka Co-op 7-Color Rainbow Micro-Ribbon under Title */}
          <div className="h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-[#DC2626] via-[#EA580C] via-[#EAB308] via-[#16A34A] via-[#0284C7] via-[#1D4ED8] to-[#9333EA] my-3" />

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed pt-1">
            {t('subtext')}
          </p>
        </div>

        {/* 1. EXECUTIVE LEADERSHIP */}
        <div className="space-y-4 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between w-full pb-2.5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#003399]" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider text-slate-900 uppercase">
                {t('execTier')}
              </h3>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-[#003399] border border-blue-200/80 px-3 py-0.5 rounded-full">
              {t('execCount', { count: 2 })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center max-w-3xl mx-auto w-full">
            {chairman && renderCard(chairman)}
            {viceChairman && renderCard(viceChairman)}
          </div>
        </div>

        {/* 2. BOARD DIRECTORS */}
        <div className="space-y-4 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between w-full pb-2.5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider text-slate-900 uppercase">
                {t('directorTier')}
              </h3>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-0.5 rounded-full">
              {t('directorCount', { count: directors.length })}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto w-full">
            {directors.map(renderCard)}
          </div>
        </div>

        {/* 3. ADMINISTRATIVE OFFICERS */}
        <div className="space-y-4 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between w-full pb-2.5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider text-slate-900 uppercase">
                {t('officerTier')}
              </h3>
            </div>
            <span className="text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200/80 px-3 py-0.5 rounded-full">
              {t('officerCount', { count: officers.length })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-center max-w-3xl mx-auto w-full">
            {officers.map(renderCard)}
          </div>
        </div>

      </div>
    </section>
  );
}
