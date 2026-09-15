'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import {
  Megaphone,
  Calendar,
  Tag,
  ArrowRight,
  X,
  Phone,
  Share2,
  Check,
  Pin,
  Briefcase,
  FileText,
  AlertCircle
} from 'lucide-react';
import { NewsAnnouncement } from '@/lib/types';

export default function NewsSection() {
  const t = useTranslations('News');
  const locale = useLocale();

  const [newsList, setNewsList] = useState<NewsAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNotice, setSelectedNotice] = useState<NewsAnnouncement | null>(null);
  const [copiedNoticeId, setCopiedNoticeId] = useState<number | null>(null);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        if (data.success && Array.isArray(data.news)) {
          setNewsList(data.news);
        }
      } catch (err) {
        console.error('Failed to load news:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadNews();
  }, []);

  // Filter items by category
  const filteredNews = useMemo(() => {
    if (selectedCategory === 'all') return newsList;
    return newsList.filter(n => n.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [newsList, selectedCategory]);

  // Pinned featured announcement
  const pinnedNotice = useMemo(() => {
    return filteredNews.find(n => n.is_pinned) || (selectedCategory === 'all' ? newsList.find(n => n.is_pinned) : null);
  }, [filteredNews, selectedCategory, newsList]);

  // Remaining grid items
  const gridNotices = useMemo(() => {
    if (pinnedNotice) {
      return filteredNews.filter(n => n.id !== pinnedNotice.id);
    }
    return filteredNews;
  }, [filteredNews, pinnedNotice]);

  const handleShare = (notice: NewsAnnouncement, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = typeof window !== 'undefined' ? `${window.location.origin}/${locale}#news` : '';
    const shareTitle = locale === 'si' ? (notice.title_si || notice.title_en) : (notice.title_en || notice.title_si);

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareTitle,
        url: url
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedNoticeId(notice.id);
      setTimeout(() => setCopiedNoticeId(null), 2500);
    }
  };

  const getCategoryBadge = (category: string, badgeSi?: string | null, badgeEn?: string | null) => {
    const customText = locale === 'si' ? badgeSi : badgeEn;
    if (customText) return customText;

    switch (category?.toLowerCase()) {
      case 'vacancy':
        return locale === 'si' ? 'රැකියා ඇබෑර්තු' : 'Job Vacancy';
      case 'notice':
        return locale === 'si' ? 'විශේෂ නිවේදනය' : 'Special Notice';
      case 'tender':
        return locale === 'si' ? 'ටෙන්ඩර් දැන්වීම' : 'Tender Notice';
      default:
        return locale === 'si' ? 'පොදු පුවත්' : 'General News';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'vacancy':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'notice':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'tender':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <section 
      id="news" 
      className="w-full bg-[#FAFAFA] pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 font-sans scroll-mt-20 border-t border-neutral-200/80"
    >
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
        
        {/* Section Header with Co-op Accent */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Megaphone className="w-3.5 h-3.5 text-slate-700" />
            <span>{t('eyebrow')}</span>
          </div>

          <h2 className="font-condensed text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight pt-1">
            {t('heading')}
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed pt-1">
            {t('subtext')}
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
          {[
            { id: 'all', label: t('filterAll') },
            { id: 'vacancy', label: t('filterVacancies') },
            { id: 'notice', label: t('filterNotices') },
            { id: 'tender', label: t('filterTenders') },
            { id: 'general', label: t('filterGeneral') }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-neutral-600 border border-neutral-200/80 shadow-2xs'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#003399] border-t-transparent animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading notices...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredNews.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200/80 p-8 max-w-lg mx-auto space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('emptyTitle')}</h3>
            <p className="text-xs text-slate-500">{t('emptySubtitle')}</p>
          </div>
        )}

        {/* NOTICES LIST */}
        {!isLoading && filteredNews.length > 0 && (
          <div className="space-y-8">
            
            {/* FEATURED / PINNED NOTICE BANNER */}
            {pinnedNotice && (
              <div 
                onClick={() => setSelectedNotice(pinnedNotice)}
                className="group relative bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl border border-blue-800/40 shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-amber-400/60"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  
                  {/* Image Column */}
                  <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[320px] lg:min-h-[360px] overflow-hidden">
                    {pinnedNotice.image_url ? (
                      <Image
                        src={pinnedNotice.image_url}
                        alt={locale === 'si' ? pinnedNotice.title_si : pinnedNotice.title_en}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-900/60 flex items-center justify-center p-8">
                        <Briefcase className="w-20 h-20 text-blue-300/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900" />
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-md">
                        <Pin className="w-3 h-3 fill-current" />
                        <span>{t('pinnedBadge')}</span>
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold tracking-wide border border-white/30">
                        {getCategoryBadge(pinnedNotice.category, pinnedNotice.badge_text_si, pinnedNotice.badge_text_en)}
                      </span>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-5">
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3 text-xs text-blue-200">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>
                            {new Date(pinnedNotice.published_at || pinnedNotice.created_at).toLocaleDateString(
                              locale === 'si' ? 'si-LK' : 'en-US',
                              { year: 'numeric', month: 'long', day: 'numeric' }
                            )}
                          </span>
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-amber-300">
                          {getCategoryBadge(pinnedNotice.category, pinnedNotice.badge_text_si, pinnedNotice.badge_text_en)}
                        </span>
                      </div>

                      {/* Prominent Headline in Larger Font */}
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-condensed text-white tracking-tight leading-snug group-hover:text-amber-300 transition-colors">
                        {locale === 'si' ? (pinnedNotice.title_si || pinnedNotice.title_en) : (pinnedNotice.title_en || pinnedNotice.title_si)}
                      </h3>

                      {/* Notice Excerpt */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-4">
                        {locale === 'si' ? (pinnedNotice.description_si || pinnedNotice.description_en) : (pinnedNotice.description_en || pinnedNotice.description_si)}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-2 flex items-center justify-between gap-4 border-t border-white/10">
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                        <span>{t('viewDetails')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleShare(pinnedNotice, e)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title={t('shareNotice')}
                      >
                        {copiedNoticeId === pinnedNotice.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* NOTICES GRID */}
            {gridNotices.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {gridNotices.map(notice => {
                  const title = locale === 'si' ? (notice.title_si || notice.title_en) : (notice.title_en || notice.title_si);
                  const desc = locale === 'si' ? (notice.description_si || notice.description_en) : (notice.description_en || notice.description_si);

                  return (
                    <article
                      key={notice.id}
                      onClick={() => setSelectedNotice(notice)}
                      className="group bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-[#003399]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                    >
                      <div>
                        {/* Image Frame */}
                        <div className="relative w-full aspect-16/10 bg-slate-100 overflow-hidden border-b border-slate-100">
                          {notice.image_url ? (
                            <Image
                              src={notice.image_url}
                              alt={title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                              <FileText className="w-12 h-12" />
                            </div>
                          )}

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border shadow-xs ${getCategoryColor(notice.category)}`}>
                              <Tag className="w-3 h-3" />
                              <span>{getCategoryBadge(notice.category, notice.badge_text_si, notice.badge_text_en)}</span>
                            </span>
                          </div>

                          {notice.is_pinned && (
                            <div className="absolute top-3 right-3">
                              <span className="p-1.5 rounded-full bg-amber-500 text-slate-950 shadow-xs flex items-center justify-center" title="Pinned">
                                <Pin className="w-3.5 h-3.5 fill-current" />
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Text Container */}
                        <div className="p-5 sm:p-6 space-y-3">
                          {/* Date */}
                          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                            <span>
                              {new Date(notice.published_at || notice.created_at).toLocaleDateString(
                                locale === 'si' ? 'si-LK' : 'en-US',
                                { year: 'numeric', month: 'short', day: 'numeric' }
                              )}
                            </span>
                          </div>

                          {/* Prominent Headline in Larger Bold Typography */}
                          <h3 className="text-base sm:text-lg font-bold font-condensed tracking-tight text-slate-900 group-hover:text-[#003399] transition-colors line-clamp-2 leading-snug">
                            {title}
                          </h3>

                          {/* Truncated Description */}
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {desc}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1.5 font-bold text-[#003399] group-hover:translate-x-1 transition-transform">
                          <span>{t('viewDetails')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleShare(notice, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title={t('shareNotice')}
                        >
                          {copiedNoticeId === notice.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                    </article>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>

      {/* FULL ANNOUNCEMENT DETAIL MODAL */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header Image (if exists) */}
            {selectedNotice.image_url && (
              <div className="relative w-full h-56 sm:h-72 bg-slate-950 shrink-0">
                <Image
                  src={selectedNotice.image_url}
                  alt={locale === 'si' ? selectedNotice.title_si : selectedNotice.title_en}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${getCategoryColor(selectedNotice.category)}`}>
                      {getCategoryBadge(selectedNotice.category, selectedNotice.badge_text_si, selectedNotice.badge_text_en)}
                    </span>
                    {selectedNotice.is_pinned && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black">
                        {t('pinnedBadge')}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-300 font-medium">
                    {new Date(selectedNotice.published_at || selectedNotice.created_at).toLocaleDateString(
                      locale === 'si' ? 'si-LK' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Modal Body (Scrollable) */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {!selectedNotice.image_url && (
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                  <span className={`px-3 py-1 rounded-full font-bold border ${getCategoryColor(selectedNotice.category)}`}>
                    {getCategoryBadge(selectedNotice.category, selectedNotice.badge_text_si, selectedNotice.badge_text_en)}
                  </span>
                  <span className="text-slate-400 font-medium">
                    {new Date(selectedNotice.published_at || selectedNotice.created_at).toLocaleDateString(
                      locale === 'si' ? 'si-LK' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </span>
                </div>
              )}

              {/* Headline */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-condensed tracking-tight text-slate-950 leading-snug">
                {locale === 'si' ? (selectedNotice.title_si || selectedNotice.title_en) : (selectedNotice.title_en || selectedNotice.title_si)}
              </h2>

              {/* Full Description with preserved line breaks */}
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4 font-normal">
                {locale === 'si' ? (selectedNotice.description_si || selectedNotice.description_en) : (selectedNotice.description_en || selectedNotice.description_si)}
              </div>

              {/* Action Contact Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-blue-950">{t('inquiries')}</h4>
                  <p className="text-[11px] text-blue-700">Panduwasnuwara MPCS Head Office • Kurunegala Rd, Hettipola</p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href="tel:0372291011"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#003399] hover:bg-[#002266] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>037 229 1011</span>
                  </a>

                  <a
                    href="https://wa.me/94764247716"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Modal Bottom Footer */}
            <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => handleShare(selectedNotice, e)}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                {copiedNoticeId === selectedNotice.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-500" />
                    <span>{t('shareNotice')}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedNotice(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                {t('closeModal')}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
