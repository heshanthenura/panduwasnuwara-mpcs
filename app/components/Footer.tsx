'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-[#0b0f17] text-slate-300 font-sans border-t border-slate-800/80">
      
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">

          {/* Column 1: Organization Branding (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md">
                <Image
                  src="/logo-photo.jpg"
                  alt="Panduwasnuwara MPCS Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-snug">
                  පඬුවස්නුවර නව විවිධ සේවා සමූපකාර සමිතිය
                </h3>
                <p className="text-xs text-slate-400 font-medium tracking-wide mt-0.5">
                  Panduwasnuwara New Multi Purpose Co-Operative Society Ltd
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm pt-1">
              ග්‍රාමීය බැංකු සේවා, පාරිභෝගික භාණ්ඩ, නිෂ්පාදන නියෝජිතායතන සහ ඉන්ධන සැපයුම් එකම වහලක් යටින් සාමාජික ජනතාවට ලබාදෙන විශ්වාසනීය සමුපකාර සංස්ථාව.
            </p>

            {/* Official Registration & Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-medium text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Reg No: කුරු/186 • Est. 1976.10.06</span>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=100054449380983"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all cursor-pointer"
                aria-label="Facebook Page"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="https://wa.me/94764247716"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all cursor-pointer"
                aria-label="WhatsApp Support"
              >
                {/* Custom WhatsApp Icon */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span>ක්ෂණික සබැඳි • Quick Links</span>
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span>මුල් පිටුව • Home</span>
                </Link>
              </li>
              <li>
                <Link href="/members" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span>සාමාජික විස්තර • Member Details</span>
                </Link>
              </li>
              <li>
                <Link href="/members?list=voters" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span>ඡන්ද හිමි සාමාජිකයින් • Eligible Voters</span>
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span>සාමාජිකත්වය සඳහා අයදුම් • Membership Apply</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span>ඡායාරූප එකතුව • Photo Gallery</span>
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <span>සම්බන්ධතා • Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Address (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>ලිපිනය සහ සම්බන්ධතා • Contact Info</span>
            </h4>

            <div className="space-y-3 text-xs">
              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-200 font-medium">කුරුණෑගල පාර, හැට්ටිපොල, ශ්‍රී ලංකා</p>
                  <p className="text-slate-400 text-[11px]">Kurunegala Rd, Hettipola, Sri Lanka</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide">Hotline / Phone</p>
                  <div className="flex items-center gap-2 text-slate-200 font-bold">
                    <a href="tel:0372291011" className="hover:text-emerald-400 transition-colors">037 229 1011</a>
                    <span className="text-slate-600">/</span>
                    <a href="tel:0764247716" className="hover:text-emerald-400 transition-colors">076 424 7716</a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide">Email</p>
                  <a href="mailto:panduwasnuwara@mpcs.lk" className="text-slate-200 hover:text-emerald-400 transition-colors font-medium">
                    panduwasnuwara@mpcs.lk
                  </a>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-2.5 pt-1 border-t border-slate-800/80">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide">සේවා කාලය • Opening Hours</p>
                  <p className="text-slate-300 text-[11px]">
                    <span className="font-semibold text-white">සඳුදා – සිකුරාදා:</span> පෙ.ව. 8.30 – ප.ව. 5.30 | <span className="font-semibold text-white">සෙනසුරාදා:</span> පෙ.ව. 8.30 – ප.ව. 1.30
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Mon – Fri : 8.30 AM – 5.30 PM | Saturday : 8.30 AM – 1.30 PM
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright */}
      <div className="w-full bg-[#070a0f] border-t border-slate-800/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-slate-400">
            © 2026 Panduwasnuwara New MPCS Ltd — All Rights Reserved / සියලු හිමිකම් ඇවිරිණි.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
