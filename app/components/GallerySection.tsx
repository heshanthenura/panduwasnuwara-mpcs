'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Heart, MessageSquare, Trash2, X, Send, Camera, ShieldCheck, LogOut, User } from 'lucide-react';
import { getClientId } from '@/lib/clientId';

export interface GalleryComment {
  id: string;
  post_id: string;
  author: string;
  text: string;
  created_at: string;
}

export interface GalleryPost {
  id: string;
  imageSrc: string;
  aspectRatio: string;
  likesCount: number;
  hasLiked: boolean;
  comments: GalleryComment[];
}

export default function GallerySection() {
  const t = useTranslations('Gallery');
  const locale = useLocale();
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState<GalleryPost | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string; isAdmin: boolean } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [animatingPostId, setAnimatingPostId] = useState<string | null>(null);

  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  const fetchGalleryData = async () => {
    try {
      const clientId = getClientId();
      const res = await fetch(`/api/gallery?clientId=${clientId}`);
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
      if (data.currentUser) {
        setCurrentUser(data.currentUser);
        setIsAdmin(Boolean(data.currentUser.isAdmin));
      }
    } catch (err) {
      console.error('Failed to load gallery posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (data.isAuthenticated && data.user) {
        setCurrentUser({
          username: data.user.username,
          role: data.user.role,
          isAdmin: Boolean(data.isAdmin)
        });
        setIsAdmin(Boolean(data.isAdmin));
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    } catch {
      setCurrentUser(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    fetchGalleryData();
    checkAuthStatus();
  }, []);

  // Sync active modal item on data refresh
  useEffect(() => {
    if (activePost) {
      const updated = posts.find(p => p.id === activePost.id);
      if (updated) {
        setActivePost(updated);
      }
    }
  }, [posts]);

  const handleToggleLike = async (post: GalleryPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    const clientId = getClientId();

    // Optimistic update
    setAnimatingPostId(post.id);
    setTimeout(() => setAnimatingPostId(null), 300);

    const willLike = !post.hasLiked;
    const newCount = willLike ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);

    setPosts(prev => prev.map(p => {
      if (p.id === post.id) {
        return { ...p, hasLiked: willLike, likesCount: newCount };
      }
      return p;
    }));

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'react', postId: post.id, clientId })
      });
      const data = await res.json();
      if (data.requireLogin) {
        setShowAuthModal(true);
        fetchGalleryData();
        return;
      }
      if (data.success) {
        setPosts(prev => prev.map(p => {
          if (p.id === post.id) {
            return { ...p, hasLiked: data.liked, likesCount: data.likesCount };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    if (!activePost || !commentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          postId: activePost.id,
          text: commentText
        })
      });

      const data = await res.json();
      if (data.requireLogin) {
        setShowAuthModal(true);
        return;
      }
      if (data.success && data.comment) {
        setPosts(prev => prev.map(p => {
          if (p.id === activePost.id) {
            return { ...p, comments: [...p.comments, data.comment] };
          }
          return p;
        }));
        setCommentText('');
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm(t('deleteConfirm'))) return;

    setDeletingCommentId(commentId);
    try {
      const res = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId })
      });

      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => {
          if (activePost && p.id === activePost.id) {
            return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
          }
          return p;
        }));
      } else {
        alert(data.error || 'Failed to delete comment');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    });
    setIsAdmin(false);
    setCurrentUser(null);
    fetchGalleryData();
  };

  return (
    <section
      id="gallery"
      className="w-full bg-[#FAFAFA] pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 font-sans scroll-mt-20 border-t border-neutral-200/80"
    >
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Camera className="w-3.5 h-3.5 text-slate-700" />
            <span>{t('eyebrow')}</span>
          </div>

          <h2 className="font-condensed text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight pt-1">
            {t('heading')}
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed pt-1">
            {t('subtext')}
          </p>

          {isAdmin && (
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 mt-2 rounded-full bg-white border border-neutral-200/90 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
              <span className="text-xs font-semibold text-neutral-800 tracking-tight">
                {t('adminBadge')}
              </span>
              <span className="w-px h-3.5 bg-neutral-200" />
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer group/exit"
              >
                <span>{t('logout')}</span>
                <LogOut className="w-3 h-3 text-neutral-400 group-hover/exit:text-neutral-700 transition-colors" />
              </button>
            </div>
          )}

          {currentUser && !isAdmin && (
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 mt-2 rounded-full bg-white border border-neutral-200/90 shadow-2xs">
              <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-700">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-neutral-800 tracking-tight">
                {t('userBadge')} <strong className="font-bold text-neutral-900">{currentUser.username}</strong>
              </span>
              <span className="w-px h-3.5 bg-neutral-200" />
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer group/exit"
              >
                <span>{t('logout')}</span>
                <LogOut className="w-3 h-3 text-neutral-400 group-hover/exit:text-neutral-700 transition-colors" />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 p-4 space-y-3">
                <div className="w-full aspect-4/3 bg-slate-100 rounded-xl" />
                <div className="h-6 bg-slate-100 rounded-lg w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div
                  onClick={() => setActivePost(post)}
                  className="relative w-full aspect-4/3 overflow-hidden bg-neutral-100 cursor-pointer"
                >
                  <Image
                    src={post.imageSrc}
                    alt="Gallery item"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                </div>

                <div className="p-4 sm:p-5 flex items-center justify-between border-t border-neutral-100">
                  <button
                    onClick={(e) => handleToggleLike(post, e)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-rose-50 transition-colors cursor-pointer group/like"
                    aria-label="React"
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform ${
                        post.hasLiked
                          ? 'fill-rose-500 text-rose-500 scale-110'
                          : 'text-neutral-500 group-hover/like:text-rose-500'
                      } ${animatingPostId === post.id ? 'scale-125' : ''}`}
                    />
                    <span
                      className={`text-xs font-mono font-semibold ${
                        post.hasLiked ? 'text-rose-600 font-bold' : 'text-neutral-600'
                      }`}
                    >
                      {post.likesCount}
                    </span>
                  </button>

                  <button
                    onClick={() => setActivePost(post)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-neutral-500" />
                    <span className="text-xs font-mono font-semibold text-neutral-600">
                      {post.comments.length}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-neutral-700" />
                <h3 className="font-condensed text-base sm:text-lg font-bold text-neutral-900">
                  {t('comments')} ({activePost.comments.length})
                </h3>
              </div>

              <button
                onClick={() => setActivePost(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
              {activePost.comments.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 text-xs sm:text-sm">
                  {t('noComments')}
                </div>
              ) : (
                activePost.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-neutral-200/80 flex items-start justify-between gap-3 group/item"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-700 shrink-0">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900">
                            {comment.author}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {new Date(comment.created_at).toLocaleDateString(locale === 'si' ? 'si-LK' : 'en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed break-words">
                          {comment.text}
                        </p>
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deletingCommentId === comment.id}
                        className="opacity-80 hover:opacity-100 p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {currentUser ? (
              <form onSubmit={handlePostComment} className="p-4 sm:p-5 border-t border-neutral-200 bg-white space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{t('commentingAs')}</span>
                  <strong className="font-semibold text-neutral-900">{currentUser.username}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={t('yourComment')}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-hidden focus:border-[#003399] focus:bg-white transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentText.trim()}
                    className="px-4 py-2 rounded-xl bg-[#003399] hover:bg-[#002266] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-xs shrink-0"
                  >
                    <span>{t('postComment')}</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 sm:p-5 border-t border-neutral-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <p className="text-xs font-bold text-neutral-800">{t('loginPromptTitle')}</p>
                  <p className="text-[11px] text-neutral-500">{t('loginPromptSubtitle')}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/${locale}/login`}
                    className="px-3.5 py-1.5 rounded-lg bg-[#003399] hover:bg-[#002266] text-white text-xs font-semibold transition-colors shadow-2xs"
                  >
                    {t('signInBtn')}
                  </Link>
                  <Link
                    href={`/${locale}/register`}
                    className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-neutral-200 text-neutral-700 text-xs font-semibold transition-colors"
                  >
                    {t('registerBtn')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth required modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-2xl max-w-sm w-full p-6 text-center space-y-5 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label={t('close')}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center text-slate-700">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-condensed text-lg font-bold text-neutral-900">
                {t('loginPromptTitle')}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {t('loginPromptSubtitle')}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <Link
                href={`/${locale}/login`}
                className="w-full py-2.5 px-4 rounded-xl bg-[#003399] hover:bg-[#002266] text-white text-xs font-semibold flex items-center justify-center transition-colors shadow-xs"
              >
                {t('signInBtn')}
              </Link>
              <Link
                href={`/${locale}/register`}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-neutral-200 text-neutral-800 text-xs font-semibold flex items-center justify-center transition-colors"
              >
                {t('registerBtn')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
