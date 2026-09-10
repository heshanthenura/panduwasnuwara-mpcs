'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export default function AboutSection() {
  const t = useTranslations('About');

  return (
    <section 
      id="about-us" 
      className="w-full bg-[#FAFAFA] py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans antialiased subpixel-antialiased scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column Card: Main Narrative & Core Principles */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
            <div>
              {/* Section Header / Eyebrow */}
              <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                <span className="w-1.5 h-4 sm:h-5 bg-[#003399] rounded-full shrink-0" />
                <span className="text-base sm:text-lg font-bold text-[#003399] tracking-normal">
                  {t('eyebrow')}
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="font-condensed font-bold sm:font-extrabold text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] text-neutral-900 leading-snug sm:leading-[1.25] tracking-tight mb-5 sm:mb-6">
                {t('heading')}
              </h2>

              {/* Narrative Paragraph 1 */}
              <p className="text-neutral-600 text-sm sm:text-[15px] lg:text-base leading-relaxed mb-4 sm:mb-5 font-normal">
                {t('paragraph1')}
              </p>

              {/* Narrative Paragraph 2 */}
              <p className="text-neutral-600 text-sm sm:text-[15px] lg:text-base leading-relaxed mb-6 sm:mb-8 font-normal">
                {t('paragraph2')}
              </p>
            </div>

            {/* Amber Left-Border Highlight: Co-op Guiding Principles */}
            <div className="border-l-2 sm:border-l-[3px] border-amber-500 pl-3.5 sm:pl-4 py-0.5 mt-2">
              <p className="text-neutral-600 text-xs sm:text-sm font-medium leading-relaxed">
                {t('principles')}
              </p>
            </div>
          </div>

          {/* Right Column Cards: Strategic Vision & Core Mission */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Card 1: Our Vision */}
            <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col justify-center">
              <h3 className="font-condensed font-bold text-xl sm:text-2xl text-neutral-900 mb-2.5">
                {t('visionTitle')}
              </h3>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-normal">
                {t('visionDesc')}
              </p>
            </div>

            {/* Card 2: Our Mission */}
            <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col justify-center">
              <h3 className="font-condensed font-bold text-xl sm:text-2xl text-neutral-900 mb-2.5">
                {t('missionTitle')}
              </h3>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-normal">
                {t('missionDesc')}
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
