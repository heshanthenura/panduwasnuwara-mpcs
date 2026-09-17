'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { 
  Send, 
  MessageSquare, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  UserCheck, 
  Phone, 
  Mail, 
  FileText 
} from 'lucide-react';

interface InquiryFormProps {
  businessKey: string;
  businessNameEn: string;
  businessNameSi: string;
  buttonLabel?: string;
  buttonClassName?: string;
}

export default function InquiryForm({
  businessKey,
  businessNameEn,
  businessNameSi,
  buttonLabel,
  buttonClassName
}: InquiryFormProps) {
  const locale = useLocale();
  const isSi = locale === 'si';

  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Check auth on mount to prefill registered user details
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth');
        const data = await res.json();
        if (isMounted && data.isAuthenticated && data.user) {
          setCurrentUser(data.user);
          setUserName(data.user.fullName || data.user.username || '');
          setPhone(data.user.phone || '');
        }
      } catch (err) {
        console.error('Error checking auth:', err);
      } finally {
        if (isMounted) setIsCheckingAuth(false);
      }
    }
    checkAuth();
    return () => { isMounted = false; };
  }, []);

  const businessDisplayName = isSi ? businessNameSi : businessNameEn;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!userName.trim() || !phone.trim() || !subject.trim() || !message.trim()) {
      setErrorMsg(isSi ? 'කරුණාකර අවශ්‍ය සියලු තොරතුරු පුරවන්න.' : 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_key: businessKey,
          business_name: businessNameEn,
          user_name: userName.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          subject: subject.trim(),
          message: message.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setIsSuccess(true);
      // Reset form if guest
      if (!currentUser) {
        setUserName('');
        setPhone('');
        setEmail('');
      }
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || (isSi ? 'විමසීම යැවීමේදී දෝෂයක් සිදුවිය.' : 'An error occurred while sending your inquiry.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSuccess(false);
    setErrorMsg('');
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={buttonClassName || "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#003399] hover:bg-[#002266] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"}
      >
        <MessageSquare className="w-4 h-4" />
        <span>{buttonLabel || (isSi ? 'විමසීමක් යොමු කරන්න' : 'Send Inquiry')}</span>
      </button>

      {/* Inquiry Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-lg w-full overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-neutral-200 bg-slate-50/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-[#003399] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-condensed text-lg font-bold text-neutral-900 leading-tight">
                    {isSi ? 'විමසීමක් යොමු කරන්න' : 'Send Business Inquiry'}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    {businessDisplayName}
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-500 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
              {isSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-1.5 max-w-sm mx-auto">
                    <h4 className="font-condensed text-xl font-bold text-neutral-900">
                      {isSi ? 'විමසීම සාර්ථකව යොමු කෙරිණි!' : 'Inquiry Submitted Successfully!'}
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {isSi
                        ? 'ඔබගේ විමසීම අපගේ පරිපාලන අංශය වෙත ලැබී ඇත. අදාළ අංශයේ නිලධාරියෙකු කඩිනමින් ඔබව සම්බන්ධ කර ගනු ඇත.'
                        : 'Your inquiry has been routed to our admin office. A designated representative will contact you shortly.'}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#003399] hover:bg-[#002266] text-white text-xs font-bold transition-colors cursor-pointer mt-2"
                  >
                    {isSi ? 'වසන්න' : 'Done'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Registered user indicator */}
                  {currentUser && (
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                      <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        {isSi 
                          ? `ලියාපදිංචි සාමාජික: ${currentUser.fullName || currentUser.username}` 
                          : `Registered Member: ${currentUser.fullName || currentUser.username}`}
                      </span>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Name Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-700">
                      {isSi ? 'ඔබගේ නම' : 'Your Name'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      placeholder={isSi ? 'සම්පූර්ණ නම ඇතුළත් කරන්න' : 'Enter your full name'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-[#003399] transition-colors"
                    />
                  </div>

                  {/* Contact Fields Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-neutral-700">
                        {isSi ? 'දුරකථන / WhatsApp අංකය' : 'Phone / WhatsApp'} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          placeholder="07X XXX XXXX"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-[#003399] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-neutral-700">
                        {isSi ? 'විද්‍යුත් තැපෑල (විකල්ප)' : 'Email (Optional)'}
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-[#003399] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-700">
                      {isSi ? 'විමසීමට අදාළ මාතෘකාව' : 'Subject / Topic'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        placeholder={isSi ? 'විමසීමට අදාළ කෙටි මාතෘකාවක්...' : 'e.g. Loan scheme inquiry, Wholesale quotation...'}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-[#003399] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-700">
                      {isSi ? 'විමසීමේ විස්තරය' : 'Inquiry Message'} <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      placeholder={isSi ? 'ඔබගේ ගැටලුව හෝ විමසීම පිළිබඳ සවිස්තරාත්මකව සඳහන් කරන්න...' : 'Please describe your request, requirement, or questions in detail...'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-[#003399] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#003399] hover:bg-[#002266] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{isSi ? 'යොමු වෙමින් පවතී...' : 'Sending Inquiry...'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{isSi ? 'විමසීම යොමු කරන්න' : 'Submit Inquiry'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
