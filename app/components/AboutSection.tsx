'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Users, UserCheck, Building2, Award } from 'lucide-react';

interface MetricValues {
  membersCount: number;
  votersCount: number;
  businessesCount: number;
  yearsOfService: number;
}

/**
 * Animated number display that smoothly interpolates to new target values
 */
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    if (startValue === endValue) return;

    const duration = 800; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValueRef.current = endValue;
      }
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [value]);

  return (
    <span className="font-mono tracking-tight font-extrabold text-2xl sm:text-3xl text-neutral-900">
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function AboutSection() {
  const t = useTranslations('About');
  const tStats = useTranslations('LiveMetrics');

  const [metrics, setMetrics] = useState<MetricValues>({
    membersCount: 0,
    votersCount: 0,
    businessesCount: 10,
    yearsOfService: 50
  });

  const fetchLiveMetrics = async () => {
    try {
      const res = await fetch('/api/stats', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.stats) {
        setMetrics({
          membersCount: data.stats.membersCount ?? 0,
          votersCount: data.stats.votersCount ?? 0,
          businessesCount: data.stats.businessesCount ?? 10,
          yearsOfService: data.stats.yearsOfService ?? 50
        });
      }
    } catch {
      // Keep existing values on network issue
    }
  };

  useEffect(() => {
    fetchLiveMetrics();
    // 5-second interval polling for real-time live synchronization
    const timer = setInterval(() => {
      fetchLiveMetrics();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const metricBoxes = [
    {
      id: 'members',
      title: tStats('membersTitle'),
      value: metrics.membersCount,
      suffix: '',
      icon: Users,
      iconColor: 'text-[#003399]',
      iconBg: 'bg-blue-50/80 border-blue-200/60'
    },
    {
      id: 'voters',
      title: tStats('votersTitle'),
      value: metrics.votersCount,
      suffix: '',
      icon: UserCheck,
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-50/80 border-emerald-200/60'
    },
    {
      id: 'businesses',
      title: tStats('businessesTitle'),
      value: metrics.businessesCount,
      suffix: '',
      icon: Building2,
      iconColor: 'text-amber-700',
      iconBg: 'bg-amber-50/80 border-amber-200/60'
    },
    {
      id: 'years',
      title: tStats('yearsTitle'),
      value: metrics.yearsOfService,
      suffix: '+',
      icon: Award,
      iconColor: 'text-indigo-700',
      iconBg: 'bg-indigo-50/80 border-indigo-200/60'
    }
  ];

  return (
    <section 
      id="about-us" 
      className="w-full bg-[#FAFAFA] py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans antialiased subpixel-antialiased scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: About Us Narrative & Core Principles */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
            <div>
              {/* Eyebrow: Replaced with 'About Us' / 'අප ගැන' */}
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

          {/* Right Column: Strategic Vision, Core Mission & Live Metrics in one unified section */}
          <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
            
            {/* Top Area: Vision & Mission Cards */}
            <div className="flex flex-col gap-4">
              {/* Card 1: Our Vision */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-3.5 bg-blue-600 rounded-full shrink-0" />
                  <h3 className="font-condensed font-bold text-lg sm:text-xl text-neutral-900">
                    {t('visionTitle')}
                  </h3>
                </div>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed font-normal">
                  {t('visionDesc')}
                </p>
              </div>

              {/* Card 2: Our Mission */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-3.5 bg-emerald-600 rounded-full shrink-0" />
                  <h3 className="font-condensed font-bold text-lg sm:text-xl text-neutral-900">
                    {t('missionTitle')}
                  </h3>
                </div>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed font-normal">
                  {t('missionDesc')}
                </p>
              </div>
            </div>

            {/* Bottom Area: Dynamic 5-Second Live Statistics Counter Boxes (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-3.5 pt-1">
              {metricBoxes.map(box => {
                const Icon = box.icon;
                return (
                  <div
                    key={box.id}
                    className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-neutral-700 leading-tight">
                        {box.title}
                      </span>
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${box.iconBg} ${box.iconColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div>
                      <AnimatedCounter value={box.value} suffix={box.suffix} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
