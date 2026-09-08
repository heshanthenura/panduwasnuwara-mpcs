'use client';

import React from 'react';
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
  const chairman = members.find(m => m.roleType === 'chairman');
  const viceChairman = members.find(m => m.roleType === 'vice_chairman');
  const directors = members.filter(m => m.roleType === 'director');
  const officers = members.filter(m => m.roleType === 'officer');

  const renderCard = (member: BoardMember) => (
    <div 
      key={member.id}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow pt-5 pb-4 px-4 flex flex-col justify-between overflow-hidden text-center"
    >
      <div className="flex flex-col items-center text-center w-full">
        {/* Compact Avatar Circle (64px x 64px) */}
        <div className="w-16 h-16 rounded-full ring-4 ring-slate-100 bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shrink-0 shadow-inner">
          <User className="w-8 h-8 text-slate-400" />
        </div>

        {/* Role Badge */}
        <div className="mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60 max-w-[95%] mx-auto whitespace-normal">
          {member.positionSi} • {member.positionEn}
        </div>

        {/* Sinhala & English Name Stack */}
        <h4 className="mt-1.5 text-base font-semibold text-slate-900 leading-tight">
          {member.nameSi}
        </h4>
        <p className="mt-0.5 text-xs font-medium text-slate-500">
          {member.nameEn}
        </p>

        {/* Qualification Tag */}
        <div className="mt-1.5 text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 flex items-center justify-center gap-1 w-full">
          <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{member.qualification}</span>
        </div>
      </div>

      {/* Slim Contact Footer */}
      <div className="mt-3 py-2 px-3 border-t border-slate-100 bg-slate-50/50 -mx-4 -mb-4 rounded-b-xl flex items-center justify-center gap-3 text-[11px] text-slate-600">
        <a
          href={`tel:${member.phone.replace(/\s+/g, '')}`}
          className="flex items-center gap-1 hover:text-slate-900 transition-colors"
          title={`Call ${member.nameEn}`}
        >
          <Phone className="w-3 h-3 text-slate-500" />
          <span>{member.phone}</span>
        </a>

        <span className="text-slate-300">•</span>

        <a
          href={`mailto:${member.email}`}
          className="flex items-center gap-1 hover:text-slate-900 transition-colors"
          title={`Email ${member.nameEn}`}
        >
          <Mail className="w-3 h-3 text-slate-500" />
          <span>{member.email}</span>
        </a>
      </div>
    </div>
  );

  return (
    <section 
      id="director-board" 
      className="w-full bg-[#F8FAFC] pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/90 font-sans scroll-mt-28"
    >
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">

        {/* Centered Main Page Header with Navbar Clearance */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-1.5 scroll-mt-28">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 flex items-center justify-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>GOVERNANCE & LEADERSHIP • පාලන අධිකාරිය</span>
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Board of Directors <span className="text-slate-400 font-normal">|</span> අධ්‍යක්ෂ මණ්ඩලය
          </h2>

          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            පඬුවස්නුවර නව විවිධ සේවා සමුපකාර සමිතියේ උපායමාර්ගික පාලනය සහ පරිපාලන නායකත්වය
          </p>
        </div>

        {/* 1. EXECUTIVE LEADERSHIP */}
        <div className="space-y-4 max-w-5xl mx-auto w-full px-4 scroll-mt-28">
          <div className="flex items-center justify-between w-full pb-2 border-b border-slate-200/80">
            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-slate-800 uppercase">
              EXECUTIVE LEADERSHIP • විධායක නායකත්වය
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/50">
              2 Members
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center max-w-3xl mx-auto w-full">
            {chairman && renderCard(chairman)}
            {viceChairman && renderCard(viceChairman)}
          </div>
        </div>

        {/* 2. BOARD DIRECTORS */}
        <div className="space-y-4 max-w-5xl mx-auto w-full px-4 scroll-mt-28">
          <div className="flex items-center justify-between w-full pb-2 border-b border-slate-200/80">
            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-slate-800 uppercase">
              BOARD DIRECTORS • අධ්‍යක්ෂ මණ්ඩල සාමාජිකයින්
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/50">
              {directors.length} Board Members
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto w-full">
            {directors.map(renderCard)}
          </div>
        </div>

        {/* 3. ADMINISTRATIVE OFFICERS */}
        <div className="space-y-4 max-w-5xl mx-auto w-full px-4 scroll-mt-28">
          <div className="flex items-center justify-between w-full pb-2 border-b border-slate-200/80">
            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-slate-800 uppercase">
              ADMINISTRATIVE OFFICERS • පාලන හා විධායක නිලධාරීන්
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/50">
              2 Officers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center max-w-3xl mx-auto w-full">
            {officers.map(renderCard)}
          </div>
        </div>

      </div>
    </section>
  );
}
