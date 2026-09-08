'use client';

import React from 'react';
import { 
  Building2, 
  Eye, 
  Target, 
  Award, 
  Calendar, 
  FileText 
} from 'lucide-react';

export default function AboutSection() {
  return (
    <section 
      id="about-us" 
      className="w-full bg-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-t border-slate-200/90 font-sans scroll-mt-24"
    >
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Compact Editorial Header */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 flex items-center justify-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>ABOUT OUR CO-OPERATIVE • අපගේ සමුපකාරය පිළිබඳව</span>
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            අප ගැන <span className="text-slate-400 font-normal">|</span> About Us
          </h2>
        </div>

        {/* 1. Compact Trust Metrics Bar */}
        <div className="border border-slate-200/80 bg-slate-50/70 py-3 px-6 max-w-4xl mx-auto flex flex-wrap items-center justify-around text-center rounded-xl text-xs font-medium text-slate-700 shadow-sm gap-4">
          <div className="flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-slate-500 shrink-0" />
            <span>25+ Years of Service <span className="text-slate-400">•</span> සේවා කාලය</span>
          </div>

          <div className="hidden sm:block text-slate-300">|</div>

          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Est. 1976.10.06 <span className="text-slate-400">•</span> ආරම්භක දිනය</span>
          </div>

          <div className="hidden sm:block text-slate-300">|</div>

          <div className="flex items-center justify-center gap-2">
            <FileText className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Reg: කුරු/186 <span className="text-slate-400">•</span> ලියාපදිංචි අංකය</span>
          </div>
        </div>

        {/* 2. Service Vision Editorial Intro */}
        <div className="max-w-3xl mx-auto text-center space-y-2">
          <p className="text-slate-800 font-medium text-base sm:text-lg leading-relaxed">
            අපගේ සමූපකාර සමිතිය ගමේ ජනතාවට ග්‍රාමීය බැංකු සේවා, පාරිභෝගික භාණ්ඩ, නිෂ්පාදන නියෝජිතායතන, ඉන්ධන පිරවුම්හල සහ අවමංගල්‍ය සේවා ඇතුළු බහුමුඛී සේවාවන් සපයයි. සාමාජිකයින්ගේ ඉතුරුම්, ව්‍යාපෘති සහ අනාගතය රැක ගැනීම අපගේ අරමුණයි.
          </p>
          <p className="text-xs sm:text-sm text-slate-500 leading-normal">
            Our co-operative society brings rural banking, consumer goods, leading product agencies and a fuel station together under one roof. Protecting members’ savings, supporting local enterprise and building a stronger community is our mission.
          </p>
        </div>

        {/* 3. Side-by-Side 2-Column Vision & Mission Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          
          {/* Card 1: Vision */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                <Eye className="w-4 h-4 text-slate-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Our Vision • අපගේ දැක්ම
              </h3>
            </div>

            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-900 leading-snug">
                බල ප්‍රදේශය තුළ උසස් මට්ටමේ ව්‍යාපාරික සේවාවන් සපයන ප්‍රමුඛ වෙළඳ ආයතනය බවට පත්වීම.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                To become the leading trading institution providing high-standard business services within our area.
              </p>
            </div>
          </div>

          {/* Card 2: Mission */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                <Target className="w-4 h-4 text-slate-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Our Mission • අපගේ මෙහෙවර
              </h3>
            </div>

            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                සමිති බල ප්‍රදේශය තුළ ජීවත් වන්නා වූ සාමාජිකයාගේ ආර්ථික, සාමාජික සහ සංස්කෘතික ප්‍රජා සේවයන් සඳහා අප කැප වන සේවක මණ්ඩලයක් මගින් ඔවුන්ගේ ආර්ථික වර්ධනය කිරීමේ සමාජ මෙහෙවර ඉටු කිරීම තුළින් ගුණාත්මක, ඵලදායී හා කාර්යක්ෂම ව්‍යාපාරයක් බවට සමූපකාරය නංවාලීම අපගේ මෙහෙවර වන්නේය.
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                Our mission is to develop this co-operative into a quality-driven, productive and efficient business by fulfilling the social commitment of enhancing member economic growth.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
