'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const [isOpen, setIsOpen] = useState(false);

  return (
    // ADDED: fixed, top-0, left-0, and z-50
    <nav className="fixed top-0 left-0 z-50 w-full bg-[#0f1115] text-white shadow-md font-sans">
      {/* Desktop / main navbar content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <Image
                src="/logo-photo.jpg"
                alt=""
                width={48}
                height={48}
              />
            </div>

            <span className="font-semibold tracking-wide text-sm md:text-lg hidden sm:block">
              {t('title')}
            </span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">

            <Link
              href="/"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              {t('home')}
            </Link>

            <div className="group cursor-pointer flex items-center gap-1 hover:text-gray-300 transition-colors duration-200">
              <span>{t('businesses')}</span>
            </div>

            <div className="group cursor-pointer flex items-center gap-1 hover:text-gray-300 transition-colors duration-200">
              <span>{t('membership')}</span>
            </div>

            <Link
              href="/gallery"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              {t('gallery')}
            </Link>

            <Link
              href="/contact"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              {t('contact')}
            </Link>

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300 focus:outline-none transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden w-full bg-[#1a1d24] border-t border-gray-800">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-4 space-y-2 text-sm font-medium flex flex-col">

            <Link
              href="/"
              className="block py-3 hover:text-gray-300 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t('home')}
            </Link>

            <div className="py-3 hover:text-gray-300 transition-colors flex justify-between items-center cursor-pointer">
              {t('businesses')}

              <svg
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>

            <div className="py-3 hover:text-gray-300 transition-colors flex justify-between items-center cursor-pointer">
              {t('membership')}

              <svg
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>

            <Link
              href="/gallery"
              className="block py-3 hover:text-gray-300 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t('gallery')}
            </Link>

            <Link
              href="/contact"
              className="block py-3 hover:text-gray-300 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t('contact')}
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}
